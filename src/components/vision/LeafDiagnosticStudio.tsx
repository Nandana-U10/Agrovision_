import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, CheckCircle2, AlertCircle, RefreshCw, Sparkles, X } from 'lucide-react';
import { useVisionDiagnosis } from '../../hooks/useVisionDiagnosis';
import { DiseaseResultCard } from './DiseaseResultCard';

export const LeafDiagnosticStudio: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Vision API mutation
  const diagnosisMutation = useVisionDiagnosis();

  // Clean up object URLs and camera streams on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      stopCamera();
    };
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
    diagnosisMutation.reset();

    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Unable to access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `leaf_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleFileSelect(file);
          stopCamera();
          setActiveTab('upload');
        }
      }, 'image/jpeg', 0.92);
    }
  };

  const handleTabChange = (tab: 'upload' | 'camera') => {
    setActiveTab(tab);
    if (tab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const handleDiagnose = () => {
    if (selectedFile) {
      diagnosisMutation.mutate(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200">
                {t('vision.diagnostic_studio')}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Deep Neural Plant Pathology Classification
              </p>
            </div>
          </div>

          {/* Input Mode Selector */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleTabChange('upload')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'upload'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              {t('vision.file_upload_mode')}
            </button>
            <button
              onClick={() => handleTabChange('camera')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'camera'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              {t('vision.camera_mode')}
            </button>
          </div>
        </div>

        {/* Input Area */}
        {activeTab === 'upload' ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 text-center bg-slate-900/40 transition-colors cursor-pointer"
            onClick={() => document.getElementById('leaf-image-input')?.click()}
          >
            <input
              id="leaf-image-input"
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            {previewUrl ? (
              <div className="flex flex-col md:flex-row items-center gap-6 text-left">
                <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                  <img src={previewUrl} alt="Leaf Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setImageDimensions(null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-slate-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs flex-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Leaf Image Loaded & Ready</span>
                  </div>
                  <div className="space-y-1 font-mono text-slate-300">
                    <p><span className="text-slate-500">{t('vision.filename')}:</span> {selectedFile?.name}</p>
                    <p><span className="text-slate-500">{t('vision.file_size')}:</span> {selectedFile ? formatFileSize(selectedFile.size) : '--'}</p>
                    {imageDimensions && (
                      <p><span className="text-slate-500">{t('vision.dimensions')}:</span> {imageDimensions.width} × {imageDimensions.height} px</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300">
                    {t('vision.drag_drop')}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports high-resolution JPEG and PNG leaf captures
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Camera Stream View */
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center min-h-[260px]">
            {cameraError ? (
              <div className="p-6 text-center text-rose-300 text-xs space-y-2">
                <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
                <p>{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded-lg font-semibold"
                >
                  Retry Camera
                </button>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full max-h-[320px] object-cover rounded-2xl" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  <button
                    onClick={capturePhoto}
                    className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 hover:bg-emerald-400 transition-all text-xs"
                  >
                    <Camera className="w-4 h-4" />
                    {t('vision.take_photo')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Diagnosis Action Button */}
        {selectedFile && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleDiagnose}
              disabled={diagnosisMutation.isPending}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              {diagnosisMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{t('vision.analyzing')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{t('vision.diagnose_button')}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Notice */}
        {diagnosisMutation.isError && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-bold">Vision Diagnostic API Failed</p>
              <p className="text-[11px] text-rose-400 mt-0.5">
                {diagnosisMutation.error.message || 'Backend server unavailable. Classification suspended.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Diagnostic Result Card */}
      {diagnosisMutation.data && (
        <DiseaseResultCard result={diagnosisMutation.data} />
      )}
    </div>
  );
};
