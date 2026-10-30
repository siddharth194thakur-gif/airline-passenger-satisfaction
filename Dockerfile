FROM python:3.12-slim-bookworm

# Install OpenJDK, curl (for readiness polling), and procps
RUN apt-get update && apt-get install -y --no-install-recommends \
    default-jdk-headless \
    curl \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python requirements and install
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy entire backend directory
COPY backend /app/backend

# Pre-compile Java engine classes
RUN mkdir -p /app/backend/java-engine/build && \
    javac -d /app/backend/java-engine/build \
          -cp /app/backend/java-engine/lib/weka.jar \
          /app/backend/java-engine/src/com/weka/prediction/WekaPredictionServer.java

# Make scripts executable
RUN chmod +x /app/backend/entrypoint.sh /app/backend/java-engine/start-engine.sh

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/backend
ENV WEKA_ENGINE_URL=http://127.0.0.1:8081
ENV WEKA_MODEL_PATH=/app/backend/model/projectmodel_weka.model

EXPOSE 8000

CMD ["/app/backend/entrypoint.sh"]
