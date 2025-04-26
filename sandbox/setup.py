from setuptools import setup, find_packages

setup(
    name="mcp_sdk",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "aiohttp>=3.8.5",
        "anthropic>=0.15.0",
        "python-dotenv>=1.0.0",
    ],
    description="MCP SDK for Trialrun.dev",
    author="Trialrun.dev Team",
)
