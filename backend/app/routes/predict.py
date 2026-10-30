from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.prediction import PredictionInput, PredictionResponse
from app.services.prediction_service import prediction_service

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("", response_model=PredictionResponse)
async def predict_satisfaction(
    input_data: PredictionInput,
    db: Session = Depends(get_db)
):
    return await prediction_service.process_prediction(input_data, db)
