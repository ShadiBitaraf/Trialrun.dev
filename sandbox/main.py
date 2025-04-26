"""
Backend Main Application - FastAPI application for the Backend service
This module implements the primary Backend FastAPI application that:
1. Integrates with the MCP SDK for tool management
2. Handles Claude AI integration for chat functionality
3. Manages the handshake process with the central API
4. Provides health monitoring endpoints

This is the modern implementation using the MCP SDK and Claude Integration,
replacing the older api.py in the root directory.
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import os
import json
import logging
import aiohttp
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import asyncio

# Load environment variables from .env file
load_dotenv()

# Import the actual SDK structures
from mcp_sdk import MCPClientManager, MCPToolHandler
from mcp_sdk.claude import ClaudeIntegration
from mcp_sdk.tools import ToolRegistry
from mcp_client import mcp_client

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app")

# Create FastAPI app
app = FastAPI(title="Trialrun.dev Sandbox")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Get environment variables
sandbox_id = os.getenv("SANDBOX_ID", "default-sandbox")
central_api_url = os.getenv("CENTRAL_API_URL", "https://api-rough-bush-2430.fly.dev")

# Create SDK components
client_manager = MCPClientManager()
tool_registry = ToolRegistry()
tool_handler = MCPToolHandler(client_manager)
claude_integration = ClaudeIntegration(
    tool_handler=tool_handler,
    tool_registry=tool_registry,
    api_key=os.getenv("ANTHROPIC_API_KEY"),  # Explicitly pass API key from environment
)

# Flag that SDK is available
SDK_AVAILABLE = True


async def load_mcp_config_at_startup():
    """Load MCP configurations from local file at startup"""
    try:
        if os.path.exists("mcp_config.json"):
            with open("mcp_config.json", "r") as f:
                config_data = json.load(f)
                if "mcpServers" in config_data:
                    logger.info(
                        f"Loading MCP configurations from local file. Found {len(config_data['mcpServers'])} servers."
                    )
                    # Update MCP client
                    mcp_client.mcp_servers = config_data["mcpServers"]
                    # Connect to servers
                    await mcp_client.connect()

                    # Update SDK client manager
                    client_manager.mcp_servers = config_data["mcpServers"]
                    # Initialize client manager
                    await client_manager.initialize()

                    # Register tools
                    for server_name, config in config_data["mcpServers"].items():
                        if "capabilities" in config:
                            tool_registry.register_tools_from_server(
                                server_name, config["capabilities"]
                            )
                            logger.info(f"Registered tools from server: {server_name}")
                    return True
    except Exception as e:
        logger.error(f"Error loading MCP configurations from file: {str(e)}")
    return False


@app.on_event("startup")
async def startup_event():
    """Function that runs at startup"""
    logger.info("Starting application, loading MCP configurations...")
    success = await load_mcp_config_at_startup()
    if success:
        logger.info("Successfully loaded MCP configurations")
    else:
        logger.warning("Failed to load MCP configurations from file")


class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any] = {}
    history: List[Dict[str, Any]] = []


class ChatResponse(BaseModel):
    response: str


class HandshakeResponse(BaseModel):
    sandbox_id: str
    status: str
    mcpServers: Dict[str, Any] = {}


# Dependency to ensure MCP client is initialized
async def get_mcp_client():
    if not mcp_client.initialized:
        raise HTTPException(status_code=503, detail="MCP client not initialized")
    return mcp_client


async def perform_handshake_with_central_api(
    sandbox_id: str, base_url: str
) -> Dict[str, Any]:
    """
    Perform handshake with Rishabh's central API to get MCP configurations.

    Args:
        sandbox_id: The sandbox ID to register
        base_url: The base URL of this API

    Returns:
        Dict containing the MCP server configurations
    """
    try:
        async with aiohttp.ClientSession() as session:
            handshake_url = f"{central_api_url}/handshake"
            payload = {"sandbox_id": sandbox_id, "base_url": base_url}

            logger.info(f"Calling handshake endpoint with payload: {payload}")
            async with session.post(
                handshake_url, json=payload, timeout=10
            ) as response:
                if response.status == 200:
                    response_data = await response.json()
                    logger.info("Handshake successful")

                    # Save the full config
                    with open("handshake_response.json", "w") as f:
                        json.dump(response_data, f, indent=2)

                    # Extract MCP configurations
                    if "mcp_config" in response_data:
                        # Save MCP config to a file for Shashank's script
                        with open("mcp_config.json", "w") as f:
                            json.dump(response_data["mcp_config"], f, indent=2)

                        # Store system prompt if provided
                        if "system_prompt" in response_data:
                            with open("system_prompt.txt", "w") as f:
                                f.write(response_data["system_prompt"])

                        # Return just the MCP servers
                        if "mcpServers" in response_data["mcp_config"]:
                            return response_data["mcp_config"]["mcpServers"]

                    logger.warning("No MCP config in handshake response")
                    return {}
                else:
                    error_text = await response.text()
                    logger.error(
                        f"Handshake failed with status {response.status}: {error_text}"
                    )
                    return {}
    except Exception as e:
        logger.error(f"Error during handshake: {str(e)}")
        return {}


async def get_mcp_configs() -> Dict[str, Any]:
    """
    Get MCP configurations by performing handshake or loading from local file.
    Used as a dependency to provide configs to endpoints.
    """
    # Try to load from a local file first
    try:
        if os.path.exists("mcp_config.json"):
            with open("mcp_config.json", "r") as f:
                config_data = json.load(f)
                if "mcpServers" in config_data:
                    return config_data["mcpServers"]
    except Exception as e:
        logger.error(f"Error loading config from file: {str(e)}")

    # If no file or loading failed, perform handshake
    base_url = os.getenv("BASE_URL", "http://localhost:8000")
    mcp_servers = await perform_handshake_with_central_api(sandbox_id, base_url)
    return mcp_servers


@app.get("/")
async def root():
    return {
        "message": "Welcome to Trialrun.dev Sandbox",
        "status": "active",
        "sandbox_id": sandbox_id,
    }


@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running."""
    return {
        "status": "healthy",
        "sandbox_id": sandbox_id,
        "mcp_client_initialized": mcp_client.initialized,
        "mcp_servers_count": (
            len(mcp_client.mcp_servers) if mcp_client.initialized else 0
        ),
        "sdk_available": SDK_AVAILABLE,
        "client_manager_initialized": client_manager.initialized,
        "tool_registry_count": len(tool_registry.tools),
    }


