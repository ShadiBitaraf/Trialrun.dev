import json
from pathlib import Path
from init import init_mcp

TEST_SANDBOX = Path("./test_mcp_sandboxes").resolve()
TEST_SANDBOX.mkdir(exist_ok=True)

# Load the real payload from JSON file
with open('test_payload.json') as f:
    PAYLOAD = json.load(f)

init_mcp(PAYLOAD, sandbox_base=str(TEST_SANDBOX))

print("\n✅ Payload processed successfully!")
