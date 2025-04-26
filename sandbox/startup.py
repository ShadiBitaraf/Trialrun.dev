"""
Container startup script - Entry point for the Backend service container
This script initializes and starts the Backend FastAPI application.
It handles:
1. Environment setup and configuration
2. Handshake with the central API (commented out pending Shashank's implementation)
3. Server startup and configuration
4. Logging and error handling

This will be the main entry point when running the backend in a container.
"""

import os
import asyncio
import logging
from main import app


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("startup")


async def main():
    """
    Startup script for the sandbox container.
    This will perform the handshake with the central API and start the FastAPI server.
    """
    # Get environment variables
    sandbox_id = os.getenv("SANDBOX_ID", "default-sandbox")
    central_api_url = os.getenv("CENTRAL_API_URL", "https://api.trialrun.dev")

    logger.info(f"Starting sandbox with ID: {sandbox_id}")
    logger.info(f"Central API URL: {central_api_url}")

    # Perform handshake with central API
    try:
        logger.info("Performing initial handshake with central API...")
        # mcp_configs = await handshake_manager.perform_handshake()
        # logger.info(
        #     f"Handshake completed. Received {len(mcp_configs)} MCP server configurations."
        # )

        # Log the received configurations
        # for server_name, config in mcp_configs.items():
        #     if "url" in config:
        #         logger.info(f"  - {server_name}: Hosted at {config['url']}")
        #     elif "command" in config:
        #         logger.info(f"  - {server_name}: Local command '{config['command']}'")
        #     else:
        #         logger.info(f"  - {server_name}: Unknown configuration type")

        # Validate connections to MCP servers
        logger.info("Validating connections to MCP servers...")
        # connection_statuses = await handshake_manager.validate_mcp_connections()

        # for server_name, status in connection_statuses.items():
        #     if status is True:
        #         logger.info(f"  - {server_name}: Connection successful")
        #     elif status is False:
        #         logger.warning(f"  - {server_name}: Connection failed")
        #     else:
        #         logger.info(
        #             f"  - {server_name}: Connection status unknown (local server)"
        #         )

    # except HandshakeError as e:
    #     logger.error(f"Handshake error: {str(e)}")
    #     logger.info("Continuing with startup using demo configurations.")
    except Exception as e:
        logger.error(f"Unexpected error during initialization: {str(e)}")
        logger.info("Continuing with startup anyway for development purposes.")

    # Start server
    logger.info("Starting FastAPI server...")
    import uvicorn

    config = uvicorn.Config(app, host="0.0.0.0", port=8000)
    server = uvicorn.Server(config)

    logger.info("Server is ready to accept connections.")
    await server.serve()


if __name__ == "__main__":
    asyncio.run(main())
