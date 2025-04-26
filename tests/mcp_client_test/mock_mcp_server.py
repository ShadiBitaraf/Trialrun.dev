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
