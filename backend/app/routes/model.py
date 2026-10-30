from fastapi import APIRouter
from app.services.weka_client import weka_client
from app.schemas.model_info import ModelInfoResponse, ModelAttribute, HistoricalEvaluation

router = APIRouter(prefix="/model", tags=["Model"])

@router.get("/info", response_model=ModelInfoResponse)
async def get_model_info():
    info_from_java = await weka_client.get_model_info()

    attributes = [
        ModelAttribute(
            index=a["index"],
            name=a["name"],
            type=a["type"],
            nominal_values=a.get("nominal_values")
        )
        for a in info_from_java.get("attributes", [])
    ]

    return ModelInfoResponse(
        model_name="WEKA RandomForest Airline Passenger Satisfaction Model",
        classifier_class="weka.classifiers.trees.RandomForest",
        weka_version="3.8.7",
        num_attributes=info_from_java.get("num_attributes", 23),
        class_attribute=info_from_java.get("class_attribute", "Satisfaction"),
        class_values=info_from_java.get("class_values", ["Neutral or Dissatisfied", "Satisfied"]),
        attributes=attributes,
        historical_performance=HistoricalEvaluation()
    )
