# Testing the MCP Client Implementation

This document provides step-by-step instructions for testing your MCP client implementation before sharing it with your teammates.

## Prerequisites

- Python 3.8 or higher
- FastAPI
- Uvicorn
- Aiohttp

## Testing Steps

### 1. Start the Mock MCP Server

First, start the mock MCP server that will simulate an actual MCP server:

```bash
python mock_mcp_server.py
```

This will start a simple FastAPI server on port 8001 that provides the basic endpoints needed for testing.

### 2. Test the MCP Client Directly

Next, test the MCP client directly to ensure it can connect to servers:

```bash
python test_mcp_client.py
```

This script will:

- Create an MCP client with a test configuration
- Try to connect to the mock MCP server
- Check if the connection was successful
- Close the connection properly

You should see log messages confirming that the client connected successfully.

### 3. Test the API with the MCP Client

In a new terminal, start the FastAPI server with your implementation:

```bash
# Copy the test configuration
cp test_mcp_config.json mcp_config.json

# Start the API server
uvicorn api:app --reload
```

### 4. Run the API Tests

Finally, run the API test script to test the endpoints:

```bash
python test_api.py
```

This will test:

- The health endpoint (`/health`)
- The chat endpoint (`/chat`)
- The sandbox register endpoint (`/sandbox/register`)

All tests should pass if your implementation is working correctly.

## Manual Testing

You can also manually test the API using curl:

```bash
# Health check
curl http://localhost:8000/health

# Chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, world!", "history": []}'

# Sandbox register
curl -X POST http://localhost:8000/sandbox/register
```

## What to Verify

Make sure:

1. The MCP client can connect to MCP servers
2. The FastAPI application starts and loads the MCP client
3. All endpoints return the expected responses
4. No errors are logged in the server console

## Next Steps

Once all tests pass, you can:

1. Document any learnings or issues you found
2. Share your implementation with your teammates
3. Integrate with Shashank's initialization script
4. Work with Rakesh on the Claude integration
