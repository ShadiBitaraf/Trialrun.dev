FROM python:3.11.6-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Install the MCP SDK in development mode
RUN pip install -e .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV SANDBOX_ID=default-sandbox
ENV CENTRAL_API_URL=https://api-rough-bush-2430.fly.dev
ENV APP_ENV=production

# Ensure directories exist
RUN mkdir -p /app/logs

# Expose port
EXPOSE 8000

# Run startup script (path from docker-compose.yml)
CMD ["python", "startup.py"] 