export interface PredictionInput {
  gender: 'Male' | 'Female';
  age: number;
  customer_type: 'First-time' | 'Returning';
  type_of_travel: 'Business' | 'Personal';
  flight_class: 'Business' | 'Economy' | 'Economy Plus';
  flight_distance: number;
  departure_delay: number;
  arrival_delay: number;

  departure_and_arrival_time_convenience: number;
  ease_of_online_booking: number;
  checkin_service: number;

  online_boarding: number;
  gate_location: number;
  onboard_service: number;
  seat_comfort: number;
  leg_room_service: number;
  cleanliness: number;
  food_and_drink: number;
  inflight_service: number;
  inflight_wifi_service: number;
  inflight_entertainment: number;
  baggage_handling: number;
}

export interface PredictionResponse {
  id: string;
  predicted_class: 'Satisfied' | 'Neutral or Dissatisfied';
  class_index: number;
  probabilities: {
    'Neutral or Dissatisfied': number;
    'Satisfied': number;
  };
  created_at: string;
  input_data: PredictionInput;
}

export interface PredictionHistoryItem {
  id: string;
  created_at: string;
  predicted_class: 'Satisfied' | 'Neutral or Dissatisfied';
  class_index: number;
  probabilities: {
    'Neutral or Dissatisfied': number;
    'Satisfied': number;
  };
  gender: string;
  age: number;
  customer_type: string;
  type_of_travel: string;
  flight_class: string;
  flight_distance: number;
  departure_delay: number;
  arrival_delay: number;
  online_boarding: number;
  inflight_wifi_service: number;
  inflight_entertainment: number;
  seat_comfort: number;
  cleanliness: number;
  onboard_service: number;
  leg_room_service: number;
  baggage_handling: number;
  checkin_service: number;
  food_and_drink: number;
  ease_of_online_booking: number;
  gate_location: number;
  departure_and_arrival_time_convenience: number;
  inflight_service: number;
}

export interface HistoricalMetrics {
  evaluation_type: string;
  total_instances: number;
  correctly_classified: number;
  incorrectly_classified: number;
  accuracy: number;
  kappa_statistic: number;
  mean_absolute_error: number;
  root_mean_squared_error: number;
  weighted_precision: number;
  weighted_recall: number;
  weighted_f1: number;
  weighted_mcc: number;
  weighted_roc_area: number;
  weighted_prc_area: number;
  build_time_seconds: number;
  confusion_matrix: {
    'Neutral or Dissatisfied': {
      'Neutral or Dissatisfied': number;
      'Satisfied': number;
    };
    'Satisfied': {
      'Neutral or Dissatisfied': number;
      'Satisfied': number;
    };
  };
}

export interface ModelInfo {
  model_name: string;
  classifier_class: string;
  weka_version: string;
  num_attributes: number;
  class_attribute: string;
  class_values: string[];
  attributes: Array<{
    index: number;
    name: string;
    type: string;
    nominal_values?: string[];
  }>;
  historical_performance: HistoricalMetrics;
}

export interface DashboardStats {
  total_predictions: number;
  satisfied_count: number;
  neutral_dissatisfied_count: number;
  satisfied_percentage: number;
  neutral_dissatisfied_percentage: number;
  recent_predictions: PredictionHistoryItem[];
  historical_metrics: {
    accuracy: number;
    weighted_f1: number;
    weighted_roc_area: number;
    kappa_statistic: number;
    total_instances: number;
    evaluation_type: string;
  };
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unavailable';
  backend: string;
  java_engine: {
    status: string;
    model_loaded: boolean;
    relation?: string;
    attributes?: number;
    error?: string;
  };
  model_loaded: boolean;
}
