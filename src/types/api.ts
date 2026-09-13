export interface TelemetryData {
  node_id: string;
  field_name: string;
  timestamp: string;
  upper_moisture: number | null;
  lower_moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  plant_stress_score: number | null;
  rssi: number | null;
  packet_age?: number | null;
  connectivity?: 'LIVE_LORA' | 'STALE' | 'OFFLINE';
  operating_mode?: 'HARDWARE_LIVE' | 'SIMULATION' | 'OFFLINE';
}

export interface MLPredictionData {
  depletion_rate_percent_per_hour: number | null;
  time_to_dry_seconds: number | null;
  time_to_dry_formatted: string | null;
  estimated_dry_timestamp: string | null;
  drought_vulnerability: 'OPTIMAL' | 'WARNING' | 'CRITICAL DROUGHT' | string;
  prescriptive_advisory: string | null;
  timestamp?: string;
}

export interface VisionDiagnosisResponse {
  disease: string;
  confidence: number; // 0 to 100 or 0.0 to 1.0
  pathogen_category: string;
  treatment: string;
  irrigation_advisory: string;
  timestamp?: string;
}

export interface IrrigationActuationRequest {
  duration_seconds: number;
  angle_degrees: number;
  mode?: 'MANUAL_OVERRIDE' | 'AUTO_PREDICTIVE';
}

export interface IrrigationActuationResponse {
  status: 'SUCCESS' | 'FAILED';
  servo_angle: number;
  duration_seconds: number;
  timestamp: string;
  message: string;
  event_id?: string;
}

export interface IrrigationHistoryItem {
  id: string;
  timestamp: string;
  trigger_source: 'AUTO_PREDICTIVE' | 'MANUAL_DASHBOARD' | string;
  servo_angle: number;
  duration_seconds: number;
  status: 'SUCCESS' | 'FAILED' | string;
  details?: string;
}

export interface ChatbotTelemetryContext {
  location: string;
  upper_moisture: string;
  lower_moisture: string;
  temperature: string;
  humidity: string;
  plant_stress_score: string;
  detected_disease: string;
  telemetry_status: 'LIVE' | 'STALE' | 'UNAVAILABLE';
}

export interface ChatbotRequest {
  message: string;
  language: string;
  telemetry_context: ChatbotTelemetryContext;
}

export interface ChatbotResponse {
  response: string;
  timestamp: string;
  context_used?: boolean;
}

export interface APIErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
