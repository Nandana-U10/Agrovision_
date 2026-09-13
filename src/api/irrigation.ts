import apiClient from './client';
import type { IrrigationActuationRequest, IrrigationActuationResponse, IrrigationHistoryItem } from '../types/api';

export async function actuateSluiceGate(payload: IrrigationActuationRequest): Promise<IrrigationActuationResponse> {
  const response = await apiClient.post<IrrigationActuationResponse>('/api/v1/irrigation/actuate', payload);
  return response.data;
}

export async function fetchIrrigationHistory(): Promise<IrrigationHistoryItem[]> {
  const response = await apiClient.get<IrrigationHistoryItem[]>('/api/v1/irrigation/history');
  return response.data;
}
