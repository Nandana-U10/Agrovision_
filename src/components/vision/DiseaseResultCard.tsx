import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertTriangle, HelpCircle, Activity, Stethoscope, Droplets } from 'lucide-react';
import type { VisionDiagnosisResponse } from '../../types/api';

interface DiseaseResultCardProps {
  result: VisionDiagnosisResponse;
}

export const DiseaseResultCard: React.FC<DiseaseResultCardProps> = ({ result }) => {
  const { t } = useTranslation();

  const rawConf = result.confidence;
  const confidencePercent = rawConf <= 1.0 ? Math.round(rawConf * 100) : Math.round(rawConf);

  const getConfidenceBadge = (conf: number) => {
    if (conf >= 75) {
      return {
        label: t('vision.high_confidence'),
        color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
        icon: ShieldCheck,
        barColor: 'bg-emerald-500',
      };
    }
    if (conf >= 60) {
      return {
        label: t('vision.moderate_confidence'),
        color: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
        icon: AlertTriangle,
        barColor: 'bg-amber-500',
      };
    }
    return {
      label: t('vision.manual_review'),
      color: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
      icon: HelpCircle,
      barColor: 'bg-rose-500',
    };
  };

  const badge = getConfidenceBadge(confidencePercent);
  const BadgeIcon = badge.icon;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl animate-fade-in space-y-5">
      
      {/* Title & Confidence Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            AI Computer Vision Result
          </span>
          <h3 className="text-xl font-extrabold text-slate-100 mt-1">
            {result.disease}
          </h3>
        </div>

        <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 ${badge.color}`}>
          <BadgeIcon className="w-4 h-4" />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Confidence Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>{t('vision.confidence')}</span>
          <span className="font-mono text-emerald-400">{confidencePercent}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2.5 p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${badge.barColor}`}
            style={{ width: `${Math.min(100, Math.max(0, confidencePercent))}%` }}
          />
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        {/* Pathogen */}
        <div className="glass-card p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            {t('vision.pathogen')}
          </span>
          <span className="text-slate-200 font-bold">
            {result.pathogen_category || 'N/A'}
          </span>
        </div>

        {/* Treatment */}
        <div className="glass-card p-3.5 rounded-xl border border-slate-800 md:col-span-2">
          <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
            {t('vision.treatment')}
          </span>
          <span className="text-slate-200 font-medium">
            {result.treatment || 'No specific treatment recommended.'}
          </span>
        </div>
      </div>

      {/* Irrigation Advisory */}
      {result.irrigation_advisory && (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
          <Droplets className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-cyan-300 block mb-0.5 uppercase tracking-wider text-[10px]">
              {t('vision.advisory')}
            </span>
            <span>{result.irrigation_advisory}</span>
          </div>
        </div>
      )}
    </div>
  );
};
