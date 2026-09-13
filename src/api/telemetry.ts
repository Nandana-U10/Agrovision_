import apiClient from './client';
import type { TelemetryData } from '../types/api';

export async function fetchLiveTelemetry(): Promise<TelemetryData> {
  const response = await apiClient.get<TelemetryData>('/api/v1/telemetry/live');
  return response.data;
}
