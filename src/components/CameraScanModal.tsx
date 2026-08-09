import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Upload, Check, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface CameraScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureImage: (imageDataUrl: string) => void;
}

export const CameraScanModal: React.FC<CameraScanModalProps> = ({
  isOpen,
  onClose,
  onCaptureImage,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

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

  const handleConfirmImage = () => {
    if (capturedPreview) {
      onCaptureImage(capturedPreview);
      onClose();
      setCapturedPreview(null);
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
              Scan / Upload Textbook Problem
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
          {capturedPreview ? (
            /* Preview captured image */
            <div className="relative w-full max-h-80 overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-black">
              <img
                src={capturedPreview}
                alt="Captured mistake problem"
                className="w-full h-full object-contain max-h-80"
              />
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
              <div className="flex space-x-3">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-3 px-4 bg-stone-800 text-stone-200 rounded-xl font-bold text-xs hover:bg-stone-700 flex items-center justify-center space-x-2 min-h-[44px] touch-manipulation"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake Photo</span>
                </button>
                <button
                  onClick={handleConfirmImage}
                  className="flex-1 py-3 px-4 bg-amber-400 text-amber-950 rounded-xl font-bold text-xs hover:bg-amber-300 flex items-center justify-center space-x-2 shadow-lg min-h-[44px] touch-manipulation"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Use Photo</span>
                </button>
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
                    <span>Upload from Gallery</span>
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
