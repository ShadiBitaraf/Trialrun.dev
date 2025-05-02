"""
FastAPI entry-point – 2025-04-28 safe build ③
"""
from __future__ import annotations

import asyncio
import dataclasses
import json
import logging
import os
import time
from pathlib import Path
from typing import Any, Dict, List, get_origin

import httpx
from anthropic import AsyncAnthropic
from client_manager import MCPClientManager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from init import _normalise_server, init_mcp

# ─────────────────── env / logging ───────────────────

load_dotenv()
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("app")

SANDBOX_ID    = os.getenv("SANDBOX_ID",  "6XEJOvlItX4UIGOB2s0Z")
HANDSHAKE_URL = os.getenv("HANDSHAKE_URL",
                          "https://api-rough-bush-2430.fly.dev/handshake")
BASE_URL      = os.getenv("BASE_URL",    "http://localhost:8000")
CONFIG_CHECK_INTERVAL = 60  # Check for config changes every 60 seconds

anthropic_async = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
client_mgr      = MCPClientManager()

POLICY_PROMPT = """
You are connected to multiple MCP tool servers.
Emit a tool_use whenever it helps, then use the tool_result you receive.
Make sure to give the desired input and prompt the user of that input when needed.
""".strip()

SYSTEM_PROMPT: str | None = None
LAST_CONFIG_HASH: str | None = None

# ─────────────────── pydantic models ───────────────────


class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, Any]] = []


class ToolCallResult(BaseModel):
    content: List[Dict[str, Any]]

# ─────────────────── helpers ───────────────────


def _py_to_json_type(tp: Any) -> str:
    origin = get_origin(tp) or tp
    if origin is int:
        return "integer"
    if origin in (float, complex):
        return "number"
    if origin is bool:
        return "boolean"
    if origin in (list, tuple, set):
        return "array"
    return "string"


def _to_json_safe(o: Any) -> Any:
    """Return something that json.dumps can handle."""
    if isinstance(o, (str, int, float, bool)) or o is None:
        return o
    if dataclasses.is_dataclass(o):
        return dataclasses.asdict(o)
    if isinstance(o, BaseModel):
        return o.model_dump()
    if isinstance(o, dict):
        return {k: _to_json_safe(v) for k, v in o.items()}
    if isinstance(o, (list, tuple, set)):
        return [_to_json_safe(v) for v in o]
    return str(o)


def _hash_config(config: Dict[str, Any]) -> str:
    """Create a hash of the config to detect changes."""
    return json.dumps(config, sort_keys=True)


async def _handshake(include_base_url: bool = True) -> Dict[str, Any]:
    """
    Perform handshake with the server to get configuration.
    
    Args:
        include_base_url: Whether to include base_url in the handshake request.
                         Set to False for config checks to avoid overwriting.
    """
    handshake_data = {"sandbox_id": SANDBOX_ID}
    if include_base_url:
        handshake_data["base_url"] = BASE_URL
        
    async with httpx.AsyncClient() as s:
        resp = await s.post(
            HANDSHAKE_URL,
            json=handshake_data,
            timeout=15,
        )
        resp.raise_for_status()
        data: Dict[str, Any] = resp.json()

    global SYSTEM_PROMPT, LAST_CONFIG_HASH
    SYSTEM_PROMPT = (
        (data.get("system_prompt") or data.get("systemPrompt") or "") +
        "\n\n" + POLICY_PROMPT
    ).strip()

    raw = (
        data.get("settings", {}).get("mcpServers")
        or data.get("mcp_config", {}).get("mcpServers")
        or {}
    )
    repo = Path("./mcp_sandboxes").resolve()
    servers: Dict[str, Dict[str, Any]] = {}

    for name, conf in raw.items():
        if "url" in conf and "command" not in conf:
            log.warning("Skipping remote MCP server '%s' (%s)", name, conf["url"])
            continue
        norm, _ = _normalise_server(name, conf, repo)
        servers[name] = norm

    # Update the config hash
    LAST_CONFIG_HASH = _hash_config(servers)
    
    log.info("normalised mcpServers: %s", json.dumps(servers, indent=2))
    Path("mcp.json").write_text(json.dumps({"mcpServers": servers}, indent=2))
    return servers


