from pydantic import BaseModel, Field
from typing import Literal, Dict, Optional
from datetime import datetime

class PredictionInput(BaseModel):
    # Demographics & Flight Info
    gender: Literal["Male", "Female"] = Field(..., description="Passenger gender")
    age: int = Field(..., ge=1, le=120, description="Passenger age (1-120)")
    customer_type: Literal["First-time", "Returning"] = Field(..., description="Customer loyalty type")
    type_of_travel: Literal["Business", "Personal"] = Field(..., description="Purpose of travel")
    flight_class: Literal["Business", "Economy", "Economy Plus"] = Field(..., description="Cabin class")
    flight_distance: float = Field(..., ge=0, le=20000, description="Flight distance in miles")
    departure_delay: float = Field(0.0, ge=0, le=2000, description="Departure delay in minutes")
    arrival_delay: float = Field(0.0, ge=0, le=2000, description="Arrival delay in minutes")

    # Convenience & Pre-flight Ratings (0-5)
    departure_and_arrival_time_convenience: int = Field(..., ge=0, le=5, description="Convenience rating (0-5)")
    ease_of_online_booking: int = Field(..., ge=0, le=5, description="Online booking rating (0-5)")
    checkin_service: int = Field(..., ge=0, le=5, description="Check-in rating (0-5)")

    # Service & In-flight Ratings (0-5)
    online_boarding: int = Field(..., ge=0, le=5, description="Online boarding rating (0-5)")
    gate_location: int = Field(..., ge=0, le=5, description="Gate location rating (0-5)")
    onboard_service: int = Field(..., ge=0, le=5, description="On-board service rating (0-5)")
    seat_comfort: int = Field(..., ge=0, le=5, description="Seat comfort rating (0-5)")
    leg_room_service: int = Field(..., ge=0, le=5, description="Leg room service rating (0-5)")
    cleanliness: int = Field(..., ge=0, le=5, description="Cleanliness rating (0-5)")
    food_and_drink: int = Field(..., ge=0, le=5, description="Food and drink rating (0-5)")
    inflight_service: int = Field(..., ge=0, le=5, description="In-flight service rating (0-5)")
    inflight_wifi_service: int = Field(..., ge=0, le=5, description="In-flight wifi rating (0-5)")
    inflight_entertainment: int = Field(..., ge=0, le=5, description="In-flight entertainment rating (0-5)")
    baggage_handling: int = Field(..., ge=0, le=5, description="Baggage handling rating (0-5)")

    def to_weka_payload(self) -> dict:
        return {
            "Gender": self.gender,
            "Age": self.age,
            "Customer Type": self.customer_type,
            "Type of Travel": self.type_of_travel,
            "Class": self.flight_class,
            "Flight Distance": self.flight_distance,
            "Departure Delay": self.departure_delay,
            "Arrival Delay": self.arrival_delay,
            "Departure and Arrival Time Convenience": self.departure_and_arrival_time_convenience,
            "Ease of Online Booking": self.ease_of_online_booking,
            "Check-in Service": self.checkin_service,
            "Online Boarding": self.online_boarding,
            "Gate Location": self.gate_location,
            "On-board Service": self.onboard_service,
            "Seat Comfort": self.seat_comfort,
            "Leg Room Service": self.leg_room_service,
            "Cleanliness": self.cleanliness,
            "Food and Drink": self.food_and_drink,
            "In-flight Service": self.inflight_service,
            "In-flight Wifi Service": self.inflight_wifi_service,
            "In-flight Entertainment": self.inflight_entertainment,
            "Baggage Handling": self.baggage_handling,
        }

class PredictionResponse(BaseModel):
    id: str
    predicted_class: str
    class_index: int
    probabilities: Dict[str, float]
    created_at: datetime
    input_data: PredictionInput

class PredictionHistoryItem(BaseModel):
    id: str
    created_at: datetime
    predicted_class: str
    class_index: int
    probabilities: Dict[str, float]
    gender: str
    age: int
    customer_type: str
    type_of_travel: str
    flight_class: str
    flight_distance: float
    departure_delay: float
    arrival_delay: float
    online_boarding: int
    inflight_wifi_service: int
    inflight_entertainment: int
    seat_comfort: int
    cleanliness: int
    onboard_service: int
    leg_room_service: int
    baggage_handling: int
    checkin_service: int
    food_and_drink: int
    ease_of_online_booking: int
    gate_location: int
    departure_and_arrival_time_convenience: int
    inflight_service: int

class DashboardStats(BaseModel):
    total_predictions: int
    satisfied_count: int
    neutral_dissatisfied_count: int
    satisfied_percentage: float
    neutral_dissatisfied_percentage: float
    recent_predictions: list[PredictionHistoryItem]
    historical_metrics: dict
