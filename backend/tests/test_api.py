import pytest
import httpx

BASE_URL = "http://127.0.0.1:8000"

@pytest.mark.asyncio
async def test_health_endpoint():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.get("/api/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert data["backend"] == "healthy"
        assert data["model_loaded"] is True
        assert data["java_engine"]["model_loaded"] is True

@pytest.mark.asyncio
async def test_model_info_endpoint():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.get("/api/model/info")
        assert res.status_code == 200
        data = res.json()
        assert data["classifier_class"] == "weka.classifiers.trees.RandomForest"
        assert data["num_attributes"] == 23
        assert data["class_attribute"] == "Satisfaction"
        assert data["class_values"] == ["Neutral or Dissatisfied", "Satisfied"]
        assert data["historical_performance"]["accuracy"] == 96.3435
        assert data["historical_performance"]["weighted_f1"] == 0.963
        assert data["historical_performance"]["weighted_roc_area"] == 0.995

@pytest.mark.asyncio
async def test_predict_satisfied_instance():
    payload = {
        "gender": "Female",
        "age": 35,
        "customer_type": "Returning",
        "type_of_travel": "Business",
        "flight_class": "Business",
        "flight_distance": 821,
        "departure_delay": 26,
        "arrival_delay": 39,
        "departure_and_arrival_time_convenience": 2,
        "ease_of_online_booking": 2,
        "checkin_service": 3,
        "online_boarding": 5,
        "gate_location": 2,
        "onboard_service": 5,
        "seat_comfort": 4,
        "leg_room_service": 5,
        "cleanliness": 5,
        "food_and_drink": 3,
        "inflight_service": 5,
        "inflight_wifi_service": 2,
        "inflight_entertainment": 5,
        "baggage_handling": 5
    }
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.post("/api/predict", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["predicted_class"] == "Satisfied"
        assert data["class_index"] == 1
        assert "probabilities" in data
        assert data["probabilities"]["Satisfied"] >= 0.9

@pytest.mark.asyncio
async def test_predict_neutral_dissatisfied_instance():
    payload = {
        "gender": "Male",
        "age": 48,
        "customer_type": "First-time",
        "type_of_travel": "Business",
        "flight_class": "Business",
        "flight_distance": 821,
        "departure_delay": 2,
        "arrival_delay": 5,
        "departure_and_arrival_time_convenience": 3,
        "ease_of_online_booking": 3,
        "checkin_service": 4,
        "online_boarding": 3,
        "gate_location": 3,
        "onboard_service": 3,
        "seat_comfort": 5,
        "leg_room_service": 2,
        "cleanliness": 5,
        "food_and_drink": 5,
        "inflight_service": 5,
        "inflight_wifi_service": 3,
        "inflight_entertainment": 5,
        "baggage_handling": 5
    }
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.post("/api/predict", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["predicted_class"] == "Neutral or Dissatisfied"
        assert data["class_index"] == 0
        assert data["probabilities"]["Neutral or Dissatisfied"] >= 0.9

@pytest.mark.asyncio
async def test_predict_validation_error():
    # Out of range rating (999)
    payload = {
        "gender": "Male",
        "age": 25,
        "customer_type": "First-time",
        "type_of_travel": "Business",
        "flight_class": "Economy",
        "flight_distance": 500,
        "departure_delay": 0,
        "arrival_delay": 0,
        "departure_and_arrival_time_convenience": 999,
        "ease_of_online_booking": 3,
        "checkin_service": 3,
        "online_boarding": 3,
        "gate_location": 3,
        "onboard_service": 3,
        "seat_comfort": 3,
        "leg_room_service": 3,
        "cleanliness": 3,
        "food_and_drink": 3,
        "inflight_service": 3,
        "inflight_wifi_service": 3,
        "inflight_entertainment": 3,
        "baggage_handling": 3
    }
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.post("/api/predict", json=payload)
        assert res.status_code == 422 # Pydantic validation error

@pytest.mark.asyncio
async def test_predictions_history():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.get("/api/predictions")
        assert res.status_code == 200
        data = res.json()
        assert isinstance(data, list)
        assert len(data) > 0

@pytest.mark.asyncio
async def test_dashboard_stats():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.get("/api/dashboard/stats")
        assert res.status_code == 200
        data = res.json()
        assert data["total_predictions"] >= 2
        assert "satisfied_count" in data
        assert "neutral_dissatisfied_count" in data
        assert data["historical_metrics"]["accuracy"] == 96.3435
