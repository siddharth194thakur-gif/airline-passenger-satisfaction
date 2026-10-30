from pydantic import BaseModel
from typing import List, Dict, Any

class ModelAttribute(BaseModel):
    index: int
    name: str
    type: str
    nominal_values: List[str] | None = None

class HistoricalEvaluation(BaseModel):
    evaluation_type: str = "Stratified 10-Fold Cross-Validation"
    total_instances: int = 129880
    correctly_classified: int = 125131
    incorrectly_classified: int = 4749
    accuracy: float = 96.3435
    kappa_statistic: float = 0.9253
    mean_absolute_error: float = 0.0662
    root_mean_squared_error: float = 0.1662
    weighted_precision: float = 0.964
    weighted_recall: float = 0.963
    weighted_f1: float = 0.963
    weighted_mcc: float = 0.926
    weighted_roc_area: float = 0.995
    weighted_prc_area: float = 0.995
    build_time_seconds: float = 23.16
    confusion_matrix: Dict[str, Dict[str, int]] = {
        "Neutral or Dissatisfied": {
            "Neutral or Dissatisfied": 72049,
            "Satisfied": 1403
        },
        "Satisfied": {
            "Neutral or Dissatisfied": 3346,
            "Satisfied": 53082
        }
    }

class ModelInfoResponse(BaseModel):
    model_name: str = "RandomForest Passenger Satisfaction Classifier"
    classifier_class: str = "weka.classifiers.trees.RandomForest"
    weka_version: str = "3.8.7"
    num_attributes: int
    class_attribute: str
    class_values: List[str]
    attributes: List[ModelAttribute]
    historical_performance: HistoricalEvaluation
