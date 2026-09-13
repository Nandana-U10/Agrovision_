import { useQuery } from '@tanstack/react-query';
import { fetchMLDryingPrediction } from '../api/ml';
import type { MLPredictionData } from '../types/api';

export function useMLPrediction() {
  return useQuery<MLPredictionData, Error>({
    queryKey: ['mlPrediction'],
    queryFn: fetchMLDryingPrediction,
    refetchInterval: 15000,
    retry: 1,
  });
}
