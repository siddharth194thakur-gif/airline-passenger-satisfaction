#!/bin/bash
# Production Entrypoint Script for Render Docker Deployment
# Supervises both Java WEKA Prediction Engine and FastAPI Backend

set -e

PORT="${PORT:-8000}"
WEKA_ENGINE_PORT="${WEKA_ENGINE_PORT:-8081}"
WEKA_MODEL_PATH="${WEKA_MODEL_PATH:-/app/backend/model/projectmodel_weka.model}"
WEKA_JAR="/app/backend/java-engine/lib/weka.jar"
BUILD_DIR="/app/backend/java-engine/build"
JAVA_OPTS="${JAVA_OPTS:--Xms128m -Xmx600m}"

echo "=================================================="
echo "Starting Airline Satisfaction Production Services"
echo "Render Port: $PORT"
echo "Java Engine Internal Port: $WEKA_ENGINE_PORT"
echo "Model Path: $WEKA_MODEL_PATH"
echo "Java Memory Limit: $JAVA_OPTS"
echo "=================================================="

# Check model exists
if [ ! -f "$WEKA_MODEL_PATH" ]; then
    echo "FATAL: Model file not found at $WEKA_MODEL_PATH"
    ls -la /app/backend/model/
    exit 1
fi

# Ensure Java classes are compiled
if [ ! -d "$BUILD_DIR/com/weka/prediction" ]; then
    echo "Compiling Java engine classes..."
    mkdir -p "$BUILD_DIR"
    javac -d "$BUILD_DIR" -cp "$WEKA_JAR" /app/backend/java-engine/src/com/weka/prediction/WekaPredictionServer.java
fi

# Launch Java Prediction Engine in background
echo "Starting Java WEKA Prediction Engine on 127.0.0.1:$WEKA_ENGINE_PORT..."
java $JAVA_OPTS -cp "$BUILD_DIR:$WEKA_JAR" com.weka.prediction.WekaPredictionServer "$WEKA_MODEL_PATH" "$WEKA_ENGINE_PORT" &
JAVA_PID=$!

# Trap signals for graceful container shutdown
cleanup() {
    echo "Received termination signal. Shutting down services..."
    if [ -n "$FASTAPI_PID" ]; then
        kill -TERM "$FASTAPI_PID" 2>/dev/null || true
    fi
    if [ -n "$JAVA_PID" ]; then
        kill -TERM "$JAVA_PID" 2>/dev/null || true
    fi
    wait
    echo "All services stopped."
    exit 0
}
trap cleanup SIGTERM SIGINT

# Wait for Java engine to initialize and load model into memory
echo "Waiting for Java WEKA engine to load the 70MB model into memory..."
MAX_ATTEMPTS=60
ATTEMPT=0
ENGINE_READY=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$WEKA_ENGINE_PORT/health" || true)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "SUCCESS: Java WEKA Engine is ready and model is in memory (attempt $ATTEMPT)!"
        ENGINE_READY=1
        break
    fi
    # Check if Java process died unexpectedly
    if ! kill -0 "$JAVA_PID" 2>/dev/null; then
        echo "FATAL: Java WEKA Engine process died prematurely! Check logs above."
        exit 1
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

if [ $ENGINE_READY -ne 1 ]; then
    echo "FATAL: Java engine did not become ready within $MAX_ATTEMPTS seconds."
    kill -TERM "$JAVA_PID" 2>/dev/null || true
    exit 1
fi

# Start FastAPI backend
echo "Starting FastAPI backend on 0.0.0.0:$PORT..."
cd /app/backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port "$PORT" --workers 1 &
FASTAPI_PID=$!

# Wait for both processes; if either exits, shut down
wait -n "$JAVA_PID" "$FASTAPI_PID"
cleanup
