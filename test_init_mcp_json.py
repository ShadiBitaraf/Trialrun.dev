"""
pytest-friendly smoke test for init.py using the “weather_test” payload.
Run directly with:  python test_init_mcp_json.py
"""

import os
import json
import shutil
from pathlib import Path

# import the new public entrypoint
from init import init_mcp          # ← make sure init.py is on PYTHONPATH

# ────────────────────────────────────────────────────────────
# test input (verbatim from user prompt)
# ────────────────────────────────────────────────────────────
PAYLOAD = {
    "base_url": "http://localhost:8000",
    "isActive": True,
    "description": "weather_test_desc",
    "customization": {
        "buttonColor": "#38B2AC",
        "backgroundColor": "#1A202C",
        "userMessageColor": "#3182CE",
        "botMessageColor": "#4A5568"
    },
    "createdAt": "2025-04-26T05:12:43.169000+00:00",
    "settings": {
        "mcpServers": {
            "weather": {
                "github": "https://github.com/shashankshriram123/local_mcp_test.git",
                "command": "uv",
                "args": [
                    "--directory", "/",
                    "run", "weather.py"
                ],
                # ─── API-key block (leave empty or add more keys) ───
                "env": {
                    "OPENWEATHER_API_KEY": "${OPENWEATHER_API_KEY}"
                }
            }
        }
    },
    "systemPrompt": "test_adgfafasdfdsaf",
    "updatedAt": "2025-04-26T17:52:02.128000+00:00",
    "name": "weather_test"
}

# ────────────────────────────────────────────────────────────
# test setup
# ────────────────────────────────────────────────────────────
TEST_SANDBOX = Path("./test_mcp_sandboxes").resolve()
TEST_SANDBOX.mkdir(exist_ok=True)

# wipe old outputs if they exist
for f in ("mcp.json", ".env"):
    if Path(f).exists():
        Path(f).unlink()

# ────────────────────────────────────────────────────────────
# run generator
# ────────────────────────────────────────────────────────────
init_mcp(PAYLOAD, sandbox_base=str(TEST_SANDBOX))

# ────────────────────────────────────────────────────────────
# inspect results
# ────────────────────────────────────────────────────────────
with open("mcp.json") as f:
    cfg = json.load(f)

print("\n📄 mcp.json")
print(json.dumps(cfg, indent=2))

# ────────────────────────────────────────────────────────────
# assertions
# ────────────────────────────────────────────────────────────
# 1. The weather entry exists and uses uv
assert "weather" in cfg["mcpServers"]
weather_conf = cfg["mcpServers"]["weather"]
assert weather_conf["command"] == "uv"

# 2. Args patched: ["--directory", <absolute-path>, "run", "weather.py"]
args = weather_conf["args"]
assert args[:1] == ["--directory"]
assert os.path.isabs(args[1])                              # repo path absolute
assert Path(args[1]).is_dir()                              # repo actually cloned
assert args[2:] == ["run", "weather.py"]

# 3. .env should be empty (no env vars defined)
with open(".env") as f:
    env_content = f.read()
assert env_content.strip() == ""

print("\n✅  weather_test payload passed!")

# ────────────────────────────────────────────────────────────
# optional cleanup (uncomment if desired)
# ────────────────────────────────────────────────────────────
# shutil.rmtree(TEST_SANDBOX)
# Path("mcp.json").unlink(); Path(".env").unlink()
