from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.database.session import get_db
from app.database.models import Prediction
from app.schemas.prediction import DashboardStats, PredictionHistoryItem
from app.schemas.model_info import HistoricalEvaluation

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Prediction.id)).scalar() or 0
    satisfied = db.query(func.count(Prediction.id)).filter(Prediction.predicted_class == "Satisfied").scalar() or 0
    neutral_dissatisfied = db.query(func.count(Prediction.id)).filter(Prediction.predicted_class == "Neutral or Dissatisfied").scalar() or 0

    sat_pct = round((satisfied / total) * 100, 2) if total > 0 else 0.0
    nd_pct = round((neutral_dissatisfied / total) * 100, 2) if total > 0 else 0.0

    recent_records = db.query(Prediction).order_by(desc(Prediction.created_at)).limit(10).all()
    recent = []
    for r in recent_records:
        recent.append(PredictionHistoryItem(
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

    hist = HistoricalEvaluation()

    return DashboardStats(
        total_predictions=total,
        satisfied_count=satisfied,
        neutral_dissatisfied_count=neutral_dissatisfied,
        satisfied_percentage=sat_pct,
        neutral_dissatisfied_percentage=nd_pct,
        recent_predictions=recent,
        historical_metrics={
            "accuracy": hist.accuracy,
            "weighted_f1": hist.weighted_f1,
            "weighted_roc_area": hist.weighted_roc_area,
            "kappa_statistic": hist.kappa_statistic,
            "total_instances": hist.total_instances,
            "evaluation_type": hist.evaluation_type
        }
    )
