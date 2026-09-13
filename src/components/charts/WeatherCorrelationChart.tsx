import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CloudSun } from 'lucide-react';
import type { HistoricalTelemetryPoint } from '../../hooks/useLiveTelemetry';

interface WeatherCorrelationChartProps {
  data: HistoricalTelemetryPoint[];
}

export const WeatherCorrelationChart: React.FC<WeatherCorrelationChartProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-200">
              {t('charts.weather_stress')}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Canopy Microclimate vs Biometric Plant Stress Index
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {data.length} Points Recorded
        </span>
      </div>

      <div className="h-64 w-full pt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic border border-dashed border-slate-800/80 rounded-xl">
            {t('charts.waiting_data')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="formattedTime" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis yAxisId="climate" domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis yAxisId="stress" orientation="right" domain={[0, 1.0]} stroke="#f43f5e" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                yAxisId="climate"
                type="monotone"
                dataKey="temperature"
                name={t('charts.temp')}
                fill="#f59e0b"
                stroke="#f59e0b"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Line
                yAxisId="climate"
                type="monotone"
                dataKey="humidity"
                name={t('charts.humidity')}
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="stress"
                type="monotone"
                dataKey="plant_stress_score"
                name={t('charts.stress_score')}
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#f43f5e' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
