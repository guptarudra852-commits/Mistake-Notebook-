import React, { useState, useEffect } from 'react';
import {
  BookMarked,
  Plus,
  Search,
  Settings,
  CheckCircle2,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Smartphone,
  Download,
} from 'lucide-react';
import { Subject, MistakeFilter } from '../types';

interface NotebookHeaderProps {
  filter: MistakeFilter;
  setFilter: React.Dispatch<React.SetStateAction<MistakeFilter>>;
  subjects: Subject[];
  onOpenAddModal: () => void;
  onOpenCameraModal: () => void;
  onOpenAnalytics: () => void;
  onOpenPreferences: () => void;
  onOpenInstallModal?: () => void;
  activeView: 'notebook' | 'checklist' | 'analytics';
  setActiveView: (view: 'notebook' | 'checklist' | 'analytics') => void;
  totalMistakesCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const NotebookHeader: React.FC<NotebookHeaderProps> = ({
  filter,
  setFilter,
  subjects,
  onOpenAddModal,
  onOpenCameraModal,
  onOpenAnalytics,
  onOpenPreferences,
  onOpenInstallModal,
  activeView,
  setActiveView,
  totalMistakesCount,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="bg-amber-900/90 text-amber-50 backdrop-blur-md border-b-4 border-amber-950 shadow-lg sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Branding & Main Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-200 flex items-center justify-center shadow-inner text-amber-950 font-bold transform -rotate-2 hover:rotate-0 transition-transform">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-serif font-extrabold tracking-tight text-amber-100">
                  Academic Mistake Notebook
                </h1>
                
                {/* Offline Ready Badge */}
                <span
                  className={`hidden sm:inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isOnline
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                      : 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse'
                  }`}
                  title={isOnline ? 'Network Online - Cloud Sync Ready' : 'Offline Mode Active - Saved Locally'}
                >
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span>{isOnline ? 'Online' : 'Offline Ready'}</span>
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-sans hidden sm:block">
                Log errors, master golden takeaways, and review every Sunday.
              </p>
            </div>
          </div>

          {/* Right Action Buttons: Download App & Preferences */}
          <div className="flex items-center space-x-2">
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                id="header-download-app-btn"
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 rounded-xl font-bold text-xs shadow-md border border-amber-300 transition-transform active:scale-95 touch-manipulation"
                title="Download / Install App on Phone"
              >
                <Smartphone className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            <button
              onClick={onOpenPreferences}
              id="header-preferences-btn"
              className="p-2 text-amber-300 hover:text-white hover:bg-amber-800/60 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation"
              title="Notebook Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Search & Filter Toolbar (Visible in Notebook View) */}
        {activeView === 'notebook' && (
          <div className="mt-3 pt-3 border-t border-amber-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-amber-400/80 pointer-events-none" />
              <input
                type="text"
                placeholder="Search topics, questions, formulas, takeaways..."
                value={filter.searchQuery}
                onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
                id="notebook-search-input"
                className="w-full pl-9 pr-3 py-1.5 bg-amber-950/80 border border-amber-700/80 rounded-lg text-xs text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              {filter.searchQuery && (
                <button
                  onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-2.5 top-2 text-amber-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </header>
  );
};
