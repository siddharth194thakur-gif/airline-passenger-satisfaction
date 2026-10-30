import {
  PredictionInput,
  PredictionResponse,
  PredictionHistoryItem,
  DashboardStats,
  ModelInfo,
  HealthStatus
} from '../types';

const getApiBase = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return '/api';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE = getApiBase();

export const api = {
  async getHealth(): Promise<HealthStatus> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return res.json();
  },

  async getModelInfo(): Promise<ModelInfo> {
    const res = await fetch(`${API_BASE}/model/info`);
    if (!res.ok) throw new Error(`Failed to fetch model info: ${res.statusText}`);
    return res.json();
  },

  async predict(input: PredictionInput): Promise<PredictionResponse> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || errData.error || `Prediction failed with status ${res.status}`);
    }
    return res.json();
  },

  async getPredictions(limit = 100): Promise<PredictionHistoryItem[]> {
    const res = await fetch(`${API_BASE}/predictions?limit=${limit}`);
    if (!res.ok) throw new Error(`Failed to fetch predictions: ${res.statusText}`);
    return res.json();
  },

  async deletePrediction(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/predictions/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete prediction');
  },

  async clearPredictions(): Promise<void> {
    const res = await fetch(`${API_BASE}/predictions`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to clear prediction history');
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error(`Failed to fetch dashboard stats: ${res.statusText}`);
    return res.json();
  }
};
