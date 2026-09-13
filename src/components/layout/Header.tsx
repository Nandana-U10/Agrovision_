import React from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, Wifi, WifiOff, Globe, Cpu, AlertTriangle, Layers } from 'lucide-react';
import type { TelemetryData } from '../../types/api';
import { getSignalQuality, getSignalColorClass } from '../../utils/signal';
import { calculatePacketAgeSeconds } from '../../utils/formatters';

interface HeaderProps {
  telemetry: TelemetryData | undefined;
  isOffline: boolean;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'as', label: 'অসমীয়া (Assamese)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
];

export const Header: React.FC<HeaderProps> = ({ telemetry, isOffline }) => {
  const { t, i18n } = useTranslation();

  const packetAge = telemetry?.timestamp
    ? calculatePacketAgeSeconds(telemetry.timestamp)
    : null;

  const isStale = packetAge !== null && packetAge > 20;
  const isSimulation = telemetry?.operating_mode === 'SIMULATION';
  const isHardwareLive = !isOffline && !isStale && telemetry && !isSimulation;

  const signalQuality = getSignalQuality(telemetry?.rssi);
  const signalColorClass = getSignalColorClass(signalQuality);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider text-slate-100 uppercase bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {t('header.title')}
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-400" />
                {t('header.node')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {t('header.location')}
            </p>
          </div>
        </div>

        {/* Dynamic Connection Status & Telemetry Metrics */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          {/* Status Badge */}
          {isOffline || isStale || !telemetry ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 font-medium shadow-md shadow-rose-950/40">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <WifiOff className="w-4 h-4 text-rose-400" />
              <span>{t('header.offline')}</span>
            </div>
          ) : isSimulation ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 font-medium shadow-md shadow-amber-950/40">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{t('header.simulation')}</span>
            </div>
          ) : isHardwareLive ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-medium shadow-md shadow-emerald-950/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>{t('header.live_stream')}</span>
            </div>
          ) : null}

          {/* Packet Age Badge */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 font-mono">
            {packetAge !== null ? t('header.last_packet', { count: packetAge }) : 'Last Packet: --'}
          </div>

          {/* RSSI Signal Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono ${signalColorClass}`}>
            <Wifi className="w-3.5 h-3.5" />
            <span>{t('header.rssi')}: {telemetry?.rssi !== null && telemetry?.rssi !== undefined ? `${telemetry.rssi} dBm` : '-- dBm'}</span>
            <span className="text-[10px] uppercase font-bold opacity-80">({signalQuality})</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer py-0.5 font-medium"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>
    </header>
  );
};
