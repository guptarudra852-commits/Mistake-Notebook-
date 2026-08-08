import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, CheckCircle, Share, ExternalLink, ShieldCheck, QrCode, Copy, Sparkles } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'qr'>('pwa');

  // Ensure app URL is clean
  const appUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=78350f&bg=fef3c7&data=${encodeURIComponent(appUrl)}`;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    try {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } else {
        // Open in a new window/tab to break out of iframe preview restrictions
        window.open(appUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      // If blocked by iframe policy, open direct link
      window.open(appUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-amber-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-300 rounded-2xl flex items-center justify-center border border-amber-500/40 shadow-inner shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-extrabold text-amber-100">
                Install App on Phone / Mobile
              </h3>
              <p className="text-xs text-amber-200/80">
                Mobile Web App & Android APK Guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-stone-950 p-1 border border-stone-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'pwa'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            1-Tap Install (PWA)
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'qr'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            Scan QR Code
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'apk'
                ? 'bg-amber-500 text-stone-950 font-bold shadow'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            Generate APK
          </button>
        </div>

        {/* Tab 1: PWA Direct Install */}
        {activeTab === 'pwa' && (
          <div className="space-y-4">
            {isInstalled ? (
              <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-4 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-200">
                  App Installed & Ready!
                </h4>
                <p className="text-xs text-emerald-300/80">
                  Academic Mistake Notebook is running as a standalone mobile application.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-950/90 to-stone-900 border border-amber-800/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Web App (Recommended)
                  </span>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-amber-400/40">
                    No APK Warnings
                  </span>
                </div>

                <p className="text-xs text-amber-200/90 leading-relaxed">
                  To install without browser restrictions, open the app directly in your phone's browser (Chrome or Safari).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleInstallClick}
                    id="pwa-native-install-btn"
                    className="py-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-amber-950 font-black rounded-xl text-xs shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-95"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>{deferredPrompt ? 'Install App Now' : 'Open in Phone Browser'}</span>
                  </button>

                  <a
                    href={appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-xl text-xs border border-amber-800/60 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in New Tab</span>
                  </a>
                </div>
              </div>
            )}

            {/* Device Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-2 font-bold text-amber-300">
                  <span className="text-sm">🤖</span>
                  <span>Android (Chrome)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-300 text-[11px]">
                  <li>Open app URL in <b>Chrome</b>.</li>
                  <li>Tap top-right menu <b>(⋮)</b>.</li>
                  <li>Tap <b>"Install app"</b> or <b>"Add to Home screen"</b>.</li>
                </ol>
              </div>

              <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-2 font-bold text-amber-300">
                  <span className="text-sm">🍏</span>
                  <span>iPhone / iOS (Safari)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-300 text-[11px]">
                  <li>Open app URL in <b>Safari</b>.</li>
                  <li>Tap bottom <b>Share button</b> <Share className="w-3 h-3 inline mx-0.5" />.</li>
                  <li>Tap <b>"Add to Home Screen"</b>.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scan QR Code */}
        {activeTab === 'qr' && (
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 text-center space-y-4">
            <div className="bg-amber-100 p-3 rounded-2xl inline-block shadow-inner mx-auto">
              <img
                src={qrCodeUrl}
                alt="Scan QR Code to open app on mobile"
                className="w-40 h-40 mx-auto rounded-lg"
              />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-200">
                Scan with Phone Camera
              </h4>
              <p className="text-xs text-stone-400 max-w-xs mx-auto mt-1">
                Point your phone camera at this QR code to open Academic Mistake Notebook on your mobile device instantly.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Convert PWA to APK */}
        {activeTab === 'apk' && (
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex items-center space-x-2 font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Native Android APK & Expo / Capacitor Configured</span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              We have generated valid <b>app.json</b> (Expo), <b>capacitor.config.ts</b> (Capacitor), and <b>AndroidManifest.xml</b> files with camera, offline, and storage permissions pre-configured.
            </p>
            <div className="pt-1 flex flex-wrap gap-2">
              <a
                href="/AndroidManifest.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold border border-amber-500/40 inline-flex items-center space-x-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View AndroidManifest.xml</span>
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-300 text-[11px] pl-1 pt-1">
              <li>Copy the app URL below.</li>
              <li>Use <b>PWABuilder.com</b>, <b>Capacitor Android</b>, or <b>Expo EAS Build</b>.</li>
              <li>Build your Android <b>.apk</b> or <b>.aab</b> package with zero errors.</li>
            </ol>
          </div>
        )}

        {/* Copy Link Footer */}
        <div className="flex items-center justify-between bg-stone-950 border border-stone-800 p-3 rounded-2xl">
          <span className="text-xs text-stone-400 font-mono truncate max-w-[200px] sm:max-w-[260px]">
            {appUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded-xl text-xs font-bold border border-amber-700/60 transition-colors shrink-0 flex items-center space-x-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied! ✓' : 'Copy Link'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

