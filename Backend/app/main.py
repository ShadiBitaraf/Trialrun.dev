"""
FastAPI entry-point – 2025-04-28 safe build ②
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path
from typing import Any, Dict, List, get_origin

import httpx
from anthropic import Anthropic
from client_manager import MCPClientManager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from Backend.init import _normalise_server

# ─────────────────── env / logging
load_dotenv()
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("app")

SANDBOX_ID    = os.getenv("SANDBOX_ID",  "6XEJOvlItX4UIGOB2s0Z")
HANDSHAKE_URL = os.getenv("HANDSHAKE_URL",
                          "https://api-rough-bush-2430.fly.dev/handshake")
BASE_URL      = os.getenv("BASE_URL",    "http://localhost:8000")

anthropic  = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
client_mgr = MCPClientManager()

POLICY_PROMPT = """
You are connected to multiple MCP tool servers.
Emit a tool_use whenever it helps, then use the tool_result you receive.
""".strip()
SYSTEM_PROMPT: str | None = None

# ─────────────────── pydantic models
class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, Any]] = []

class ToolCallResult(BaseModel):
    content: List[Dict[str, Any]]

# ─────────────────── helpers
def _py_to_json_type(tp: Any) -> str:
    origin = get_origin(tp) or tp
    if origin is int:                 return "integer"
    if origin in (float, complex):    return "number"
    if origin is bool:                return "boolean"
    if origin in (list, tuple, set):  return "array"
    return "string"

async def _handshake() -> Dict[str, Any]:
    async with httpx.AsyncClient() as s:
        resp = await s.post(
            HANDSHAKE_URL,
            json={"sandbox_id": SANDBOX_ID, "base_url": BASE_URL},
            timeout=15,
        )
        resp.raise_for_status()
        data: Dict[str, Any] = resp.json()

    global SYSTEM_PROMPT
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

    log.info("normalised mcpServers: %s", json.dumps(servers, indent=2))
    Path("mcp.json").write_text(json.dumps({"mcpServers": servers}, indent=2))
    return servers

# ─────────────────── FastAPI
app = FastAPI(title="Trialrun.dev Sandbox")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
    allow_credentials=True,
)

@app.on_event("startup")
async def _startup():
    client_mgr._cfg = await _handshake()
    await client_mgr.initialize()

@app.on_event("shutdown")
async def _shutdown():
    await client_mgr.close()

# ─────────────────── utility endpoints
@app.get("/health")
async def health():
    return {"status": "ok", "servers": len(client_mgr._cfg),
            "sdk_connected": client_mgr.initialized}

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

# ─────────────────── main chat endpoint
@app.post("/chat")
async def chat(req: ChatRequest):
    if not client_mgr.initialized:
        raise HTTPException(503, "MCP not ready")

    # Build Anthropic-style tool list with JSON-schemas
    tools_json: List[Dict[str, Any]] = []
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
        tools_json.append({
            "name": tool.name,
            "description": getattr(tool, "description", "") or "",
            "input_schema": schema,
        })

    messages   = [{"role": "user", "content": req.message}]
    tools_used = []

    assistant = anthropic.messages.create(
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
        # ── call the tool ───────────────────────
        try:
            raw_result = await client_mgr.call_tool(item.name, item.input or {})
        except Exception as exc:
            raw_result = {"error": str(exc)}

        # ── ensure content is str | list[content-block] ─
        if isinstance(raw_result, list) and all(
                isinstance(x, dict) and "type" in x for x in raw_result):
            result_content = raw_result                # content-blocks
        else:
            result_content = json.dumps(raw_result, ensure_ascii=False)

        # ── feed back to Claude ─────────────────
        messages += [
            {"role": "assistant", "content": [item.model_dump()]},
            {"role": "user",      "content": [{
                "type": "tool_result",
                "tool_use_id": item.id,
                "content": result_content,
            }]},
        ]

        assistant = anthropic.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=messages,
        )

    final_text = "".join(p.text for p in assistant.content if p.type == "text")
    return {"response": final_text, "tools_used": tools_used}