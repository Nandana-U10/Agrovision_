import React from 'react';
import { useLiveTelemetry } from '../hooks/useLiveTelemetry';
import { useMLPrediction } from '../hooks/useMLPrediction';
import { Header } from '../components/layout/Header';
import { TelemetryGrid } from '../components/telemetry/TelemetryGrid';
import { MLForecastCard } from '../components/ml/MLForecastCard';
import { LeafDiagnosticStudio } from '../components/vision/LeafDiagnosticStudio';
import { RunoffGradientChart } from '../components/charts/RunoffGradientChart';
import { WeatherCorrelationChart } from '../components/charts/WeatherCorrelationChart';
import { AgroBotDrawer } from '../components/chatbot/AgroBotDrawer';
import { AlertCircle, WifiOff } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { telemetry, isError, isLoading, historyBuffer } = useLiveTelemetry();
  const mlQuery = useMLPrediction();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Command Center Header */}
      <Header telemetry={telemetry} isOffline={isError} />

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Offline Banner Callout if telemetry endpoint is unreachable */}
        {isError && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400">
                <WifiOff className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-rose-100 uppercase tracking-wider">
                  BACKEND CONNECTION OFFLINE
                </h4>
                <p className="text-rose-300/80 mt-0.5 font-medium">
                  Unable to connect to AgroVision API server at {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}. Live hardware metrics, ML forecasts, and actuations are operating in disconnected mode.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold rounded-lg shrink-0">
              RETRYING (3s)
            </span>
          </div>
        )}

        {/* Real-time Telemetry Metric Grid */}
        <TelemetryGrid
          telemetry={telemetry}
          isOffline={isError}
          isLoading={isLoading}
        />

        {/* Soil ML Forecast & Leaf Diagnostic Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <MLForecastCard
              prediction={mlQuery.data}
              isLoading={mlQuery.isLoading}
              isError={mlQuery.isError}
              error={mlQuery.error}
              refetch={mlQuery.refetch}
            />
          </div>

          <div className="lg:col-span-7">
            <LeafDiagnosticStudio />
          </div>
        </div>

        {/* Historical Telemetry Analytics & Charts */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-400" />
            Live Telemetry Time-Series Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RunoffGradientChart data={historyBuffer} />
            <WeatherCorrelationChart data={historyBuffer} />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <p>AGROVISION CORE v2.0 • Hardware-Ready Smart Agriculture Command Center</p>
      </footer>

      {/* Floating AgroBot AI Agronomist */}
      <AgroBotDrawer
        telemetry={telemetry}
        isTelemetryOffline={isError}
      />
    </div>
  );
};
