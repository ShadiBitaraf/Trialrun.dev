# backend/mcp_client.py   (2025-04-28 stable)

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any, Dict, List

from mcp import ClientSession, StdioServerParameters
from mcp.client.sse import sse_client
from mcp.client.stdio import stdio_client
from mcp.types import Tool

log = logging.getLogger(__name__)

BOOT_TIMEOUT      = 60   # overall per server
INIT_CALL_TIMEOUT = 10   # single initialize() attempt


# ────────────────────────────────────────────────────────────
class _CtxHolder:
    """Keeps any async-context-manager (transport or session) alive."""
    def __init__(self, cm):  self.cm = cm; self.obj = None
    async def enter(self):   self.obj = await self.cm.__aenter__(); return self.obj
    async def exit(self):    await self.cm.__aexit__(None, None, None)


# ────────────────────────────────────────────────────────────
class MCPMultiClient:
    """Aggregates multiple MCP servers behind a single interface."""

    def __init__(self, mcp_servers: Dict[str, Dict[str, Any]]):
        self._cfg      = mcp_servers
        self._sessions: Dict[str, ClientSession] = {}
        self._ctxs: List[_CtxHolder] = []        # keeps transports + sessions open
        self._lock = asyncio.Lock()
        self.initialized = False

    async def start(self):                  # back-compat
        await self.initialize()

    async def initialize(self) -> None:
        await asyncio.gather(*(self._connect(n, c) for n, c in self._cfg.items()))
        self.initialized = True

    async def _connect(self, name: str, conf: Dict[str, Any]) -> None:
        async def _boot() -> None:
            # 1) open transport -------------------------------------------------
            if "command" in conf:
                log.info("⏳  launching local '%s' → %s %s",
                         name, conf['command'], conf.get('args'))
                transport = _CtxHolder(stdio_client(StdioServerParameters(
                    command=conf["command"], args=conf.get("args", []), env=conf.get("env"))))
            elif "url" in conf:
                log.info("⏳  connecting remote '%s' (%s)", name, conf["url"])
                transport = _CtxHolder(sse_client(conf["url"]))
            else:
                raise RuntimeError(f"Server '{name}' has no command or url")

            read, write = await transport.enter()
            self._ctxs.append(transport)

            # 2) open ClientSession as context manager -------------------------
            session_holder = _CtxHolder(ClientSession(read, write))
            session = await session_holder.enter()
            self._ctxs.append(session_holder)

            # 3) warm-up loop ---------------------------------------------------
            start = time.monotonic()
            while int(time.monotonic() - start) < BOOT_TIMEOUT:
                try:
                    await asyncio.wait_for(session.initialize(), timeout=INIT_CALL_TIMEOUT)
                    tools = (await session.list_tools()).tools
                    self._sessions[name] = session
                    log.info("🟢  '%s' ready (%d tool%s)",
                             name, len(tools), "" if len(tools) == 1 else "s")
                    return
                except asyncio.TimeoutError:
                    log.warning("'%s' still warming – initialize() timed-out", name)
                except Exception as exc:
                    log.warning("'%s' still warming – %s", name, exc)
                await asyncio.sleep(1)

            raise TimeoutError(f"{name} boot timed-out after {BOOT_TIMEOUT}s")

        try:
            await asyncio.wait_for(_boot(), timeout=BOOT_TIMEOUT + 5)
        except Exception as exc:
            log.error("❌  %s: %s", name, exc)

    # ───────────── public helpers ─────────────
    async def close(self) -> None:
        for h in self._ctxs: await h.exit()
        self.initialized = False

    async def list_tools(self) -> List[Tool]:
        tools: List[Tool] = []
        async with self._lock:
            for s in self._sessions.values():
                tools.extend((await s.list_tools()).tools)
        return tools

    async def call_tool(self, name: str, args: Dict[str, Any]) -> Any:
        async with self._lock:
            for s in self._sessions.values():
                if any(t.name == name for t in (await s.list_tools()).tools):
                    return (await s.call_tool(name, args)).content
        raise ValueError(f"Tool '{name}' not found on any connected server")