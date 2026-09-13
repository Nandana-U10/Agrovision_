import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface TelemetryCardProps {
  title: string;
  subtitle: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  colorTheme: 'emerald' | 'cyan' | 'amber' | 'rose' | 'indigo';
  isAvailable: boolean;
  statusText?: string;
  accentColor?: string;
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({
  title,
  subtitle,
  value,
  unit,
  icon: Icon,
  colorTheme,
  isAvailable,
  statusText,
}) => {
  const themeStyles = {
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-emerald-500/5',
      text: 'text-emerald-400',
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      glow: 'shadow-cyan-500/5',
      text: 'text-cyan-400',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glow: 'shadow-amber-500/5',
      text: 'text-amber-400',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      glow: 'shadow-rose-500/5',
      text: 'text-rose-400',
    },
    indigo: {
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      glow: 'shadow-indigo-500/5',
      text: 'text-indigo-400',
    },
  }[colorTheme];

  return (
    <div className={`glass-card p-5 rounded-2xl border transition-all duration-300 shadow-xl ${themeStyles.border} ${themeStyles.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {subtitle}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl border ${themeStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-3xl font-extrabold tracking-tight font-mono ${isAvailable ? 'text-slate-100' : 'text-slate-600'}`}>
          {value}
        </span>
        {unit && isAvailable && (
          <span className={`text-sm font-semibold ${themeStyles.text}`}>
            {unit}
          </span>
        )}
      </div>

      {statusText && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span>{statusText}</span>
        </div>
      )}
    </div>
  );
};
