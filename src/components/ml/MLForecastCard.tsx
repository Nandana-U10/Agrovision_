import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingDown, Clock, ShieldAlert, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import type { MLPredictionData } from '../../types/api';
import { formatTimeToDry, formatValue } from '../../utils/formatters';

interface MLForecastCardProps {
  prediction: MLPredictionData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const MLForecastCard: React.FC<MLForecastCardProps> = ({
  prediction,
  isLoading,
  isError,
  error,
  refetch,
}) => {
  const { t } = useTranslation();

  const timeToDryFormatted = formatTimeToDry(
    prediction?.time_to_dry_seconds,
    prediction?.time_to_dry_formatted,
    prediction?.estimated_dry_timestamp
  );

  const getDroughtBadge = (status: string | undefined) => {
    if (!status) return null;
    const upper = status.toUpperCase();

    if (upper.includes('CRITICAL') || upper.includes('DROUGHT')) {
      return (
        <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          {t('ml.critical_drought')}
        </span>
      );
    }
    if (upper.includes('WARN')) {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/10">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          {t('ml.warning')}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        {t('ml.optimal')}
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200">
                {t('ml.drying_forecast')}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Physics-Informed Soil Moisture ML Inference
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {prediction?.drought_vulnerability && getDroughtBadge(prediction.drought_vulnerability)}
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              title="Refresh Forecast"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Offline / Error Banner */}
        {isError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>ML Prediction API Unavailable ({error?.message || 'Backend Offline'})</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Depletion Rate */}
          <div className="glass-card p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              {t('ml.depletion_rate')}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-slate-100">
                {prediction?.depletion_rate_percent_per_hour !== null && prediction?.depletion_rate_percent_per_hour !== undefined
                  ? formatValue(prediction.depletion_rate_percent_per_hour, 2)
                  : '--'}
              </span>
              <span className="text-xs font-medium text-slate-400">% / hour</span>
            </div>
          </div>

          {/* Time To Dry */}
          <div className="glass-card p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
              <Clock className="w-4 h-4 text-cyan-400" />
              {t('ml.time_to_dry')}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-slate-100">
                {timeToDryFormatted}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {t('ml.until_critical')}
            </p>
          </div>
        </div>
      </div>

      {/* Prescriptive Advisory */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 mb-2">
          <Sparkles className="w-4 h-4" />
          {t('ml.prescriptive_advisory')}
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
          {prediction?.prescriptive_advisory ? (
            prediction.prescriptive_advisory
          ) : isError ? (
            <span className="text-slate-500 italic">No advisory available (Backend disconnected).</span>
          ) : (
            <span className="text-slate-500 italic">Awaiting backend ML advisory generation...</span>
          )}
        </div>
      </div>
    </div>
  );
};
