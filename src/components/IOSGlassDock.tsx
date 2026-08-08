import React from 'react';
import { BookOpen, CheckSquare, Plus, BarChart3, Settings, Camera } from 'lucide-react';

interface IOSGlassDockProps {
  activeView: 'notebook' | 'checklist' | 'analytics';
  setActiveView: (view: 'notebook' | 'checklist' | 'analytics') => void;
  onOpenAddModal: () => void;
  onOpenCameraModal: () => void;
  onOpenPreferences: () => void;
  totalMistakesCount: number;
  checklistPendingCount: number;
}

export const IOSGlassDock: React.FC<IOSGlassDockProps> = ({
  activeView,
  setActiveView,
  onOpenAddModal,
  onOpenCameraModal,
  onOpenPreferences,
  totalMistakesCount,
  checklistPendingCount,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md select-none pointer-events-auto">
      {/* iOS Floating Frosted Glass Dock Container - Centered symmetric 5-button layout */}
      <div className="relative bg-stone-900/80 dark:bg-stone-950/85 backdrop-blur-2xl border border-white/20 dark:border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-full px-3 py-2 flex items-center justify-between gap-1 ring-1 ring-black/40 transition-all duration-300 hover:border-amber-400/40">
        
        {/* Top Glass Highlight Reflection */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Left Item 1: Notebook */}
        <button
          onClick={() => setActiveView('notebook')}
          className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 min-h-[48px] min-w-[48px] touch-manipulation hover:scale-105 active:scale-95 ${
            activeView === 'notebook'
              ? 'text-amber-300 font-bold bg-white/15 dark:bg-white/10 shadow-inner'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
          title="Notebook Entries"
        >
          <div className="relative">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-105" />
            {totalMistakesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-md">
                {totalMistakesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5 hidden xs:inline tracking-tight">Notebook</span>
          {activeView === 'notebook' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
          )}
        </button>

        {/* Left Item 2: Checklist */}
        <button
          onClick={() => setActiveView('checklist')}
          className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 min-h-[48px] min-w-[48px] touch-manipulation hover:scale-105 active:scale-95 ${
            activeView === 'checklist'
              ? 'text-amber-300 font-bold bg-white/15 dark:bg-white/10 shadow-inner'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
          title="Study Checklist"
        >
          <div className="relative">
            <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-105" />
            {checklistPendingCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-stone-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-md">
                {checklistPendingCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5 hidden xs:inline tracking-tight">Checklist</span>
          {activeView === 'checklist' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
          )}
        </button>

        {/* CENTER ITEM (3/5): Elevated Vivid Gradient Plus (+) Button */}
        <div className="relative -top-3.5 px-0.5 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-amber-950 rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(245,158,11,0.6)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.8)] active:scale-90 hover:scale-110 transition-all duration-200 border-2 border-stone-900 dark:border-stone-950 touch-manipulation"
            title="Log New Mistake"
          >
            <Plus className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
          </button>
        </div>

        {/* Right Item 4: Analytics / Progress */}
        <button
          onClick={() => setActiveView('analytics')}
          className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 min-h-[48px] min-w-[48px] touch-manipulation hover:scale-105 active:scale-95 ${
            activeView === 'analytics'
              ? 'text-amber-300 font-bold bg-white/15 dark:bg-white/10 shadow-inner'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
          title="Progress Analytics"
        >
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-105" />
          <span className="text-[10px] font-medium mt-0.5 hidden xs:inline tracking-tight">Progress</span>
          {activeView === 'analytics' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
          )}
        </button>

        {/* Right Item 5: Camera Scanner */}
        <button
          onClick={onOpenCameraModal}
          className="group relative flex flex-col items-center justify-center p-2 text-stone-300 hover:text-amber-300 hover:bg-white/10 rounded-2xl transition-all duration-200 min-h-[48px] min-w-[48px] touch-manipulation hover:scale-105 active:scale-95"
          title="Scan Problem with Camera"
        >
          <Camera className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-105" />
          <span className="text-[10px] font-medium mt-0.5 hidden xs:inline tracking-tight">Camera</span>
        </button>

      </div>
    </div>
  );
};
