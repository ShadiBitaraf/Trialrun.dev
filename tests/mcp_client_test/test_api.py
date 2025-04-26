"""
API Tests - Test suite for the API endpoints
This module tests the API endpoints, including:
1. Health check endpoint
2. Chat endpoint
3. Sandbox registration endpoint

These tests ensure that the API is functioning correctly and returning
the expected responses.
"""

import asyncio
import aiohttp
import json
import logging
import os
import sys

# Fix import path to find modules in the project root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def test_health_endpoint():
    """Test the health endpoint"""
    async with aiohttp.ClientSession() as session:
        url = "http://localhost:8000/health"
        logger.info(f"Testing health endpoint: {url}")

        try:
            async with session.get(url) as response:
                status = response.status
                data = await response.json()
                logger.info(f"Health endpoint status: {status}")
                logger.info(f"Health endpoint data: {json.dumps(data, indent=2)}")
                return status == 200
        except Exception as e:
            logger.error(f"Error testing health endpoint: {str(e)}")
            return False


async def test_chat_endpoint():
    """Test the chat endpoint"""
    async with aiohttp.ClientSession() as session:
        url = "http://localhost:8000/chat"
        payload = {"message": "Hello, this is a test message", "history": []}

        logger.info(f"Testing chat endpoint: {url}")
        logger.info(f"Payload: {json.dumps(payload, indent=2)}")

        try:
            async with session.post(url, json=payload) as response:
                status = response.status
                data = await response.json()
                logger.info(f"Chat endpoint status: {status}")
                logger.info(f"Chat endpoint data: {json.dumps(data, indent=2)}")
                return status == 200
        except Exception as e:
            logger.error(f"Error testing chat endpoint: {str(e)}")
            return False


async def test_sandbox_register_endpoint():
    """Test the sandbox register endpoint"""
    async with aiohttp.ClientSession() as session:
        url = "http://localhost:8000/sandbox/register"
        logger.info(f"Testing sandbox register endpoint: {url}")

        try:
            async with session.post(url) as response:
                status = response.status
                data = await response.json()
                logger.info(f"Sandbox register endpoint status: {status}")
                logger.info(
                    f"Sandbox register endpoint data: {json.dumps(data, indent=2)}"
                )
                return status == 200
        except Exception as e:
            logger.error(f"Error testing sandbox register endpoint: {str(e)}")
            return False


async def main():
    """Main function to run API tests"""
    logger.info("Starting API tests")

    # First check if the API is running
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                "http://localhost:8000/health", timeout=2
            ) as response:
                if response.status == 200:
                    logger.info("API server is running")
                else:
                    logger.warning(f"API server returned status {response.status}")
    except Exception as e:
        logger.error(f"Could not connect to API server: {str(e)}")
        logger.error(
            "Make sure to start the API server first (uvicorn api:app --reload)"
        )
        return

    # Run the tests
    health_ok = await test_health_endpoint()
    chat_ok = await test_chat_endpoint()
    register_ok = await test_sandbox_register_endpoint()

    # Report results
    logger.info("Test results:")
    logger.info(f"  Health endpoint: {'PASS' if health_ok else 'FAIL'}")
    logger.info(f"  Chat endpoint: {'PASS' if chat_ok else 'FAIL'}")
    logger.info(f"  Sandbox register endpoint: {'PASS' if register_ok else 'FAIL'}")

    if health_ok and chat_ok and register_ok:
        logger.info("All tests PASSED!")
    else:
        logger.warning("Some tests FAILED!")


if __name__ == "__main__":
    asyncio.run(main())