async def _check_config_changes():
    """
    Periodically check for configuration changes from the handshake endpoint.
    If changes are detected, reinitialize the MCP client.
    """
    global LAST_CONFIG_HASH
    
    while True:
        try:
            log.info("Checking for configuration changes...")
            
            # Get current config without base_url to avoid overwriting
            data = await _handshake(include_base_url=False)
            
            # Calculate hash of new config
            new_hash = _hash_config(data)
            
            # If config has changed, reinitialize
            if LAST_CONFIG_HASH != new_hash:
                log.info("Configuration changes detected, reinitializing...")
                
                # Update the client manager configuration
                client_mgr._cfg = data
                
                # Close existing connections
                await client_mgr.close()
                
                # Reinitialize with new config
                await client_mgr.initialize()
                
                # Update the stored hash
                LAST_CONFIG_HASH = new_hash
                
                log.info("Reinitialization complete with new configuration")
            else:
                log.info("No configuration changes detected")
                
        except Exception as e:
            log.error(f"Error checking for configuration changes: {str(e)}")
            
        # Wait for the next check interval
        await asyncio.sleep(CONFIG_CHECK_INTERVAL)

# ─────────────────── FastAPI ───────────────────

app = FastAPI(title="Trialrun.dev Sandbox")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.on_event("startup")
async def _startup():
    client_mgr._cfg = await _handshake()
    await client_mgr.initialize()
    
    # Start the background task to check for config changes
    asyncio.create_task(_check_config_changes())


@app.on_event("shutdown")
async def _shutdown():
    await client_mgr.close()

# ─────────────────── utility endpoints ───────────────────


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "servers": len(client_mgr._cfg),
        "sdk_connected": client_mgr.initialized,
    }


@app.get("/tools")
async def tools():
    if not client_mgr.initialized:
        raise HTTPException(503, "MCP not ready")
    return {"tools": [t.model_dump() for t in await client_mgr.list_tools()]}


@app.post("/tools/execute", response_model=ToolCallResult)
async def exec_tool(req: Dict[str, Any]):
    if not client_mgr.initialized:
        raise HTTPException(503, "MCP not ready")
    res = await client_mgr.call_tool(req["name"], req.get("arguments", {}))
    return {"content": res}

# ─────────────────── main chat (non-stream) ───────────────────


@app.post("/chat")
async def chat(req: ChatRequest):
    if not client_mgr.initialized:
        raise HTTPException(503, "MCP not ready")

    # Build Anthropic-style tool list with JSON-schemas
    tools_json: List[Dict[str, Any]] = []
    for tool in await client_mgr.list_tools():
        # In the tools endpoint or where you define your tools
        schema = {"type": "object", "properties": {}, "required": []}
        for arg in getattr(tool, "arguments", []):
            jtype = _py_to_json_type(getattr(arg, "type_", str) or str)
            schema["properties"][arg.name] = {
                "type": jtype,
                "description": getattr(arg, "description", "") or "",
            }
            if getattr(arg, "required", True) is not False:
                schema["required"].append(arg.name)

        tools_json.append(
            {
                "name": tool.name,
                "description": getattr(tool, "description", "") or "",
                "input_schema": schema,
            }
        )

    messages = [{"role": "user", "content": req.message}]
    tools_used: List[str] = []

    assistant = await anthropic_async.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1000,
        messages=messages,
        system=SYSTEM_PROMPT,
        tools=tools_json,
    )

    for item in assistant.content:
        if item.type != "tool_use":
            continue
        tools_used.append(item.name)

        try:
            raw = await client_mgr.call_tool(item.name, item.input or {})
        except Exception as exc:
            raw = {"error": str(exc)}

        if isinstance(raw, list) and all(
            isinstance(x, dict) and "type" in x for x in raw
        ):
            result_content = raw
        else:
            safe = _to_json_safe(raw)
            result_content = json.dumps(safe, ensure_ascii=False)

        messages += [
            {"role": "assistant", "content": [item.model_dump()]},
            {
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": item.id,
                        "content": result_content,
                    }
                ],
            },
        ]

        assistant = await anthropic_async.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=messages,
        )

    final_text = "".join(p.text for p in assistant.content if p.type == "text")
    return {"response": final_text, "tools_used": tools_used}

