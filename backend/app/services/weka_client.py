import httpx
import logging
from fastapi import HTTPException
from app.config.settings import settings

logger = logging.getLogger("weka_client")

class WekaClient:
    def __init__(self, base_url: str = settings.WEKA_ENGINE_URL):
        self.base_url = base_url.rstrip("/")

    async def check_health(self) -> dict:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.base_url}/health")
                if res.status_code == 200:
                    return res.json()
                return {"status": "unhealthy", "model_loaded": False, "http_status": res.status_code}
        except Exception as e:
            logger.error(f"Failed to connect to WEKA engine at {self.base_url}: {e}")
            return {"status": "unavailable", "model_loaded": False, "error": str(e)}

    async def get_model_info(self) -> dict:
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(f"{self.base_url}/info")
                if res.status_code == 200:
                    return res.json()
                raise HTTPException(
                    status_code=res.status_code,
                    detail=f"Java engine error while retrieving model info: {res.text}"
                )
        except httpx.RequestError as e:
            logger.error(f"Java engine connection failed: {e}")
            raise HTTPException(
                status_code=503,
                detail="Java WEKA prediction engine is unavailable. Please verify the Java engine is running."
            )

    async def predict(self, payload: dict) -> dict:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(f"{self.base_url}/predict", json=payload)
                if res.status_code == 200:
                    return res.json()
                elif res.status_code == 400:
                    raise HTTPException(status_code=400, detail=res.json().get("error", "Bad Request to WEKA engine"))
                else:
                    raise HTTPException(
                        status_code=res.status_code,
                        detail=f"WEKA prediction engine error: {res.text}"
                    )
        except httpx.RequestError as e:
            logger.error(f"Java engine connection failure during prediction: {e}")
            raise HTTPException(
                status_code=503,
                detail="Java WEKA prediction engine is unreachable. The model cannot compute predictions."
            )

weka_client = WekaClient()
