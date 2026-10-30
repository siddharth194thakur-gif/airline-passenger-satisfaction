#!/bin/bash
# Script to start FastAPI backend

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

if [ -f "$DIR/venv/bin/activate" ]; then
    source "$DIR/venv/bin/activate"
fi

export PYTHONPATH="$DIR"
PORT="${PORT:-8000}"
HOST="${HOST:-0.0.0.0}"

echo "Starting FastAPI backend on http://$HOST:$PORT..."
exec python3 -m uvicorn app.main:app --host "$HOST" --port "$PORT" --reload
