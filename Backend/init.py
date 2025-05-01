# ── Backend/init.py ───────────────────────────────────────────
"""
Creates mcp.json + .env for the backend and clones any GitHub repos
mentioned in the handshake payload.

🔄 2025-04-26 update
────────────────────
• Replaces all  "uv … run python <script>"  launches with a generic
  runner:   python  <backend>/run_mcp.py  <script_path>
  so no external `uv` binary is required and every MCP server is
  started the same way.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import uuid
from pathlib import Path
from urllib.parse import urlparse

# Path to the generic launcher we ship with the backend
GENERIC_RUNNER = Path(__file__).with_name("run_mcp.py").resolve()


# ────────────────────────── helpers ──────────────────────────
def _repo_name(url: str) -> str:
    return os.path.splitext(os.path.basename(urlparse(url).path))[0]


def _clone_if_needed(url: str, base: Path) -> Path:
    dst = base / _repo_name(url)
    if not dst.exists():
        print(f"⇢ cloning {url} → {dst}")
        subprocess.run(["git", "clone", url, str(dst)], check=True)
    return dst.resolve()


def _write_files(cfg: dict, envs: dict[str, str]) -> None:
    with open("mcp.json", "w") as f:
        json.dump(cfg, f, indent=2)
    with open(".env", "w") as f:
        for k, v in envs.items():
            f.write(f"{k}={v}\n")
    print(f"✓ generated mcp.json and .env ({len(envs)} vars)")


# ────────────────────── normalise one server ─────────────────
def _normalise_server(name: str, conf: dict, repo_base: Path):
    """
    • clones Git repo when present
    • rewrites `uv …` commands to use our generic run_mcp.py wrapper
    • returns  (normalised_conf,   collected_env_vars)
    """
    env_out = conf.get("env", {}) or {}
    new_conf = conf.copy()

    # ─ Optionally clone GitHub repo ─
    repo_path: Path | None = None
    if "github" in conf:
        repo_path = _clone_if_needed(conf["github"], repo_base)

    # ─ Always adapt `uv` commands ─
    if conf.get("command") == "uv":
        # last token is assumed to be the script name
        script = conf.get("args", [])[-1] if conf.get("args") else "main.py"
        script_path = (
            (repo_path / script).resolve()
            if repo_path
            else Path(script).expanduser().resolve()
        )

        new_conf["command"] = "python"
        new_conf["args"] = [str(GENERIC_RUNNER), str(script_path)]

    # Drop empty env blocks (keeps JSON tidy)
    if not env_out:
        new_conf.pop("env", None)

    return new_conf, env_out


# ─────────────────────────── main API ────────────────────────
def init_mcp(payload, sandbox_base: str = "./mcp_sandboxes", session_id: str = None):
    """
    Accepts either:
    • NEW style  – single dict containing `settings.mcpServers`
    • OLD style  – list of DB records

    Emits mcp.json + .env next to the backend code.
    
    Args:
        payload: The configuration payload
        sandbox_base: Base directory for sandboxes
        session_id: Optional session ID for the handshake
    """
    repo_base = Path(sandbox_base).expanduser().resolve()
    repo_base.mkdir(parents=True, exist_ok=True)

    # Generate a session ID if not provided
    if session_id is None:
        session_id = str(uuid.uuid4())
    
    # Store session_id in environment variables
    env_vars = {"SESSION_ID": session_id}
    
    mcp_cfg: dict = {"mcpServers": {}}

    # ─── new-style payload ───
    if isinstance(payload, dict) and "settings" in payload:
        # Add session_id to the payload for future API calls
        if "sandbox_id" in payload:
            payload["session_id"] = session_id
            
        servers = payload["settings"].get("mcpServers", {})
        for name, conf in servers.items():
            norm, env = _normalise_server(name, conf, repo_base)
            mcp_cfg["mcpServers"][name] = norm
            env_vars.update(env)

    # ─── old list-of-records ───
    elif isinstance(payload, (list, tuple)):
        from copy import deepcopy

        for rec in payload:
            name = rec["mcp_name"]
            conf = deepcopy(rec)
            conf.pop("mcp_name", None)
            
            # Add session_id to each record
            conf["session_id"] = session_id

            # hosted URL?
            if rec.get("hosted") or rec.get("type") == "url":
                conf = {"url": rec.get("mcp_url", "")}

            norm, env = _normalise_server(name, conf, repo_base)
            mcp_cfg["mcpServers"][name] = norm
            env_vars.update(env)

    else:
        raise ValueError("Unsupported payload type supplied to init_mcp()")

    _write_files(mcp_cfg, env_vars)
    
    return session_id


# ───────── CLI helper:  python init.py payload.json ──────────
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: python init.py <payload.json>")
        sys.exit(1)
    
    payload_data = json.loads(Path(sys.argv[1]).read_text())
    
    # Check if session_id is in the payload, otherwise generate one
    session_id = payload_data.get("session_id") if isinstance(payload_data, dict) else None
    
    # Initialize MCP with the payload and session_id
    init_mcp(payload_data, session_id=session_id)
