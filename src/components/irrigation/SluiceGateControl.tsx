import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sliders, Play, AlertCircle, CheckCircle2, Shield, Settings2 } from 'lucide-react';
import { useIrrigation } from '../../hooks/useIrrigation';
import { SluiceGateVisual } from './SluiceGateVisual';
import type { GateVisualState } from './SluiceGateVisual';
import { AuditTrailTable } from './AuditTrailTable';

export const SluiceGateControl: React.FC = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'MANUAL_OVERRIDE' | 'AUTO_PREDICTIVE'>('MANUAL_OVERRIDE');
  const [duration, setDuration] = useState<number>(15);
  const [gateVisualState, setGateVisualState] = useState<GateVisualState>('CLOSED');
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { history, isHistoryLoading, historyError, actuate, isActuating } = useIrrigation();

  const handleActuate = async () => {
    setActionNotice(null);
    setGateVisualState('OPENING');

    try {
      const response = await actuate({
        duration_seconds: Number(duration),
        angle_degrees: 90,
        mode,
      });

      if (response.status === 'SUCCESS') {
        setGateVisualState('OPEN');
        setActionNotice({
          type: 'success',
          message: response.message || `Sluice gate successfully opened for ${duration}s (Angle: 90°)`,
        });

        setTimeout(() => {
          setGateVisualState('CLOSING');
          setTimeout(() => {
            setGateVisualState('CLOSED');
          }, 1200);
        }, Math.min(duration * 1000, 15000));
      } else {
        setGateVisualState('FAILED');
        setActionNotice({
          type: 'error',
          message: response.message || 'Sluice gate actuation failed at hardware node.',
        });
      }
    } catch (err: unknown) {
      setGateVisualState('FAILED');
      const errorMsg = (err as { message?: string })?.message || 'Actuation request failed (Backend Offline)';
      setActionNotice({
        type: 'error',
        message: errorMsg,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sluice Gate Control Panel */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6 flex flex-col justify-between">
          
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200">
                    {t('irrigation.sluice_gate_control')}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Servo Gate Actuation Command & Telemetry Feedback
                  </p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setMode('AUTO_PREDICTIVE')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    mode === 'AUTO_PREDICTIVE'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  {t('irrigation.auto_predictive')}
                </button>
                <button
                  onClick={() => setMode('MANUAL_OVERRIDE')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    mode === 'MANUAL_OVERRIDE'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  {t('irrigation.manual_override')}
                </button>
              </div>
            </div>

            {/* Duration Input & Config */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 uppercase block mb-2">
                  {t('irrigation.duration_label')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, Math.min(60, Number(e.target.value))))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-400 font-mono">SEC</span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  Target Servo Config
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono mt-1">
                  {t('irrigation.servo_angle')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Notice */}
          {actionNotice && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                actionNotice.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}
            >
              {actionNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className="font-medium">{actionNotice.message}</span>
            </div>
          )}

          {/* Actuate Button */}
          <div className="pt-2">
            <button
              onClick={handleActuate}
              disabled={isActuating}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 text-slate-950 fill-current" />
              <span>{isActuating ? t('irrigation.actuating') : t('irrigation.actuate_button')}</span>
            </button>
          </div>
        </div>

        {/* Sluice Gate Visual State Panel */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <SluiceGateVisual state={gateVisualState} angle={90} />
        </div>
      </div>

      {/* Audit Trail Table */}
      <AuditTrailTable
        history={history}
        isLoading={isHistoryLoading}
        isError={!!historyError}
      />
    </div>
  );
};
