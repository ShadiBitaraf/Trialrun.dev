"""
Tool Registry for MCP SDK
"""


class ToolRegistry:
    """Registry for MCP tools"""

    def __init__(self):
        """Initialize the Tool Registry"""
        self.tools = {}

    def register_tool(self, name, handler):
        """Register a tool"""
        self.tools[name] = handler

    def get_tool(self, name):
        """Get a tool by name"""
        return self.tools.get(name)

    def list_tools(self):
        """List all registered tools"""
        return list(self.tools.keys())