# ─────────────────── SSE helpers ───────────────────


# Add this to the _format_sse function
async def _format_sse(event: str, data: Any) -> str:
    """Return a Server-Sent Event string."""
    json_data = json.dumps(_to_json_safe(data), ensure_ascii=False)
    formatted = f"event: {event}\ndata: {json_data}\n\n"
    print(f"Sending SSE: {formatted.strip()}")  # Debug log
    return formatted


# ─────────────────── streaming chat ───────────────────

@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    if not client_mgr.initialized:
        raise HTTPException(503, "MCP not ready")

    async def event_generator():
        try:
            # Build tool list with detailed schemas
            tools_json: List[Dict[str, Any]] = []
            tool_schemas = {}  # Store schemas for validation later
            
            for tool in await client_mgr.list_tools():
                schema = {"type": "object", "properties": {}, "required": []}
                for arg in getattr(tool, "arguments", []):
                    jtype = _py_to_json_type(getattr(arg, "type_", str) or str)
                    schema["properties"][arg.name] = {
                        "type": jtype,
                        "description": getattr(arg, "description", "") or "",
                    }
                    if getattr(arg, "required", True) is not False:
                        schema["required"].append(arg.name)
                
                tools_json.append(
                    {
                        "name": tool.name,
                        "description": getattr(tool, "description", "") or "",
                        "input_schema": schema,
                    }
                )
                tool_schemas[tool.name] = schema  # Save for later validation

            # Build initial message list (history + new user msg)
            messages: List[Dict[str, Any]] = [
                {"role": msg["role"], "content": msg["content"]}
                for msg in req.history
            ] if req.history else []
            messages.append({"role": "user", "content": req.message})

            tools_used: List[str] = []
            current_text = ""

            # Notify client that streaming starts
            yield await _format_sse("start", {"status": "started"})

            # Open Claude stream without stream_events parameter
            async with anthropic_async.messages.stream(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=messages,
                system=SYSTEM_PROMPT,
                tools=tools_json
            ) as stream:
                tool_use_detected = False
                tool_use = None
                
                async for chunk in stream:
                    # Handle text chunks
                    if chunk.type == "text":
                        current_text += chunk.text
                        yield await _format_sse("text", {"text": chunk.text})
                        await asyncio.sleep(0)
                    
                    # Handle content_block_delta chunks
                    elif (
                        chunk.type == "content_block_delta"
                        and chunk.delta.type == "text"
                    ):
                        current_text += chunk.delta.text
                        yield await _format_sse("text", {"text": chunk.delta.text})
                        await asyncio.sleep(0)

                    # Handle tool_use blocks
                    elif (
                        chunk.type == "content_block_start"
                        and chunk.content_block.type == "tool_use"
                    ):
                        tool_use_detected = True
                        tool_use = chunk.content_block
                        tools_used.append(tool_use.name)

                        # Validate required parameters
                        schema = tool_schemas.get(tool_use.name, {})
                        required_params = schema.get("required", [])
                        missing_params = [p for p in required_params if p not in (tool_use.input or {})]
                        
                        # Inform client about tool start
                        yield await _format_sse(
                            "tool_start",
                            {
                                "name": tool_use.name,
                                "input": tool_use.input,
                                "status": "starting",
                                "missing_params": missing_params,
                            },
                        )
                        await asyncio.sleep(0)
                        
                        # Log missing parameters if any
                        if missing_params:
                            log.warning(
                                "Tool %s called without required parameters: %s", 
                                tool_use.name, missing_params
                            )
                        
                        # Call the tool
                        try:
                            raw = await client_mgr.call_tool(
                                tool_use.name, tool_use.input or {}
                            )
                            tool_status = "success"
                        except Exception as exc:
                            log.error("Error calling tool %s: %s", tool_use.name, exc)
                            error_msg = str(exc)
                            
                            # Provide more helpful error messages for validation errors
                            if "validation error" in error_msg.lower():
                                raw = [{"type": "text", "text": f"Missing required information: {error_msg}"}]
                            else:
                                raw = [{"type": "text", "text": f"Error: {error_msg}"}]
                            tool_status = "error"
                        
                        # Serialize result
                        if isinstance(raw, list) and all(
                            isinstance(x, dict) and "type" in x for x in raw
                        ):
                            result_content = raw
                        else:
                            safe = _to_json_safe(raw)
                            result_content = json.dumps(safe, ensure_ascii=False)
                        
                        # Send result to client
                        yield await _format_sse(
                            "tool_result",
                            {
                                "name": tool_use.name,
                                "result": result_content,
                                "status": tool_status,
                            },
                        )
                        await asyncio.sleep(0)
                
                # If a tool was used, we need to continue the conversation with the tool result
                if tool_use_detected and tool_use:
                    # Add the tool use and result to the messages
                    messages += [
                        {
                            "role": "assistant",
                            "content": [
                                {
                                    "type": "tool_use",
                                    "id": tool_use.id,
                                    "name": tool_use.name,
                                    "input": tool_use.input or {}
                                }
                            ],
                        },
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "tool_result",
                                    "tool_use_id": tool_use.id,
                                    "content": result_content,
                                }
                            ],
                        },
                    ]
                    
                    # Continue the conversation with a new stream
                    yield await _format_sse("text", {"text": "\n\nProcessing the tool result...\n\n"})
                    
                    # Start a new stream with the updated messages
                    async with anthropic_async.messages.stream(
                        model="claude-3-5-sonnet-20241022",
                        max_tokens=1000,
                        messages=messages,
                    ) as continued_stream:
                        async for cont_chunk in continued_stream:
                            if cont_chunk.type == "text":
                                current_text += cont_chunk.text
                                yield await _format_sse("text", {"text": cont_chunk.text})
                                await asyncio.sleep(0)
                            elif (
                                cont_chunk.type == "content_block_delta"
                                and cont_chunk.delta.type == "text"
                            ):
                                current_text += cont_chunk.delta.text
                                yield await _format_sse("text", {"text": cont_chunk.delta.text})
                                await asyncio.sleep(0)

            # Send final event
            yield await _format_sse(
                "done",
                {"response": current_text, "tools_used": tools_used, "status": "completed"},
            )

        except Exception as exc:
            log.exception("Streaming error: %s", exc)
            yield await _format_sse(
                "error", {"message": f"Server error: {str(exc)}"}
            )
            yield await _format_sse(
                "done",
                {
                    "response": "I'm sorry, there was a server error.",
                    "tools_used": [],
                    "status": "error",
                },
            )

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "X-Accel-Buffering": "no",
        },
    )



