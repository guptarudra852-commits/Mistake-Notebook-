import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Upload, Check, RefreshCw, Image as ImageIcon, BookOpen, Sparkles } from 'lucide-react';
import { Subject } from '../types';

interface CameraScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureImage?: (imageDataUrl: string) => void;
  onCapture?: (imageDataUrl: string) => void;
  subjects?: Subject[];
  currentSubjectId?: string;
  onSavePhotoOnly?: (photoData: { imageUrl: string; subjectId: string; title?: string }) => void;
}

export const CameraScanModal: React.FC<CameraScanModalProps> = ({
  isOpen,
  onClose,
  onCaptureImage,
  onCapture,
  subjects = [],
  currentSubjectId,
  onSavePhotoOnly,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  const defaultSubject =
    currentSubjectId && currentSubjectId !== 'all'
      ? currentSubjectId
      : subjects[0]?.id || 's1';

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(defaultSubject);
  const [customTitle, setCustomTitle] = useState<string>('');

  useEffect(() => {
    if (currentSubjectId && currentSubjectId !== 'all') {
      setSelectedSubjectId(currentSubjectId);
    } else if (subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [currentSubjectId, subjects, isOpen]);

  // Initialize camera stream when modal opens
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen && !capturedPreview) {
      navigator.mediaDevices
        ?.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setIsCameraActive(true);
            setCameraError('');
          }
        })
        .catch((err) => {
          console.warn('Camera access error or restricted:', err);
          setCameraError(
            'Camera permission required or not available. You can also upload a photo from your gallery below.'
          );
          setIsCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, capturedPreview]);

  if (!isOpen) return null;

  const handleTakeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPreview(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmImageFullEditor = () => {
    if (capturedPreview) {
      if (typeof onCaptureImage === 'function') {
        onCaptureImage(capturedPreview);
      } else if (typeof onCapture === 'function') {
        onCapture(capturedPreview);
      }
      onClose();
      setCapturedPreview(null);
    }
  };

  const handleConfirmImagePhotoOnly = () => {
    if (capturedPreview && onSavePhotoOnly) {
      onSavePhotoOnly({
        imageUrl: capturedPreview,
        subjectId: selectedSubjectId,
        title: customTitle.trim(),
      });
      onClose();
      setCapturedPreview(null);
      setCustomTitle('');
    } else {
      handleConfirmImageFullEditor();
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-stone-900 border border-amber-900/60 text-stone-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-amber-900/40 flex items-center justify-between bg-amber-950/40">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-serif font-bold text-amber-100">
              Photo Upload / Camera Scanner
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 flex flex-col items-center justify-center space-y-4">
          
          {/* Subject Selection Option (Shown always) */}
          {subjects.length > 0 && (
            <div className="w-full bg-stone-950/80 p-3 rounded-2xl border border-amber-900/40 space-y-2">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                Select Subject *
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                id="photo-upload-subject-select"
                className="w-full bg-stone-900 border border-amber-800/80 text-amber-100 text-sm font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {capturedPreview ? (
            /* Preview captured image */
            <div className="w-full space-y-3">
              <div className="relative w-full max-h-72 overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-black flex items-center justify-center">
                <img
                  src={capturedPreview}
                  alt="Captured mistake problem"
                  className="w-full h-full object-contain max-h-72"
                />
              </div>

              {/* Optional Title/Caption Input */}
              <div>
                <input
                  type="text"
                  placeholder="Optional Title / Note (e.g. Question 14 Page 52)..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-amber-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          ) : isCameraActive ? (
            /* Live Camera Stream */
            <div className="relative w-full aspect-4/3 bg-black rounded-2xl overflow-hidden border border-amber-900/40 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder crosshairs */}
              <div className="absolute inset-8 border-2 border-dashed border-amber-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] bg-black/60 text-amber-300 px-2 py-1 rounded-full font-sans">
                  Align problem or equation here
                </span>
              </div>
            </div>
          ) : (
            /* Camera disabled or error fallback */
            <div className="w-full py-8 px-4 bg-stone-950/60 border-2 border-dashed border-stone-800 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs text-stone-300">
                {cameraError || 'Use your camera or select a photo from your mobile device.'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full space-y-3 pt-2">
            {capturedPreview ? (
              <div className="flex flex-col gap-2">
                {/* Subject-Only Quick Save Button */}
                <button
                  onClick={handleConfirmImagePhotoOnly}
                  id="btn-photo-subject-only-save"
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg min-h-[46px] touch-manipulation transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Save Photo to Subject Only</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={handleRetake}
                    className="flex-1 py-2.5 px-3 bg-stone-800 text-stone-200 rounded-xl font-bold text-xs hover:bg-stone-700 flex items-center justify-center space-x-1.5 min-h-[42px] touch-manipulation"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>

                  <button
                    onClick={handleConfirmImageFullEditor}
                    className="flex-1 py-2.5 px-3 bg-amber-500/20 text-amber-200 border border-amber-500/50 hover:bg-amber-500/30 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 min-h-[42px] touch-manipulation"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Detailed Editor</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {isCameraActive && (
                  <button
                    onClick={handleTakeSnapshot}
                    className="py-3 px-4 bg-amber-400 text-amber-950 rounded-xl font-bold text-xs hover:bg-amber-300 flex items-center justify-center space-x-2 shadow-lg min-h-[48px] touch-manipulation"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Snap Photo</span>
                  </button>
                )}

                <label className={`py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer min-h-[48px] touch-manipulation ${!isCameraActive ? 'col-span-full' : ''}`}>
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Upload Photo from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

