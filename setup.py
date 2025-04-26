from setuptools import setup, find_packages

setup(
    name="mcp_sdk",
    version="0.1.0",
    description="MCP SDK for Trialrun.dev",
    author="Trialrun.dev Team",
    author_email="support@trialrun.dev",
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[
        "aiohttp>=3.8.5",
        "anthropic>=0.15.0",
        "python-dotenv>=1.0.0",
    ],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
)
