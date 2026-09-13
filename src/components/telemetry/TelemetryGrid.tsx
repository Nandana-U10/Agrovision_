import React from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Thermometer, Wind, Activity, Layers } from 'lucide-react';
import type { TelemetryData } from '../../types/api';
import { TelemetryCard } from './TelemetryCard';
import { formatValue } from '../../utils/formatters';

interface TelemetryGridProps {
  telemetry: TelemetryData | undefined;
  isOffline: boolean;
  isLoading: boolean;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({ telemetry, isOffline, isLoading }) => {
  const { t } = useTranslation();

  const isDataAvailable = !isOffline && !!telemetry;

  const upperMoistureVal = isDataAvailable && telemetry?.upper_moisture !== null
    ? formatValue(telemetry.upper_moisture, 1)
    : t('telemetry.no_data');

  const lowerMoistureVal = isDataAvailable && telemetry?.lower_moisture !== null
    ? formatValue(telemetry.lower_moisture, 1)
    : t('telemetry.no_data');

  const tempVal = isDataAvailable && telemetry?.temperature !== null
    ? formatValue(telemetry.temperature, 1)
    : t('telemetry.no_data');

  const humidityVal = isDataAvailable && telemetry?.humidity !== null
    ? formatValue(telemetry.humidity, 0)
    : t('telemetry.no_data');

  const stressScoreVal = isDataAvailable && telemetry?.plant_stress_score !== null
    ? formatValue(telemetry.plant_stress_score, 2)
    : t('telemetry.no_data');

  const timestampFormatted = telemetry?.timestamp
    ? new Date(telemetry.timestamp).toLocaleTimeString()
    : undefined;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Real-Time Field Telemetry
        </h2>
        {isLoading && (
          <span className="text-xs text-emerald-400 animate-pulse font-medium">
            Fetching telemetry...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Upper Terrace Moisture */}
        <TelemetryCard
          title={t('telemetry.upper_moisture')}
          subtitle={t('telemetry.upper_root_zone')}
          value={upperMoistureVal}
          unit="%"
          icon={Droplets}
          colorTheme="emerald"
          isAvailable={isDataAvailable && telemetry?.upper_moisture !== null}
          statusText={timestampFormatted ? `Updated ${timestampFormatted}` : t('common.backend_offline')}
        />

        {/* Lower Terrace Moisture */}
        <TelemetryCard
          title={t('telemetry.lower_moisture')}
          subtitle={t('telemetry.lower_root_zone')}
          value={lowerMoistureVal}
          unit="%"
          icon={Droplets}
          colorTheme="cyan"
          isAvailable={isDataAvailable && telemetry?.lower_moisture !== null}
          statusText={timestampFormatted ? `Updated ${timestampFormatted}` : t('common.backend_offline')}
        />

        {/* Temperature */}
        <TelemetryCard
          title={t('telemetry.temperature')}
          subtitle="Ambient Canopy Temp"
          value={tempVal}
          unit="°C"
          icon={Thermometer}
          colorTheme="amber"
          isAvailable={isDataAvailable && telemetry?.temperature !== null}
          statusText={timestampFormatted ? `Updated ${timestampFormatted}` : t('common.backend_offline')}
        />

        {/* Humidity */}
        <TelemetryCard
          title={t('telemetry.humidity')}
          subtitle="Relative Canopy Humidity"
          value={humidityVal}
          unit="%"
          icon={Wind}
          colorTheme="indigo"
          isAvailable={isDataAvailable && telemetry?.humidity !== null}
          statusText={timestampFormatted ? `Updated ${timestampFormatted}` : t('common.backend_offline')}
        />

        {/* Plant Stress Score */}
        <TelemetryCard
          title={t('telemetry.plant_stress_score')}
          subtitle="Biometric Index (0-1.0)"
          value={stressScoreVal}
          icon={Activity}
          colorTheme="rose"
          isAvailable={isDataAvailable && telemetry?.plant_stress_score !== null}
          statusText={timestampFormatted ? `Updated ${timestampFormatted}` : t('common.backend_offline')}
        />
      </div>
    </section>
  );
};
