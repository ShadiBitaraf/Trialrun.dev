#!/bin/bash

# Trialrun.dev Setup Script

echo "Setting up Trialrun.dev project..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Build Docker container
echo "Building Docker container..."
cd sandbox && docker build -t trialrun-sandbox .

echo "Setup complete! You can now run the project using:"
echo "- For local development: python startup.py"
echo "- For Docker: docker run -p 8000:8000 -e SANDBOX_ID=my-sandbox trialrun-sandbox"
echo "- For Docker Compose: docker-compose up" 