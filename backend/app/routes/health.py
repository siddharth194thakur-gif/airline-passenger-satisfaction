from fastapi import APIRouter
from app.services.weka_client import weka_client

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
async def get_health():
    java_status = await weka_client.check_health()
    backend_status = "healthy"
    model_loaded = java_status.get("model_loaded", False)

    overall_healthy = model_loaded and java_status.get("status") == "healthy"

    return {
        "status": "healthy" if overall_healthy else "degraded",
        "backend": backend_status,
        "java_engine": java_status,
        "model_loaded": model_loaded
    }