@app.post("/handshake", response_model=HandshakeResponse)
async def perform_handshake(background_tasks: BackgroundTasks, force: bool = False):
    """
    Endpoint to perform handshake with the central API.
    This is used to initialize or reinitialize the sandbox.

    Args:
        force: If True, forces a new handshake even if one has been completed.
    """
    try:
        # Get base URL
        base_url = os.getenv("BASE_URL", "http://localhost:8000")

        # Perform the handshake with the central API
        mcp_configs = await perform_handshake_with_central_api(sandbox_id, base_url)

        if mcp_configs:
            # Update the MCP client config
            mcp_client.mcp_servers = mcp_configs

            # Connect to servers
            if not mcp_client.initialized:
                await mcp_client.connect()

            # Update the SDK client manager with the MCP configs
            client_manager.mcp_servers = mcp_configs
            await client_manager.initialize()

            # Register tools from MCP servers
            for server_name, config in mcp_configs.items():
                if "capabilities" in config:
                    tool_registry.register_tools_from_server(
                        server_name, config["capabilities"]
                    )

            return {
                "sandbox_id": sandbox_id,
                "status": "active",
                "mcpServers": mcp_configs,
            }
        else:
            raise HTTPException(
                status_code=500, detail="Handshake returned no MCP configurations"
            )
    except Exception as e:
        logger.error(f"Error during handshake: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Handshake error: {str(e)}")


