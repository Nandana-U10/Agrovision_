# AgroVision — Real-Time Smart Agriculture Dashboard 🌿🤖

AgroVision is a production-grade, real-time IoT & AI Smart Agriculture Command Center designed for field node monitoring, machine learning soil moisture depletion forecasting, computer vision leaf pathology diagnostics, servo sluice gate actuation, and context-aware agronomist AI assistance.

> **🚨 Strict Zero-Mock Policy**: AgroVision contains **NO mock data, NO fake telemetry, NO simulated sensor numbers, and NO hardcoded ML/Vision outputs**. All metrics, predictions, diagnosis reports, and actuation responses strictly originate from backend REST endpoints. If a backend API is unreachable, the dashboard displays explicit **BACKEND OFFLINE** and **NO DATA** states.

---

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **State & Polling**: TanStack Query (React Query) v5, Axios
- **Charts**: Recharts
- **Internationalization**: i18next, react-i18next (6 Regional Languages)
- **APIs & Vision**: Browser HTML5 `getUserMedia` Camera API, Web Speech API

---

## 📁 Project Architecture

```
src/
├── api/
│   ├── client.ts             # Centralized Axios client with 12s timeout & interceptors
│   ├── telemetry.ts          # GET /api/v1/telemetry/live
│   ├── ml.ts                 # GET /api/v1/ml/predict-drying
│   ├── vision.ts             # POST /api/v1/vision/diagnose (multipart/form-data)
│   ├── irrigation.ts         # POST /api/v1/irrigation/actuate & GET /api/v1/irrigation/history
│   └── chatbot.ts            # POST /api/v1/chatbot/query
│
├── components/
│   ├── layout/
│   │   └── Header.tsx        # Command Center header, RSSI signal quality & i18n switcher
│   ├── telemetry/
│   │   ├── TelemetryGrid.tsx # Real-time telemetry grid
│   │   └── TelemetryCard.tsx # Individual telemetry metric cards (-- % / NO DATA when offline)
│   ├── ml/
│   │   └── MLForecastCard.tsx# Soil depletion rate, time to dry countdown & drought vulnerability
│   ├── vision/
│   │   ├── LeafDiagnosticStudio.tsx # Camera stream & drag-drop uploader
│   │   └── DiseaseResultCard.tsx    # Pathology result & confidence progress bar
│   ├── irrigation/
│   │   ├── SluiceGateControl.tsx    # Auto/Manual mode, duration & actuation controls
│   │   ├── SluiceGateVisual.tsx     # SVG animated sluice gate visual
│   │   └── AuditTrailTable.tsx      # Actuation event history table
│   ├── charts/
│   │   ├── RunoffGradientChart.tsx  # Slope upper & lower moisture time series
│   │   └── WeatherCorrelationChart.tsx# Microclimate temp, humidity & stress index
│   └── chatbot/
│       └── AgroBotDrawer.tsx # Context-aware AI agronomist drawer with voice speech input
│
├── hooks/
│   ├── useLiveTelemetry.ts   # 3-second polling hook & live history buffer
│   ├── useMLPrediction.ts    # ML drying forecast query hook
│   ├── useVisionDiagnosis.ts # Leaf image upload mutation hook
│   └── useIrrigation.ts      # Actuation mutation & audit history hook
│
├── i18n/
│   ├── index.ts              # i18next configuration
│   └── locales/              # en, hi, as, bn, mr, kn regional language JSON files
│
├── types/
│   └── api.ts                # Strictly typed API interface schemas
│
├── utils/
│   ├── formatters.ts         # Packet age, numeric formatting & countdown helpers
│   └── signal.ts             # RSSI signal strength quality categorizer
│
├── pages/
│   └── Dashboard.tsx         # Responsive Command Center layout
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🚀 Environment Configuration & Installation

### 1. Environment Variable Setup
Create a `.env` file in the root directory (refer to `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Local Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🛰️ Required Backend API Contract

