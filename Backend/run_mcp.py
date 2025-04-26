#!/usr/bin/env python3
"""
run_mcp.py – universal FastMCP launcher (handles version pins)

✓ Ensures required packages (with version pins) are installed
✓ Adds script’s folder to sys.path
✓ Imports the script, finds `mcp`, runs it over stdio
"""

from __future__ import annotations

import argparse
import importlib.util
import pathlib
import re
import subprocess
import sys
import traceback

# ------------------------------------------------------------------ #
# Packages required INSIDE the child process
# ------------------------------------------------------------------ #
NEEDED_PKGS = ("mcp>=0.9.0", "fastmcp>=0.9.0", "httpx")

_VERSION_RE = re.compile(r"[<>=~!].*")  # matches first version spec symbol


def _ensure_pkgs() -> None:
    """Install required packages if the base import is not found."""
    missing: list[str] = []
    for req in NEEDED_PKGS:
        module_name = _VERSION_RE.split(req, maxsplit=1)[0]  # "mcp>=0.9" -> "mcp"
        if importlib.util.find_spec(module_name) is None:
            missing.append(req)

    if missing:
        print(f"⇢ installing: {' '.join(missing)}", file=sys.stderr)
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-q", *missing],
            check=False,
        )


def _die(msg: str) -> None:
    print(msg, file=sys.stderr)
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("script", help="Path to the MCP script that defines `mcp`")
    args = parser.parse_args()

    script_path = pathlib.Path(args.script).expanduser().resolve()
    if not script_path.exists():
        _die(f"❌  file not found: {script_path}")

    _ensure_pkgs()

    # allow `import something` relative to the script directory
    repo_dir = script_path.parent
    if str(repo_dir) not in sys.path:
        sys.path.insert(0, str(repo_dir))

    # dynamic import of target script
    spec = importlib.util.spec_from_file_location("mcp_module", str(script_path))
    module = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    try:
        spec.loader.exec_module(module)             # type: ignore[union-attr]
    except Exception:                               # pylint: disable=broad-except
        traceback.print_exc()
        _die("❌  crash while importing the script.")

    mcp = getattr(module, "mcp", None)
    if mcp is None or not hasattr(mcp, "run"):
        _die("❌  FastMCP instance `mcp` not found in script.")

    try:
        mcp.run(transport="stdio")
    except Exception:                               # pylint: disable=broad-except
        traceback.print_exc()
        _die("❌  crash inside mcp.run().")


if __name__ == "__main__":
    main()