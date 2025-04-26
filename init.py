import os, json, subprocess, sys
from pathlib import Path
from urllib.parse import urlparse

"""init.py
────────────────────────────────────────
Generate **mcp.json** + **.env** from an MCP payload.

Supported payload shapes
────────────────────────
1. **New style**
   {
     "settings": {
       "mcpServers": { … }
     }
   }
2. **Legacy list** of DB records (for back‑compat).

Environment‑variable handling
─────────────────────────────
• Each server may declare an `env` object.
• Values may be literal strings **or** a placeholder of the form
  "${VAR_NAME}".  Placeholders are substituted with the value from
  `os.environ.get("VAR_NAME")`.
• All resolved pairs are collected and written to **.env** (one per line).
• If no server declares env‑vars, `.env` is still created but empty.

Other features
──────────────
• GitHub‑backed MCPs are automatically cloned (only once) into a
  sandbox directory and their `uv` command rewritten to point at the
  local clone.
• Older DB‑record lists are normalised into the new dict format before
  processing.
"""

# ───────────────────────── helpers ─────────────────────────

def _repo_name(url: str) -> str:
    """Return repo name from a GitHub URL."""
    return os.path.splitext(os.path.basename(urlparse(url).path))[0]


def _clone_repo(github_url: str, base: Path) -> Path:
    """Clone **github_url** into *base* (if absent) and return path."""
    dest = base / _repo_name(github_url)
    if not dest.exists():
        print(f"⇢ cloning {github_url} → {dest}")
        subprocess.run(["git", "clone", github_url, str(dest)], check=True)
    return dest.resolve()


def _resolve_env(raw: dict) -> dict:
    """Expand ${VAR} placeholders using host environment."""
    resolved = {}
    for k, v in (raw or {}).items():
        if isinstance(v, str) and v.startswith("${") and v.endswith("}"):
            host_key = v[2:-1]
            resolved[k] = os.getenv(host_key, "")
        else:
            resolved[k] = v
    return resolved


def _write_outputs(cfg: dict, env_map: dict):
    """Write mcp.json & .env in CWD."""
    Path("mcp.json").write_text(json.dumps(cfg, indent=2))
    Path(".env").write_text("".join(f"{k}={v}\n" for k, v in env_map.items()))
    print(f"✓ wrote mcp.json and .env ({len(env_map)} var{'s' if len(env_map)!=1 else ''})")


# ───────────────────── per‑server normaliser ─────────────────────

def _normalise_server(name: str, conf: dict, sandbox_root: Path):
    """Return (updated_conf, resolved_env_dict)."""
    # Resolve env
    env_raw = conf.get("env", {}) or {}
    env_resolved = _resolve_env(env_raw)

    # Clone GitHub repo & patch uv args
    if "github" in conf:
        repo_path = _clone_repo(conf["github"], sandbox_root)
        if conf.get("command") == "uv" and conf.get("args"):
            script = conf["args"][-1]
            conf["args"] = ["--directory", str(repo_path), "run", script]

    return conf, env_resolved


# ───────────────────────── main entry ─────────────────────────

def init_mcp(payload, sandbox_base: str = "./mcp_sandboxes"):
    """Generate mcp.json + .env from *payload*."""
    sandbox_root = Path(sandbox_base).expanduser().resolve()
    sandbox_root.mkdir(parents=True, exist_ok=True)

    mcp_cfg = {"mcpServers": {}}
    env_accumulator: dict = {}

    # ─── New‑style dict ───
    if isinstance(payload, dict) and payload.get("settings"):
        servers = payload["settings"].get("mcpServers", {})
        for name, conf in servers.items():
            updated_conf, env_map = _normalise_server(name, conf.copy(), sandbox_root)
            mcp_cfg["mcpServers"][name] = updated_conf
            env_accumulator.update(env_map)

    # ─── Legacy list ───
    elif isinstance(payload, (list, tuple)):
        for rec in payload:
            name = rec.get("mcp_name") or rec.get("name")
            conf: dict = {}
            if rec.get("hosted") or rec.get("type") == "url":
                conf = {"url": rec.get("mcp_url", "")}
            else:
                # map legacy keys → new style
                conf = {
                    "command": rec.get("command"),
                    "args": rec.get("args", []),
                    "github": rec.get("github"),
                    "env": rec.get("env", {})
                }
            updated_conf, env_map = _normalise_server(name, conf, sandbox_root)
            mcp_cfg["mcpServers"][name] = updated_conf
            env_accumulator.update(env_map)
    else:
        raise ValueError("Unsupported payload format")

    _write_outputs(mcp_cfg, env_accumulator)


# ───────────────────────── CLI helper ─────────────────────────

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: python init.py <payload.json>")
        sys.exit(1)
    config_payload = json.loads(Path(sys.argv[1]).read_text())
    init_mcp(config_payload)