# ─────────────────── list MCP servers ───────────────────


@app.get("/mcps")
async def list_mcps():
    if not client_mgr.initialized:
        raise HTTPException(503, "MCP not ready")

    tools = await client_mgr.list_tools()

    # extract unique MCP names – tool name might be "mcp/tool"
    mcp_set = {tool.name.split("/")[0] for tool in tools}

    # include server names from handshake config
    mcp_set.update(client_mgr._cfg.keys())

    return {"mcps": sorted(mcp_set)}

# Add this new model to the pydantic models section
class MCPServerConfig(BaseModel):
    """Configuration for an MCP server."""
    command: str = None
    args: List[str] = None
    url: str = None
    env: Dict[str, str] = None
    github: str = None

class ConfigureRequest(BaseModel):
    """Request body for the /configure endpoint."""
    servers: Dict[str, MCPServerConfig]

# Add this new endpoint
@app.post("/configure")
async def configure(req: ConfigureRequest):
    """
    Add or update MCP server configurations.
    """
    if not client_mgr.initialized:
        raise HTTPException(503, "MCP not ready")
    
    try:
        # Convert request to dict
        servers_dict = {name: config.model_dump(exclude_none=True) 
                       for name, config in req.servers.items()}
        
        # Create a payload structure that init_mcp can understand
        payload = {
            "settings": {
                "mcpServers": servers_dict
            }
        }
        
        # Close existing connections first
        await client_mgr.close()
        
        # Use the same initialization process as during startup
        session_id = init_mcp(payload)
        
        # Reload the configuration from the newly written mcp.json
        with open("mcp.json", "r") as f:
            mcp_config = json.load(f)
        
        # Update the client manager configuration
        client_mgr._cfg = mcp_config.get("mcpServers", {})
        
        # Reinitialize with new config
        await client_mgr.initialize()
        
        # Update the config hash
        global LAST_CONFIG_HASH
        LAST_CONFIG_HASH = _hash_config(client_mgr._cfg)
        
        return {
            "status": "success",
            "message": f"Added/updated {len(req.servers)} MCP server(s)",
            "servers": list(client_mgr._cfg.keys())
        }
    except Exception as e:
        log.error(f"Error configuring servers: {e}")
        raise HTTPException(500, f"Error configuring servers: {str(e)}")
