#!/bin/bash
# Script to build and start the Java WEKA Prediction Server

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$DIR/../.." && pwd)"

# Detect Java
if [ -n "$JAVA_HOME" ] && [ -x "$JAVA_HOME/bin/java" ]; then
    JAVA_BIN="$JAVA_HOME/bin/java"
    JAVAC_BIN="$JAVA_HOME/bin/javac"
elif command -v java >/dev/null 2>&1; then
    JAVA_BIN="java"
    JAVAC_BIN="javac"
elif [ -x "/Applications/weka-3.8.7.app/Contents/runtime/Contents/Home/bin/java" ]; then
    JAVA_BIN="/Applications/weka-3.8.7.app/Contents/runtime/Contents/Home/bin/java"
    JAVAC_BIN="/Applications/weka-3.8.7.app/Contents/runtime/Contents/Home/bin/javac"
else
    echo "Error: Java runtime not found. Please install Java 17+ or set JAVA_HOME."
    exit 1
fi

PORT="${WEKA_ENGINE_PORT:-8081}"
MODEL_PATH="${WEKA_MODEL_PATH:-$PROJECT_ROOT/backend/model/projectmodel_weka.model}"
WEKA_JAR="$DIR/lib/weka.jar"
BUILD_DIR="$DIR/build"
JAVA_OPTS="${JAVA_OPTS:--Xms128m -Xmx768m}"

mkdir -p "$BUILD_DIR"

echo "Using Java binary: $JAVA_BIN"
echo "Compiling Java Weka Prediction Server..."
"$JAVAC_BIN" -d "$BUILD_DIR" -cp "$WEKA_JAR" "$DIR/src/com/weka/prediction/WekaPredictionServer.java"

echo "Starting Weka Prediction Server on port $PORT with options: $JAVA_OPTS..."
exec "$JAVA_BIN" $JAVA_OPTS -cp "$BUILD_DIR:$WEKA_JAR" com.weka.prediction.WekaPredictionServer "$MODEL_PATH" "$PORT"
