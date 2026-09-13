import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchLiveTelemetry } from '../api/telemetry';
import type { TelemetryData } from '../types/api';

export interface HistoricalTelemetryPoint {
  timestamp: string;
  formattedTime: string;
  upper_moisture: number | null;
  lower_moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  plant_stress_score: number | null;
}

export function useLiveTelemetry() {
  const [historyBuffer, setHistoryBuffer] = useState<HistoricalTelemetryPoint[]>([]);

  const query = useQuery<TelemetryData, Error>({
    queryKey: ['liveTelemetry'],
    queryFn: fetchLiveTelemetry,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    retry: 1,
  });

  useEffect(() => {
    if (query.data && query.data.timestamp) {
      const point: HistoricalTelemetryPoint = {
        timestamp: query.data.timestamp,
        formattedTime: new Date(query.data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        upper_moisture: query.data.upper_moisture,
        lower_moisture: query.data.lower_moisture,
        temperature: query.data.temperature,
        humidity: query.data.humidity,
        plant_stress_score: query.data.plant_stress_score,
      };

      setHistoryBuffer((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].timestamp === point.timestamp) {
          return prev;
        }
        const updated = [...prev, point];
        return updated.slice(-40);
      });
    }
  }, [query.data]);

  return {
    ...query,
    telemetry: query.data,
    historyBuffer,
  };
}
