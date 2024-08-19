#!/bin/bash
set -e

# Start Redis server
redis-server --daemonize yes --appendonly yes --requirepass ${REDIS_PASSWORD}

# Start LiteLLM
litellm --config /app/litellm_config.yaml --port 4000 --num_workers 1 &

# Start FastAPI app
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 30000 --workers 1
