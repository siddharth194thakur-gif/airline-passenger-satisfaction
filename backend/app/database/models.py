import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime
from app.database.session import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Demographics & Flight Info
    gender = Column(String(20), nullable=False)
    age = Column(Integer, nullable=False)
    customer_type = Column(String(30), nullable=False)
    type_of_travel = Column(String(30), nullable=False)
    flight_class = Column(String(30), nullable=False)
    flight_distance = Column(Float, nullable=False)
    departure_delay = Column(Float, nullable=False, default=0.0)
    arrival_delay = Column(Float, nullable=False, default=0.0)

    # Pre-flight / Convenience Services
    departure_and_arrival_time_convenience = Column(Integer, nullable=False)
    ease_of_online_booking = Column(Integer, nullable=False)
    checkin_service = Column(Integer, nullable=False)

    # In-flight & Handling Services
    online_boarding = Column(Integer, nullable=False)
    gate_location = Column(Integer, nullable=False)
    onboard_service = Column(Integer, nullable=False)
    seat_comfort = Column(Integer, nullable=False)
    leg_room_service = Column(Integer, nullable=False)
    cleanliness = Column(Integer, nullable=False)
    food_and_drink = Column(Integer, nullable=False)
    inflight_service = Column(Integer, nullable=False)
    inflight_wifi_service = Column(Integer, nullable=False)
    inflight_entertainment = Column(Integer, nullable=False)
    baggage_handling = Column(Integer, nullable=False)

    # Prediction Output
    predicted_class = Column(String(50), nullable=False)
    class_index = Column(Integer, nullable=False)
    prob_neutral_dissatisfied = Column(Float, nullable=False)
    prob_satisfied = Column(Float, nullable=False)
