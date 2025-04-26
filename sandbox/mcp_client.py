"""
#TODO: UPDATE W RAKESH WORKING VERSION
MCP Client - Core client for interacting with MCP servers
This module provides the MCPClient class, which is responsible for:
1. Establishing and maintaining connections to MCP servers
2. Handling both remote HTTP-based and local subprocess-based MCP servers
3. Providing a unified interface for the API to interact with different MCP servers

This client serves as the foundation for the more feature-rich MCP SDK.
"""

from typing import Dict, List, Any, Optional
import logging
import aiohttp
import asyncio

logger = logging.getLogger(__name__)


class MCPClient:
    """
    MCP Client for interacting with MCP servers.
    This client provides the core infrastructure for connecting to MCP servers.
    The SDK handles tool format conversion, response formatting, and protocol communication.
    """

    def __init__(self, config: Optional[Dict[str, Dict[str, Any]]] = None):
        self.mcp_servers: Dict[str, Dict[str, Any]] = config or {}
        self.initialized = False
        self.session: Optional[aiohttp.ClientSession] = None

    async def connect(self):
        """
        Connect to all configured MCP servers.
        This follows the SDK interface pattern.
        """
        if not self.session:
            self.session = aiohttp.ClientSession()

        # Initialize connections to each MCP server
        for server_name, server_config in self.mcp_servers.items():
            try:
                if "url" in server_config:
                    # For remote servers, test the connection
                    url = server_config["url"]
                    async with self.session.get(f"{url}/health", timeout=5) as response:
                        if response.status == 200:
                            logger.info(f"Connected to MCP server: {server_name}")
                        else:
                            logger.error(
                                f"Failed to connect to MCP server {server_name}: {response.status}"
                            )
                else:
                    # TODO: initilizatino code has to handle local server initialization via subprocess
                    logger.info(f"Local MCP server registered: {server_name}")
            except Exception as e:
                logger.error(f"Error connecting to MCP server {server_name}: {str(e)}")

        self.initialized = True
        logger.info(f"MCP client connected to {len(self.mcp_servers)} servers")
        return True

    async def close(self):
        """Close the MCP client and all connections."""
        if self.session:
            await self.session.close()
        self.initialized = False
        logger.info("MCP client closed")


# Create a singleton instance to be used by FastAPI
mcp_client = MCPClient()