Your backend server must expose the following REST endpoints:

### 1. Live Telemetry (`GET /api/v1/telemetry/live`)
Palled automatically every 3 seconds.

```json
{
  "node_id": "Field Node 01",
  "field_name": "Terrace Block A",
  "timestamp": "2026-08-25T19:18:29.000Z",
  "upper_moisture": 38.2,
  "lower_moisture": 52.4,
  "temperature": 28.4,
  "humidity": 55.0,
  "plant_stress_score": 0.32,
  "rssi": -65,
  "connectivity": "LIVE_LORA",
  "operating_mode": "HARDWARE_LIVE"
}
```

### 2. ML Drying Forecast (`GET /api/v1/ml/predict-drying`)

```json
{
  "depletion_rate_percent_per_hour": 1.45,
  "time_to_dry_seconds": 9240,
  "time_to_dry_formatted": "02h 34m",
  "estimated_dry_timestamp": "2026-08-25T21:52:29.000Z",
  "drought_vulnerability": "WARNING",
  "prescriptive_advisory": "High evaporation detected. Trigger sluice gate for 15s to recharge upper terrace root zone."
}
```

### 3. AI Vision Leaf Diagnostic (`POST /api/v1/vision/diagnose`)
Request: `multipart/form-data` with `image` file field.

```json
{
  "disease": "Tomato Early Blight (Alternaria solani)",
  "confidence": 88.5,
  "pathogen_category": "Fungal Pathogen",
  "treatment": "Apply copper-based fungicide spray (0.2%) during early morning hours.",
  "irrigation_advisory": "Avoid overhead sprinkler irrigation to reduce leaf wetness duration."
}
```

### 4. Sluice Gate Actuation (`POST /api/v1/irrigation/actuate`)
Request Body:
```json
{
  "duration_seconds": 15,
  "angle_degrees": 90,
  "mode": "MANUAL_OVERRIDE"
}
```
Response:
```json
{
  "status": "SUCCESS",
  "servo_angle": 90,
  "duration_seconds": 15,
  "timestamp": "2026-08-25T19:18:29.000Z",
  "message": "Sluice gate successfully actuated for 15 seconds."
}
```

### 5. Irrigation Audit History (`GET /api/v1/irrigation/history`)

```json
[
  {
    "id": "evt_101",
    "timestamp": "2026-08-25T19:10:00.000Z",
    "trigger_source": "AUTO_PREDICTIVE",
    "servo_angle": 90,
    "duration_seconds": 15,
    "status": "SUCCESS"
  }
]
```

### 6. AgroBot AI Agronomist Query (`POST /api/v1/chatbot/query`)
Request Body:
```json
{
  "message": "What is the recommended sluice gate duration for current soil conditions?",
  "language": "en",
  "telemetry_context": {
    "location": "Terrace Block A (Node 01)",
    "upper_moisture": "38.2%",
    "lower_moisture": "52.4%",
    "temperature": "28.4°C",
    "humidity": "55%",
    "plant_stress_score": "0.32",
    "detected_disease": "NONE",
    "telemetry_status": "LIVE"
  }
}
```

---

## 🌐 Multilingual Support (6 Regional Languages)

Switch language instantly from the Header dropdown:
1. **English** (`en`)
2. **Hindi** — हिन्दी (`hi`)
3. **Assamese** — অসমীয়া (`as`)
4. **Bengali** — বাংলা (`bn`)
5. **Marathi** — मराठी (`mr`)
6. **Kannada** — ಕನ್ನಡ (`kn`)

---

## 🔧 Backend Troubleshooting

1. **"BACKEND OFFLINE" Banner**: Ensure your Python FastAPI / Node.js backend server is running on `http://localhost:8000` (or update `VITE_API_BASE_URL` in `.env`).
2. **CORS Headers**: Ensure your backend includes CORS middleware allowing origin `http://localhost:5173`.
