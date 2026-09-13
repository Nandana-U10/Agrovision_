import apiClient from './client';
import type { VisionDiagnosisResponse } from '../types/api';

export async function diagnoseLeafImage(file: File): Promise<VisionDiagnosisResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<VisionDiagnosisResponse>('/api/v1/vision/diagnose', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
