"""
Compatibility wrapper so old imports (`from client_manager ...`) keep working
"""

import logging
from typing import Any, Dict, List, Optional

from mcp_client import MCPMultiClient

log = logging.getLogger(__name__)


class MCPClientManager:
    def __init__(self, cfg: Optional[Dict[str, Dict[str, Any]]] = None):
        self._cfg: Dict[str, Dict[str, Any]] = cfg or {}
        self._core: Optional[MCPMultiClient] = None
        self.initialized = False

    # ───────── public API ─────────
    async def initialize(self):
        if self.initialized:
            return True

        # instantiate the new client
        self._core = MCPMultiClient(self._cfg)

        # call the new coroutine (not the legacy shim)
        await self._core.initialize()          #  ← changed from .start()

        self.initialized = True
        return True

    async def list_tools(self):
        if not self.initialized:
            raise RuntimeError("MCP client not initialized")
        return await self._core.list_tools()
    
    async def list_mcps(self) -> List[str]:
        """Return a list of all connected MCP server names."""
        if not self.initialized:
            raise RuntimeError("MCP client not initialized")
        return list(self._cfg.keys())

    async def call_tool(self, name: str, args: Dict[str, Any]):
        if not self.initialized:
            raise RuntimeError("MCP client not initialized")
        return await self._core.call_tool(name, args)

    async def close(self):
        if self.initialized and self._core:
            await self._core.close()
            self.initialized = False