from fastapi import Body

# Add this to the pydantic models section
class UserConfigResponse(BaseModel):
    """Response for the /user-config endpoint."""
    config: str

@app.get("/user-config")
async def get_user_config():
    """
    Retrieve the user-defined MCP server configurations.
    Returns the raw JSON content as a string from the user_config.json file.
    """
    try:
        config_path = Path("user_config.json")
        if config_path.exists():
            config_content = config_path.read_text()
            return {"config": config_content}
        else:
            # Return empty config if file doesn't exist
            return {"config": "{\n  \"servers\": {}\n}"}
    except Exception as e:
        log.error(f"Error reading user configuration: {e}")
        raise HTTPException(500, f"Error reading user configuration: {str(e)}")

@app.post("/save-user-config")
async def save_user_config(config_text: str = Body(...)):
    """
    Save user-defined MCP server configurations.
    
    The request body should be the raw JSON text of the configuration.
    This will be saved to user_config.json and also applied to the current configuration.
    """
    try:
        # Parse the JSON to validate it
        try:
            config_data = json.loads(config_text)
            if not isinstance(config_data, dict) or "servers" not in config_data:
                raise ValueError("Configuration must contain a 'servers' object")
        except json.JSONDecodeError:
            raise HTTPException(400, "Invalid JSON format")
        
        # Save the raw text to file
        config_path = Path("user_config.json")
        config_path.write_text(config_text)
        
        # Create a payload structure that init_mcp can understand
        payload = {
            "settings": {
                "mcpServers": config_data["servers"]
            }
        }
        
        # Close existing connections first
        await client_mgr.close()
        
        # Use the same initialization process as during startup
        session_id = init_mcp(payload)
        
        # Reload the configuration from the newly written mcp.json
        with open("mcp.json", "r") as f:
            mcp_config = json.load(f)
        
        # Update the client manager configuration
        client_mgr._cfg = mcp_config.get("mcpServers", {})
        
        # Reinitialize with new config
        await client_mgr.initialize()
        
        # Update the config hash
        global LAST_CONFIG_HASH
        LAST_CONFIG_HASH = _hash_config(client_mgr._cfg)
        
        return {
            "status": "success",
            "message": "User configuration saved and applied",
            "servers": list(client_mgr._cfg.keys())
        }
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Error saving user configuration: {e}")
        raise HTTPException(500, f"Error saving user configuration: {str(e)}")
