#!/bin/bash
# =============================================================================
# MCP Client Test Runner - Script to run all MCP client and SDK tests
# 
# This script:
# 1. Sets up the test environment
# 2. Starts a mock MCP server
# 3. Runs tests for the MCP client
# 4. Runs tests for the initialization script
# 5. Runs tests for the Claude integration
# 6. Starts an API server for testing
# 7. Runs tests against the API endpoints
# 8. Cleans up all test resources
#
# Run this script from the project root to test all MCP client functionality.
# =============================================================================

# Set working directory to project root to ensure correct imports
cd "$(dirname "$0")/../.."
export PYTHONPATH=$PYTHONPATH:$(pwd)

echo "==== Installing MCP SDK locally ===="
# Install the SDK in development mode
pip install -e . 2>/dev/null || echo "SDK already installed"

echo "==== Starting mock MCP server ===="
# Start the mock server in background
echo "Creating mock_mcp_server.py..."
cat > tests/mcp_client_test/mock_mcp_server.py << 'EOF'
"""
Mock MCP server for testing
"""
import asyncio
from aiohttp import web
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

routes = web.RouteTableDef()

@routes.get("/health")
async def health(request):
    return web.json_response({"status": "ok"})

@routes.post("/chat")
async def chat(request):
    data = await request.json()
    message = data.get("message", "")
    return web.json_response({
        "response": f"Mock response to: {message}",
        "status": "success"
    })

@routes.post("/execute")
async def execute_tool(request):
    data = await request.json()
    tool = data.get("tool", "")
    parameters = data.get("parameters", {})
    
    if tool == "test.get_weather":
        location = parameters.get("location", "Unknown")
        return web.json_response({
            "status": "success",
            "result": f"Weather for {location}: Sunny, 72°F"
        })
    else:
        return web.json_response({
            "status": "error",
            "error": f"Unknown tool: {tool}"
        })

async def main():
    app = web.Application()
    app.add_routes(routes)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 8001)
    
    logger.info("Starting mock MCP server on http://localhost:8001")
    await site.start()
    
    # Keep the server running
    while True:
        await asyncio.sleep(3600)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Mock MCP server shutting down")
EOF

# Start the mock server in background
python tests/mcp_client_test/mock_mcp_server.py &
MOCK_SERVER_PID=$!

# Give the server a moment to start
sleep 2

echo "==== Creating test config ===="
cat > mcp_config.json << 'EOF'
{
  "mcpServers": {
    "weather": {
      "url": "http://localhost:8001"
    },
    "test_local": {
      "command": "echo",
      "args": ["Test command output"]
    }
  }
}
EOF

echo "==== Running MCP client tests ===="
python tests/mcp_client_test/test_mcp_client.py

echo "==== Running initialization script test ===="
python tests/mcp_client_test/init_placeholder.py

echo "==== Running Claude integration tests ===="
# Set a fake API key for testing
export ANTHROPIC_API_KEY="test_api_key_for_testing_only"
python tests/mcp_client_test/test_claude_integration.py

echo "==== Starting API server ===="
# Create a temporary API file for testing
cat > test_api.py << 'EOF'
"""
Simple FastAPI server for testing the handshake API
"""
from fastapi import FastAPI, HTTPException
import uvicorn
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging

app = FastAPI()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, Any]] = []

@app.get("/health")
async def health():
    return {"status": "ok", "service": "test_api"}

@app.post("/chat")
async def chat(request: ChatRequest):
    return {
        "response": f"Received: {request.message}",
        "status": "success"
    }

@app.post("/sandbox/register")
async def sandbox_register():
    """Rishabh's handshake API implementation"""
    return {
        "status": "registered",
        "sandbox_id": "test_sandbox_123",
        "config": {
            "mcpServers": {
                "weather": {
                    "url": "http://localhost:8001"
                }
            }
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
EOF

# Start API server in background
python test_api.py &
API_SERVER_PID=$!

# Give the API server a moment to start
sleep 3

echo "==== Testing API endpoints ===="
python tests/mcp_client_test/test_api.py

echo "==== Testing handshake API call ===="
# Direct test of the handshake API
if command -v curl &> /dev/null; then
    echo "Testing with curl:"
    curl -X POST http://localhost:8000/sandbox/register
    echo -e "\n"
else
    echo "Curl not found, testing with Python:"
    python -c "
import requests
response = requests.post('http://localhost:8000/sandbox/register')
print(response.json())
"
fi

echo "==== Cleaning up ===="
# Kill the mock server and API server
kill $MOCK_SERVER_PID
kill $API_SERVER_PID

# Remove temporary files
rm test_api.py
rm mcp_config.json

echo "==== All tests completed! ====" 