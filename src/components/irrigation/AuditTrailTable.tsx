import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { IrrigationHistoryItem } from '../../types/api';

interface AuditTrailTableProps {
  history: IrrigationHistoryItem[];
  isLoading: boolean;
  isError: boolean;
}

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({ history, isLoading, isError }) => {
  const { t } = useTranslation();

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          {t('irrigation.audit_trail')}
        </h3>
        <span className="text-xs font-mono text-slate-400">
          {history.length} Event{history.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">{t('irrigation.col_timestamp')}</th>
              <th className="py-3 px-4">{t('irrigation.col_source')}</th>
              <th className="py-3 px-4">{t('irrigation.col_angle')}</th>
              <th className="py-3 px-4">{t('irrigation.col_duration')}</th>
              <th className="py-3 px-4">{t('irrigation.col_status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 italic font-sans">
                  Fetching irrigation audit history...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-rose-400 font-sans">
                  Unable to retrieve irrigation history (Backend Offline).
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 italic font-sans">
                  {t('irrigation.no_events')}
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.trigger_source}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.servo_angle}°</td>
                  <td className="py-3 px-4">{item.duration_seconds}s</td>
                  <td className="py-3 px-4">
                    {item.status.toUpperCase() === 'SUCCESS' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        SUCCESS
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" />
                        FAILED
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