@app.get("/mcp-tools")
async def get_available_tools(mcp_configs: Dict[str, Any] = Depends(get_mcp_configs)):
    """
    Returns a list of available MCP tools.
    """
    try:
        tools = []

        # Extract tools from MCP configurations
        for server_name, config in mcp_configs.items():
            tools.append(
                {
                    "name": server_name,
                    "type": "hosted" if "url" in config else "local",
                    "status": "available",
                }
            )

        return {"tools": tools}
    except Exception as e:
        logger.error(f"Error retrieving MCP tools: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat(request: ChatRequest):
    """Handle chat requests with Claude and MCP tools"""
    try:
        # Get the MCP client instance
        from mcp_client import mcp_client

        # Ensure MCP client is connected
        if not mcp_client.initialized:
            # Get MCP configs and initialize client
            mcp_configs = await get_mcp_configs()
            mcp_client.mcp_servers = mcp_configs
            await mcp_client.connect()

            # Update the SDK client manager with the MCP configs
            client_manager.mcp_servers = mcp_configs
            await client_manager.initialize()

            # Register tools from MCP servers
            for server_name, config in mcp_configs.items():
                if "capabilities" in config:
                    tool_registry.register_tools_from_server(
                        server_name, config["capabilities"]
                    )

        # Get system prompt if available
        system_prompt = os.getenv("SYSTEM_PROMPT", "")
        system_prompt_path = "system_prompt.txt"
        if os.path.exists(system_prompt_path):
            try:
                with open(system_prompt_path, "r") as f:
                    system_prompt = f.read().strip()
                    logger.info(f"Loaded system prompt from {system_prompt_path}")
            except Exception as e:
                logger.error(f"Error loading system prompt: {str(e)}")

        # Use SDK if available
        if SDK_AVAILABLE:
            try:
                # Make sure Claude integration is initialized
                if not claude_integration.session:
                    await claude_integration.initialize()

                # Process message using the SDK's Claude integration
                response = await claude_integration.chat(
                    message=request.message,
                    history=request.history,
                    system_prompt=system_prompt,
                    enable_tools=True,
                )

                return response
            except Exception as e:
                logger.error(f"Error using Claude SDK: {str(e)}")
                # Fall back to a basic response if SDK fails
                return {
                    "status": "error",
                    "response": f"Error processing with Claude SDK: {str(e)}",
                    "error": True,
                }
        else:
            # SDK not available, return placeholder response
            return {
                "status": "error",
                "response": f"Claude SDK not available. Your message was: {request.message}",
                "is_placeholder": True,
            }

    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sandbox/register")
async def register_sandbox():
    """
    Endpoint for sandbox container registration with the central API.
    This implements the SAIP handshake process by calling Rishabh's API.
    This endpoint is maintained for backward compatibility with existing tests and scripts.
    """
    sandbox_id = os.getenv("SANDBOX_ID", "default-sandbox")
    base_url = os.getenv("BASE_URL", "http://localhost:8000")

    try:
        # Call the central API for handshake
        mcp_configs = await perform_handshake_with_central_api(sandbox_id, base_url)

        if mcp_configs:
            # Update MCP client with new configurations
            mcp_client.mcp_servers = mcp_configs

            # Reconnect to the servers
            await mcp_client.connect()

            # Update the SDK client manager with the MCP configs
            client_manager.mcp_servers = mcp_configs
            await client_manager.initialize()

            # Register tools from MCP servers
            for server_name, config in mcp_configs.items():
                if "capabilities" in config:
                    tool_registry.register_tools_from_server(
                        server_name, config["capabilities"]
                    )

            return {
                "status": "registered",
                "sandbox_id": sandbox_id,
                "mcp_servers_count": len(mcp_configs),
            }
        else:
            return {
                "status": "error",
                "sandbox_id": sandbox_id,
                "error": "No MCP servers in handshake response",
            }
    except Exception as e:
        logger.error(f"Error during registration: {str(e)}")
        return {"status": "error", "sandbox_id": sandbox_id, "error": str(e)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
