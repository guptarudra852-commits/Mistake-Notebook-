import React, { useState } from 'react';
import {
  X,
  Settings,
  Download,
  Upload,
  RotateCcw,
  FileText,
  Bell,
  Lock,
  Moon,
  Sun,
  MapPin,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { exportBackupData, importBackupData, resetToDefaultData } from '../utils/storage';
import { UserPreferences } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
  onDataReload: () => void;
  onOpenInstallModal?: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onDataReload,
  onOpenInstallModal,
}) => {
  const [pinInput, setPinInput] = useState(preferences.pinLockCode || '');

  if (!isOpen) return null;

  const handleExport = () => {
    const json = exportBackupData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academic_mistakes_notebook_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackupData(content);
        if (success) {
          alert('Backup restored successfully!');
          onDataReload();
          onClose();
        } else {
          alert('Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all notebook data back to default initial state?')) {
      resetToDefaultData();
      onDataReload();
      onClose();
    }
  };

  const handleRequestPushNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdatePreferences({ ...preferences, pushNotificationsEnabled: true });
        new Notification('Academic Mistake Notebook 🗓️', {
          body: 'Push alerts enabled! You will be reminded for your Sunday revision sessions.',
        });
      } else {
        alert('Browser notification permission was denied or blocked.');
        onUpdatePreferences({ ...preferences, pushNotificationsEnabled: false });
      }
    } else {
      alert('Push notifications are not supported in this browser.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-amber-50 rounded-2xl shadow-2xl border-4 border-amber-900 w-full max-w-lg overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-amber-900 text-amber-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-bold text-base">Notebook & Security Settings</h3>
          </div>
          <button onClick={onClose} className="text-amber-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Mobile Install App / APK Option */}
          {onOpenInstallModal && (
            <div className="bg-gradient-to-r from-amber-900 to-amber-950 p-4 rounded-xl border border-amber-700 text-amber-100 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-400 text-amber-950 rounded-xl flex items-center justify-center font-bold shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-100">
                    Install App on Smartphone
                  </h4>
                  <p className="text-[11px] text-amber-200/80">
                    Download & add to Android/iOS home screen for offline use.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInstallModal();
                }}
                id="prefs-install-app-btn"
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs shrink-0 shadow transition-transform active:scale-95"
              >
                Install App
              </button>
            </div>
          )}
          
          {/* Mobile Display & Theme Toggle */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center space-x-1">
              <Sun className="w-4 h-4 text-amber-700" />
              <span>Theme & Mobile Display Mode</span>
            </label>
            <div className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-900 flex items-center space-x-1">
                  <span>Night / Dark OLED Mode</span>
                </span>
                <p className="text-[11px] text-stone-500">
                  Saves smartphone battery and reduces eye strain during late night study.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUpdatePreferences({ ...preferences, darkMode: !preferences.darkMode })}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                  preferences.darkMode
                    ? 'bg-amber-950 text-amber-300 border border-amber-700'
                    : 'bg-amber-100 text-amber-950 border border-amber-300'
                }`}
              >
                {preferences.darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
                <span>{preferences.darkMode ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>

          {/* Security PIN Code Lock */}
          <div className="space-y-3 pt-3 border-t border-amber-200">
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center space-x-1">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Passcode & Biometric Security Lock</span>
            </label>

            <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={preferences.isPinLocked || false}
                  onChange={(e) =>
                    onUpdatePreferences({
                      ...preferences,
                      isPinLocked: e.target.checked,
                      pinLockCode: e.target.checked ? (pinInput || '1234') : '',
                    })
                  }
                  className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                />
                <span>Enable Security Lock on Notebook Entry</span>
              </label>

              {preferences.isPinLocked && (
                <div className="space-y-1.5 pl-6">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    4-Digit PIN Code:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      onUpdatePreferences({ ...preferences, pinLockCode: e.target.value });
                    }}
                    placeholder="1234"
                    className="w-32 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-xs font-mono font-bold text-center tracking-widest text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-stone-500">
                    When enabled, opening the app requires entering this 4-digit PIN or using TouchID/FaceID.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Native Device Push Notifications & Reminders */}
          <div className="space-y-3 pt-3 border-t border-amber-200">
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center space-x-1">
              <Bell className="w-4 h-4 text-amber-700" />
              <span>Native Push Alerts & Reminders</span>
            </label>

            <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900">Push Notifications</span>
                  <p className="text-[11px] text-stone-500">
                    Receive weekly Sunday revision popups on your device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPushNotification}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold flex items-center space-x-1 shadow"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{preferences.pushNotificationsEnabled ? 'Enabled ✅' : 'Enable Alerts'}</span>
                </button>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={preferences.autoFlagNewMistakesForSunday}
                  onChange={(e) =>
                    onUpdatePreferences({
                      ...preferences,
                      autoFlagNewMistakesForSunday: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                />
                <span>Auto-flag new mistakes for Sunday Revision</span>
              </label>
            </div>
          </div>

          {/* Paper Grid Style */}
          <div className="space-y-2 pt-3 border-t border-amber-200">
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center space-x-1">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>Notebook Paper Style</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'lines', label: 'Lined' },
                { id: 'grid', label: 'Grid' },
                { id: 'dots', label: 'Dots' },
                { id: 'blank', label: 'Blank' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() =>
                    onUpdatePreferences({ ...preferences, paperGridStyle: style.id as any })
                  }
                  className={`p-2 rounded-xl border text-xs font-bold transition-all min-h-[44px] ${
                    preferences.paperGridStyle === style.id
                      ? 'bg-amber-400 text-amber-950 border-amber-600 shadow'
                      : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div className="pt-4 border-t border-amber-200 space-y-3">
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
              Notebook Backup & Import
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExport}
                className="px-3.5 py-2.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold flex items-center space-x-1 min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>Export Backup (JSON)</span>
              </button>

              <label className="px-3.5 py-2.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer min-h-[44px]">
                <Upload className="w-4 h-4" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleReset}
                className="px-3 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl text-xs font-bold flex items-center space-x-1 ml-auto min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

