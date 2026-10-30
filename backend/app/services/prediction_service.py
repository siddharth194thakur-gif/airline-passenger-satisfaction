import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.models import Prediction
from app.schemas.prediction import PredictionInput, PredictionResponse
from app.services.weka_client import weka_client

class PredictionService:
    @staticmethod
    async def process_prediction(input_data: PredictionInput, db: Session) -> PredictionResponse:
        # Convert input to WEKA payload
        weka_payload = input_data.to_weka_payload()

        # Send to Java engine for actual execution of pre-trained Random Forest
        weka_result = await weka_client.predict(weka_payload)

        pred_id = str(uuid.uuid4())
        created_at = datetime.utcnow()
        predicted_class = weka_result["predicted_class"]
        class_index = weka_result["class_index"]
        probabilities = weka_result["probabilities"]

        prob_nd = float(probabilities.get("Neutral or Dissatisfied", 0.0))
        prob_sat = float(probabilities.get("Satisfied", 0.0))

        # Save to SQLite database
        db_record = Prediction(
            id=pred_id,
            created_at=created_at,
            gender=input_data.gender,
            age=input_data.age,
            customer_type=input_data.customer_type,
            type_of_travel=input_data.type_of_travel,
            flight_class=input_data.flight_class,
            flight_distance=input_data.flight_distance,
            departure_delay=input_data.departure_delay,
            arrival_delay=input_data.arrival_delay,
            departure_and_arrival_time_convenience=input_data.departure_and_arrival_time_convenience,
            ease_of_online_booking=input_data.ease_of_online_booking,
            checkin_service=input_data.checkin_service,
            online_boarding=input_data.online_boarding,
            gate_location=input_data.gate_location,
            onboard_service=input_data.onboard_service,
            seat_comfort=input_data.seat_comfort,
            leg_room_service=input_data.leg_room_service,
            cleanliness=input_data.cleanliness,
            food_and_drink=input_data.food_and_drink,
            inflight_service=input_data.inflight_service,
            inflight_wifi_service=input_data.inflight_wifi_service,
            inflight_entertainment=input_data.inflight_entertainment,
            baggage_handling=input_data.baggage_handling,
            predicted_class=predicted_class,
            class_index=class_index,
            prob_neutral_dissatisfied=prob_nd,
            prob_satisfied=prob_sat
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return PredictionResponse(
            id=pred_id,
            predicted_class=predicted_class,
            class_index=class_index,
            probabilities=probabilities,
            created_at=created_at,
            input_data=input_data
        )

prediction_service = PredictionService()
