import { useMutation } from '@tanstack/react-query';
import { diagnoseLeafImage } from '../api/vision';
import type { VisionDiagnosisResponse } from '../types/api';

export function useVisionDiagnosis() {
  return useMutation<VisionDiagnosisResponse, Error, File>({
    mutationFn: diagnoseLeafImage,
  });
}
