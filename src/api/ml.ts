import apiClient from './client';
import type { MLPredictionData } from '../types/api';

export async function fetchMLDryingPrediction(): Promise<MLPredictionData> {
  const response = await apiClient.get<MLPredictionData>('/api/v1/ml/predict-drying');
  return response.data;
}
