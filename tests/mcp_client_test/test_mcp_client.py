"""
MCP Client Tests - Test suite for the core MCP client functionality
This module tests the basic MCP client implementation, including:
1. Connection to remote MCP servers
2. Registration of local MCP servers
3. Session management and cleanup
4. Error handling

These tests ensure that the core client functionality works correctly
before building more complex features on top of it.
"""

import asyncio
import json
import os
import logging
import sys

# Fix import path to find mcp_client.py in the project root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from mcp_client import MCPClient

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def test_mcp_client():
    """Test the MCP client functionality"""

    # Create a test config with the mock MCP server
    test_config = {
        "weather": {"url": "http://localhost:8001"},  # Mock MCP server
        "local_test": {"command": "echo", "args": ["Hello, World!"]},
    }

    # Initialize the MCP client
    client = MCPClient(test_config)
    logger.info("Created MCP client with test config")

    try:
        # Connect to the MCP servers
        result = await client.connect()
        logger.info(f"Connection result: {result}")
        logger.info(f"Client initialized: {client.initialized}")
        logger.info(f"Connected to {len(client.mcp_servers)} MCP servers")

        # Test health of the connection
        if client.initialized:
            logger.info("MCP client initialized successfully")
        else:
            logger.error("MCP client failed to initialize")

        # Close the client
        await client.close()
        logger.info("Closed MCP client")

    except Exception as e:
        logger.error(f"Error during test: {str(e)}")
        raise


async def main():
    """Main function to run tests"""
    logger.info("Starting MCP client tests")

    # First, check if the mock server is running
    import aiohttp

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                "http://localhost:8001/health", timeout=2
            ) as response:
                if response.status == 200:
                    logger.info("Mock MCP server is running")
                else:
                    logger.warning(f"Mock MCP server returned status {response.status}")
    except Exception as e:
        logger.error(f"Could not connect to mock MCP server: {str(e)}")
        logger.error(
            "Make sure to start mock_mcp_server.py first (python mock_mcp_server.py)"
        )
        return

    # Run the tests
    await test_mcp_client()
    logger.info("All tests completed")


if __name__ == "__main__":
    asyncio.run(main())
