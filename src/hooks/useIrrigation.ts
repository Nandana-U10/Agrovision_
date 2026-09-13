import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { actuateSluiceGate, fetchIrrigationHistory } from '../api/irrigation';
import type { IrrigationActuationRequest, IrrigationActuationResponse, IrrigationHistoryItem } from '../types/api';

export function useIrrigation() {
  const queryClient = useQueryClient();

  const historyQuery = useQuery<IrrigationHistoryItem[], Error>({
    queryKey: ['irrigationHistory'],
    queryFn: fetchIrrigationHistory,
    refetchInterval: 10000,
    retry: 1,
  });

  const actuateMutation = useMutation<
    IrrigationActuationResponse,
    Error,
    IrrigationActuationRequest
  >({
    mutationFn: actuateSluiceGate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['irrigationHistory'] });
    },
  });

  return {
    history: historyQuery.data || [],
    isHistoryLoading: historyQuery.isLoading,
    historyError: historyQuery.error,
    actuate: actuateMutation.mutateAsync,
    isActuating: actuateMutation.isPending,
    actuationResult: actuateMutation.data,
    actuationError: actuateMutation.error,
  };
}
