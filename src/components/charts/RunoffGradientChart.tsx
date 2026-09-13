import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Layers } from 'lucide-react';
import type { HistoricalTelemetryPoint } from '../../hooks/useLiveTelemetry';

interface RunoffGradientChartProps {
  data: HistoricalTelemetryPoint[];
}

export const RunoffGradientChart: React.FC<RunoffGradientChartProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-200">
              {t('charts.runoff_gradient')}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Upper vs Lower Root Zone Moisture Differential
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
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="formattedTime" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} unit="%" />
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
              <Line
                type="monotone"
                dataKey="upper_moisture"
                name={t('charts.upper_moisture')}
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="lower_moisture"
                name={t('charts.lower_moisture')}
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#06b6d4' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
