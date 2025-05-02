# ---------------------------------------------------------
# backend/startup.py        (REPLACE THE WHOLE FILE)
# ---------------------------------------------------------
"""
Backend Startup Script – container entry-point

Responsibilities
────────────────
1. Call the central “handshake” endpoint to fetch the sandbox
   configuration (MCP server list, system prompt, …).
2. Feed that payload to `init_mcp()`, which writes `mcp.json`
   and `.env` so the rest of the backend can boot.
3. Launch the FastAPI app with Uvicorn.
"""

from __future__ import annotations

import asyncio
import logging
import os
import sys

import requests
import uvicorn
from app.main import app
from init import init_mcp  # ← NEW symbol name

log = logging.getLogger("startup")
logging.basicConfig(level=logging.INFO)


# ──────────────────────────────────────────────────────────
async def main() -> None:
    sandbox_id      = os.getenv("SANDBOX_ID",)
    central_api_url = os.getenv("CENTRAL_API_URL", "https://api-rough-bush-2430.fly.dev")
    base_url        = os.getenv("BASE_URL")

    log.info("Starting sandbox id=%s  base_url=%s", sandbox_id, base_url)

    # -----------------------------------------------------
    # 1) Handshake – always try, but don’t crash on error
    # -----------------------------------------------------
    try:
        log.info("⇢ handshake with central API …")
        resp = requests.post(
            f"{central_api_url}/handshake",
            json={"sandbox_id": sandbox_id, "base_url": base_url},
            timeout=15,
        )
        resp.raise_for_status()
        payload = resp.json()          # may be new- or old-style
        init_mcp(payload)              # writes mcp.json + .env
    except Exception as exc:
        log.exception("Handshake failed – continuing with local defaults (%s)", exc)

    # -----------------------------------------------------
    # 2) Launch FastAPI (blocks until Ctrl-C / SIGTERM)
    # -----------------------------------------------------
    log.info("⇢ starting FastAPI on 0.0.0.0:8000")
    server = uvicorn.Server(
        uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    )
    await server.serve()


# ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Uvicorn uses asyncio, so run the async `main()`
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        sys.exit(0)
