from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.session import get_db
from app.database.models import Prediction
from app.schemas.prediction import PredictionHistoryItem

router = APIRouter(prefix="/predictions", tags=["Predictions History"])

@router.get("", response_model=list[PredictionHistoryItem])
def get_predictions(limit: int = 100, offset: int = 0, db: Session = Depends(get_db)):
    records = db.query(Prediction).order_by(desc(Prediction.created_at)).offset(offset).limit(limit).all()
    
    results = []
    for r in records:
        results.append(PredictionHistoryItem(
            id=r.id,
            created_at=r.created_at,
            predicted_class=r.predicted_class,
            class_index=r.class_index,
            probabilities={
                "Neutral or Dissatisfied": round(r.prob_neutral_dissatisfied, 4),
                "Satisfied": round(r.prob_satisfied, 4)
            },
            gender=r.gender,
            age=r.age,
            customer_type=r.customer_type,
            type_of_travel=r.type_of_travel,
            flight_class=r.flight_class,
            flight_distance=r.flight_distance,
            departure_delay=r.departure_delay,
            arrival_delay=r.arrival_delay,
            online_boarding=r.online_boarding,
            inflight_wifi_service=r.inflight_wifi_service,
            inflight_entertainment=r.inflight_entertainment,
            seat_comfort=r.seat_comfort,
            cleanliness=r.cleanliness,
            onboard_service=r.onboard_service,
            leg_room_service=r.leg_room_service,
            baggage_handling=r.baggage_handling,
            checkin_service=r.checkin_service,
            food_and_drink=r.food_and_drink,
            ease_of_online_booking=r.ease_of_online_booking,
            gate_location=r.gate_location,
            departure_and_arrival_time_convenience=r.departure_and_arrival_time_convenience,
            inflight_service=r.inflight_service
        ))
    return results

@router.delete("")
def clear_predictions(db: Session = Depends(get_db)):
    count = db.query(Prediction).delete()
    db.commit()
    return {"status": "success", "message": f"Successfully deleted {count} prediction records"}

@router.delete("/{prediction_id}")
def delete_prediction(prediction_id: str, db: Session = Depends(get_db)):
    record = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Prediction record not found")
    db.delete(record)
    db.commit()
    return {"status": "success", "message": f"Record {prediction_id} deleted"}
