import React, { useState } from 'react';
import { ShieldCheck, Lock, Delete, Fingerprint, KeyRound, Sparkles } from 'lucide-react';

interface PinLockScreenProps {
  onUnlock: () => void;
  correctPin: string;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlock, correctPin }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [biometricScanning, setBiometricScanning] = useState<boolean>(false);

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');

      if (nextPin.length === 4) {
        if (nextPin === correctPin || correctPin === '') {
          onUnlock();
        } else {
          setError('Incorrect PIN code. Please try again.');
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleBiometricSimulate = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      onUnlock();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6 select-none animate-fade-in">
      {/* Decorative Top Badge */}
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-xl text-amber-400">
        <Lock className="w-8 h-8 animate-pulse" />
      </div>

      <h1 className="text-2xl font-serif font-bold text-amber-100 mb-1 text-center">
        Notebook Security Lock
      </h1>
      <p className="text-xs text-stone-400 mb-8 text-center max-w-xs">
        Enter your 4-digit PIN code or use Biometric unlock to access your private academic entries.
      </p>

      {/* PIN Dots */}
      <div className="flex items-center space-x-4 mb-6">
        {[0, 1, 2, 3].map((idx) => {
          const filled = idx < pin.length;
          return (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                filled
                  ? 'bg-amber-400 border-amber-400 scale-110 shadow-lg shadow-amber-500/30'
                  : 'bg-stone-900 border-stone-700'
              }`}
            />
          );
        })}
      </div>

      {/* Error Message */}
      <div className="h-6 mb-4">
        {error && <span className="text-xs text-rose-400 font-medium animate-bounce">{error}</span>}
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-8">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigitClick(digit)}
            className="h-16 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 font-bold text-xl hover:bg-stone-800 active:scale-95 transition-all flex items-center justify-center shadow-md min-h-[56px] touch-manipulation"
          >
            {digit}
          </button>
        ))}

        {/* Biometric Button */}
        <button
          onClick={handleBiometricSimulate}
          disabled={biometricScanning}
          className="h-16 rounded-2xl bg-stone-900/60 border border-amber-500/30 text-amber-400 hover:bg-amber-950/40 active:scale-95 transition-all flex items-center justify-center min-h-[56px] touch-manipulation"
          title="Biometric Fingerprint / FaceID"
        >
          <Fingerprint className={`w-7 h-7 ${biometricScanning ? 'animate-spin text-amber-300' : ''}`} />
        </button>

        {/* '0' Button */}
        <button
          onClick={() => handleDigitClick('0')}
          className="h-16 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 font-bold text-xl hover:bg-stone-800 active:scale-95 transition-all flex items-center justify-center shadow-md min-h-[56px] touch-manipulation"
        >
          0
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="h-16 rounded-2xl bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800 active:scale-95 transition-all flex items-center justify-center min-h-[56px] touch-manipulation"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      {/* Biometric Scan Overlay indicator */}
      {biometricScanning && (
        <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/80 border border-amber-500/40 px-4 py-2 rounded-full animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>Verifying FaceID / TouchID...</span>
        </div>
      )}

      {/* Bypass hint for convenience if user forgot */}
      <div className="mt-4 text-[10px] text-stone-500">
        Demo PIN default: <code className="text-amber-400 font-mono">1234</code> or tap Fingerprint
      </div>
    </div>
  );
};
