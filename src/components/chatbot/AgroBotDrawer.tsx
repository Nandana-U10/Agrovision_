import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Send, X, Bot, User, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { sendChatMessage } from '../../api/chatbot';
import type { TelemetryData, ChatbotTelemetryContext } from '../../types/api';

interface AgroBotDrawerProps {
  telemetry: TelemetryData | undefined;
  isTelemetryOffline: boolean;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

type SpeechRecognitionType = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: { results: Array<{ [key: number]: { transcript: string } }> }) => void;
  onerror: () => void;
  onend: () => void;
};

export const AgroBotDrawer: React.FC<AgroBotDrawerProps> = ({ telemetry, isTelemetryOffline }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionType> | null>(null);

  useEffect(() => {
    if (isOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechClass = (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType }).webkitSpeechRecognition;

    if (!SpeechClass) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = i18n.language || 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const buildTelemetryContext = (): ChatbotTelemetryContext => {
    if (isTelemetryOffline || !telemetry) {
      return {
        location: 'Terrace Block A (Node 01)',
        upper_moisture: 'UNAVAILABLE',
        lower_moisture: 'UNAVAILABLE',
        temperature: 'UNAVAILABLE',
        humidity: 'UNAVAILABLE',
        plant_stress_score: 'UNAVAILABLE',
        detected_disease: 'NONE',
        telemetry_status: 'UNAVAILABLE',
      };
    }

    return {
      location: `${telemetry.field_name || 'Terrace Block A'} (${telemetry.node_id || 'Node 01'})`,
      upper_moisture: telemetry.upper_moisture !== null ? `${telemetry.upper_moisture}%` : 'N/A',
      lower_moisture: telemetry.lower_moisture !== null ? `${telemetry.lower_moisture}%` : 'N/A',
      temperature: telemetry.temperature !== null ? `${telemetry.temperature}°C` : 'N/A',
      humidity: telemetry.humidity !== null ? `${telemetry.humidity}%` : 'N/A',
      plant_stress_score: telemetry.plant_stress_score !== null ? `${telemetry.plant_stress_score}` : 'N/A',
      detected_disease: 'NONE',
      telemetry_status: 'LIVE',
    };
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText('');
    setErrorMsg(null);

    const userMsg: MessageItem = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const context = buildTelemetryContext();
      const response = await sendChatMessage({
        message: userText,
        language: i18n.language,
        telemetry_context: context,
      });

      const botMsg: MessageItem = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: response.response || 'No response received from AgroBot.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errorText = (err as { message?: string })?.message || 'AgroBot AI service unavailable (Backend Offline)';
      setErrorMsg(errorText);

      const botErrorMsg: MessageItem = {
        id: `bot_err_${Date.now()}`,
        sender: 'bot',
        text: `⚠️ ${errorText}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-2xl shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105 cursor-pointer border border-emerald-400 flex items-center justify-center"
        title="AgroBot AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 animate-pulse" />}
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm sm:max-w-md h-[520px] glass-panel rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  {t('chatbot.title')}
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {t('chatbot.subtitle')}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Badge Strip */}
          <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/60 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-mono text-slate-300">
              <Layers className="w-3 h-3 text-emerald-400" />
              {!isTelemetryOffline ? (
                <span className="text-emerald-400 font-semibold">{t('chatbot.telemetry_attached')}</span>
              ) : (
                <span className="text-rose-400 font-semibold">{t('chatbot.telemetry_offline')}</span>
              )}
            </div>
            <span className="text-slate-500 uppercase font-mono">{i18n.language}</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
                  <Bot className="w-6 h-6" />
                </div>
                <p className="font-semibold text-slate-300">Hello! I am AgroBot.</p>
                <p className="text-[11px] text-slate-500">
                  Ask me anything about terrace soil moisture, leaf diagnostics, irrigation schedules, or drought risk.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[9px] block mt-1 text-right font-mono ${msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-500'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>AgroBot is thinking...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
            {errorMsg && (
              <div className="text-[10px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title={t('chatbot.speech_tooltip')}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />

              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
