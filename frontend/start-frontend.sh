#!/bin/bash
# Script to start Vite React Frontend

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "Starting Frontend on http://localhost:5173..."
exec npm run dev -- --host 0.0.0.0 --port 5173
