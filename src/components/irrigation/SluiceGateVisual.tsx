import React from 'react';
import { useTranslation } from 'react-i18next';

export type GateVisualState = 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING' | 'FAILED';

interface SluiceGateVisualProps {
  state: GateVisualState;
  angle: number;
}

export const SluiceGateVisual: React.FC<SluiceGateVisualProps> = ({ state, angle }) => {
  const { t } = useTranslation();

  const isClosed = state === 'CLOSED';
  const isOpen = state === 'OPEN';
  const isOpening = state === 'OPENING';
  const isFailed = state === 'FAILED';

  const gateAngle = isOpen || isOpening ? 90 : isClosed ? 0 : angle;

  const getStatusBadge = () => {
    switch (state) {
      case 'OPEN':
        return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 animate-pulse';
      case 'OPENING':
        return 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 animate-pulse';
      case 'CLOSING':
        return 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse';
      case 'FAILED':
        return 'bg-rose-500/20 border-rose-500/40 text-rose-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 relative overflow-hidden">
      
      {/* Dynamic Water Animation background when OPEN */}
      {(isOpen || isOpening) && (
        <div className="absolute inset-0 bg-cyan-500/5 backdrop-blur-3xl animate-pulse pointer-events-none" />
      )}

      {/* SVG Sluice Gate Visualization */}
      <svg className="w-48 h-36" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Frame Structure */}
        <rect x="20" y="10" width="160" height="130" rx="8" stroke="#334155" strokeWidth="4" fill="#0f172a" />
        <line x1="40" y1="20" x2="40" y2="130" stroke="#475569" strokeWidth="3" />
        <line x1="160" y1="20" x2="160" y2="130" stroke="#475569" strokeWidth="3" />

        {/* Water Stream (Visible when open) */}
        {(isOpen || isOpening) && (
          <g>
            <path
              d="M 60 70 Q 100 120 140 70"
              stroke="#06b6d4"
              strokeWidth="6"
              strokeDasharray="8 4"
              className="animate-pulse"
            />
            <path
              d="M 70 85 Q 100 135 130 85"
              stroke="#22d3ee"
              strokeWidth="4"
              strokeDasharray="6 3"
              className="animate-pulse"
            />
          </g>
        )}

        {/* Servo Motor Pivot */}
        <circle cx="100" cy="30" r="12" fill="#1e293b" stroke="#10b981" strokeWidth="3" />
        <line x1="100" y1="30" x2="100" y2="50" stroke="#10b981" strokeWidth="4" />

        {/* Moving Sluice Plate */}
        <g
          style={{
            transformOrigin: '100px 30px',
            transform: `rotate(${gateAngle}deg)`,
            transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <rect
            x="45"
            y="50"
            width="110"
            height="70"
            rx="4"
            fill={isFailed ? '#881337' : isOpen ? '#047857' : '#1e293b'}
            stroke={isFailed ? '#f43f5e' : isOpen ? '#10b981' : '#64748b'}
            strokeWidth="3"
          />
          {/* Plate Grips */}
          <line x1="55" y1="75" x2="145" y2="75" stroke="#475569" strokeWidth="2" />
          <line x1="55" y1="95" x2="145" y2="95" stroke="#475569" strokeWidth="2" />
        </g>
      </svg>

      {/* State Text & Angle Readout */}
      <div className="flex items-center gap-3 text-xs font-mono font-bold">
        <span className={`px-3 py-1 rounded-full border ${getStatusBadge()}`}>
          {t(`irrigation.status_${state.toLowerCase()}`)}
        </span>
        <span className="text-slate-400">
          Servo: <strong className="text-slate-200">{gateAngle}°</strong>
        </span>
      </div>
    </div>
  );
};
