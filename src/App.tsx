import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  getSavedMistakes,
  saveMistakes,
  getSavedSubjects,
  saveSubjects,
  getSavedSundayStats,
  saveSundayStats,
  getSavedPreferences,
  savePreferences,
  getSavedChecklist,
  saveChecklist,
} from './utils/storage';
import { MistakeEntry, Subject, MistakeFilter, SundayRevisionStats, UserPreferences, ChecklistItem } from './types';
import { NotebookHeader } from './components/NotebookHeader';
import { SubjectTabs } from './components/SubjectTabs';
import { MistakeCard } from './components/MistakeCard';
import { MistakeEditorModal } from './components/MistakeEditorModal';
import { ChecklistSystem } from './components/ChecklistSystem';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { CustomSubjectModal } from './components/CustomSubjectModal';
import { PreferencesModal } from './components/PreferencesModal';
import { PinLockScreen } from './components/PinLockScreen';
import { CameraScanModal } from './components/CameraScanModal';
import { QuickMistakeModal } from './components/QuickMistakeModal';
import { InstallAppModal } from './components/InstallAppModal';
import { IOSGlassDock } from './components/IOSGlassDock';
import { Zap, Trash2, CheckSquare, Square, Check } from 'lucide-react';

export default function App() {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(getSavedMistakes);
  const [subjects, setSubjects] = useState<Subject[]>(getSavedSubjects);
  const [stats, setStats] = useState<SundayRevisionStats>(getSavedSundayStats);
  const [preferences, setPreferences] = useState<UserPreferences>(getSavedPreferences);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(getSavedChecklist);
  const [selectedMistakeIds, setSelectedMistakeIds] = useState<string[]>([]);

  // Lock Screen State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(!preferences.isPinLocked);

  // Active View State
  const [activeView, setActiveView] = useState<'notebook' | 'checklist' | 'analytics'>('notebook');

  // Filter State
  const [filter, setFilter] = useState<MistakeFilter>({
    subjectId: 'all',
    mistakeType: 'all',
    status: 'all',
    searchQuery: '',
    sundayOnly: false,
  });

  // Modal States
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<MistakeEntry | null>(null);

  const [isCustomSubjectOpen, setIsCustomSubjectOpen] = useState<boolean>(false);

  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Persist mistakes changes
  const handleUpdateMistakes = (newMistakes: MistakeEntry[]) => {
    setMistakes(newMistakes);
    saveMistakes(newMistakes);
  };

  // Persist subjects changes
  const handleUpdateSubjects = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    saveSubjects(newSubjects);
  };

  const handleDeleteSubject = (subjectId: string) => {
    const updatedSubjects = subjects.filter((s) => s.id !== subjectId);
    handleUpdateSubjects(updatedSubjects);
    if (filter.subjectId === subjectId) {
      setFilter((prev) => ({ ...prev, subjectId: 'all' }));
    }
  };

  // Persist checklist changes
  const handleUpdateChecklist = (newItems: ChecklistItem[]) => {
    setChecklistItems(newItems);
    saveChecklist(newItems);
  };

  // Save/Update Mistake Handler
  const handleSaveMistakeEntry = (entryPartial: Partial<MistakeEntry>) => {
    if (entryPartial.id) {
      // Edit existing
      const updated = mistakes.map((m) =>
        m.id === entryPartial.id
          ? {
              ...m,
              ...entryPartial,
              updatedAt: new Date().toISOString(),
            } as MistakeEntry
          : m
      );
      handleUpdateMistakes(updated);
    } else {
      // Create new
      const newEntry: MistakeEntry = {
        id: `mistake_${Date.now()}`,
        title: entryPartial.title || 'Untitled Mistake',
        subjectId: entryPartial.subjectId || 'math',
        topic: entryPartial.topic || 'General',
        dateAdded: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        question: entryPartial.question || '',
        myWrongAnswer: entryPartial.myWrongAnswer || '',
        correctAnswer: entryPartial.correctAnswer || '',
        goldenTakeaway: entryPartial.goldenTakeaway || 'Review key steps carefully.',
        mistakeType: entryPartial.mistakeType || 'conceptual',
        severity: entryPartial.severity || 3,
        revisionStatus: 'needs_review',
        flaggedForSunday: entryPartial.flaggedForSunday ?? preferences.autoFlagNewMistakesForSunday,
        reviewHistory: [],
        tags: entryPartial.tags || [],
      };
      handleUpdateMistakes([newEntry, ...mistakes]);
    }
  };

  // Delete Mistake
  const handleDeleteMistake = (id: string) => {
    const updated = mistakes.filter((m) => m.id !== id);
    handleUpdateMistakes(updated);
    setSelectedMistakeIds((prev) => prev.filter((i) => i !== id));
  };

  // Bulk Selection Handlers
  const handleToggleSelectMistake = (id: string) => {
    setSelectedMistakeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = (filteredList: MistakeEntry[]) => {
    const allFilteredIds = filteredList.map((m) => m.id);
    const isAllSelected = allFilteredIds.every((id) => selectedMistakeIds.includes(id));
    if (isAllSelected) {
      setSelectedMistakeIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedMistakeIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleBulkDelete = () => {
    if (selectedMistakeIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedMistakeIds.length} selected mistake entry(ies)? This action cannot be undone.`
      )
    ) {
      const updated = mistakes.filter((m) => !selectedMistakeIds.includes(m.id));
      handleUpdateMistakes(updated);
      setSelectedMistakeIds([]);
    }
  };

  // Toggle Sunday Flag
  const handleToggleSundayFlag = (id: string) => {
    const updated = mistakes.map((m) =>
      m.id === id ? { ...m, flaggedForSunday: !m.flaggedForSunday } : m
    );
    handleUpdateMistakes(updated);
  };

  // Toggle Mastered Status
  const handleToggleMastered = (
    id: string,
    forcedStatus?: 'needs_review' | 'mastered',
    logReview = false
  ) => {
    const updated = mistakes.map((m) => {
      if (m.id === id) {
        const nextStatus =
          forcedStatus !== undefined
            ? forcedStatus
            : m.revisionStatus === 'mastered'
            ? 'needs_review'
            : 'mastered';

        const history = logReview
          ? [
              ...m.reviewHistory,
              {
                date: new Date().toISOString(),
                masteryScore: nextStatus === 'mastered' ? 5 : 2,
              },
            ]
          : m.reviewHistory;

        return {
          ...m,
          revisionStatus: nextStatus,
          lastReviewedAt: logReview ? new Date().toISOString() : m.lastReviewedAt,
          reviewHistory: history,
        };
      }
      return m;
    });

    handleUpdateMistakes(updated);

    // Update Sunday stats
    if (logReview) {
      const newStats: SundayRevisionStats = {
        ...stats,
        totalReviewed: stats.totalReviewed + 1,
        totalMastered:
          forcedStatus === 'mastered' ? stats.totalMastered + 1 : stats.totalMastered,
      };
      setStats(newStats);
      saveSundayStats(newStats);
    }
  };

  // Add Custom Subject
  const handleAddCustomSubject = (newSub: Subject) => {
    const updated = [...subjects, newSub];
    handleUpdateSubjects(updated);
  };

  // Filtered mistakes list calculation
  const filteredMistakes = mistakes.filter((m) => {
    // Subject filter
    if (filter.subjectId !== 'all' && m.subjectId !== filter.subjectId) {
      return false;
    }
    // Error type filter
    if (filter.mistakeType !== 'all' && m.mistakeType !== filter.mistakeType) {
      return false;
    }
    // Status filter
    if (filter.status !== 'all' && m.revisionStatus !== filter.status) {
      return false;
    }
    // Sunday Queue filter
    if (filter.sundayOnly && !m.flaggedForSunday) {
      return false;
    }
    // Search query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchTopic = m.topic.toLowerCase().includes(q);
      const matchQuestion = m.question.toLowerCase().includes(q);
      const matchTakeaway = m.goldenTakeaway.toLowerCase().includes(q);
      const matchTag = m.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchTopic && !matchQuestion && !matchTakeaway && !matchTag) {
        return false;
      }
    }
    return true;
  });

  const sundayDueCount = mistakes.filter(
    (m) => m.flaggedForSunday && m.revisionStatus !== 'mastered'
  ).length;

  // Render Lock Screen if PIN lock enabled and not unlocked yet
  if (preferences.isPinLocked && !isUnlocked) {
    return (
      <PinLockScreen
        correctPin={preferences.pinLockCode || '1234'}
        preferences={preferences}
        onUpdatePreferences={(newP) => {
          setPreferences(newP);
          savePreferences(newP);
        }}
        onUnlock={() => setIsUnlocked(true)}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-amber-950 pb-28 transition-colors duration-300 ${
        preferences.darkMode ? 'bg-stone-950 text-amber-50 dark' : 'bg-stone-900 text-stone-100'
      }`}
    >
      
      {/* Top Header Navigation */}
      <NotebookHeader
        filter={filter}
        setFilter={setFilter}
        subjects={subjects}
        onOpenAddModal={() => {
          setEditingEntry(null);
          setIsEditorOpen(true);
        }}
        onOpenCameraModal={() => setIsCameraOpen(true)}
        onOpenAnalytics={() => setActiveView('analytics')}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        totalMistakesCount={mistakes.length}
        darkMode={preferences.darkMode || false}
        onToggleDarkMode={() => {
          const newP = { ...preferences, darkMode: !preferences.darkMode };
          setPreferences(newP);
          savePreferences(newP);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Notebook View */}
        {activeView === 'notebook' && (
          <div>
            {/* Subject Bookmark Tabs */}
            <SubjectTabs
              subjects={subjects}
              selectedSubjectId={filter.subjectId}
              onSelectSubject={(id) => setFilter((prev) => ({ ...prev, subjectId: id }))}
              mistakes={mistakes}
              onOpenAddCustomSubject={() => setIsCustomSubjectOpen(true)}
              onDeleteSubject={handleDeleteSubject}
            />

            {/* Notebook Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {filteredMistakes.length === 0 ? (
                <div className="text-center py-12 text-stone-400 font-sans text-xs">
                  {filter.searchQuery || filter.mistakeType !== 'all' || filter.status !== 'all'
                    ? 'No mistakes match your search filters.'
                    : 'Notebook is empty. Use the dock bar below to log a mistake.'}
                </div>
              ) : (
                <>
                  {/* Bulk Selection Bar */}
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-stone-900/80 border border-amber-900/40 p-3 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-3 text-xs">
                      <button
                        onClick={() => handleSelectAllFiltered(filteredMistakes)}
                        id="select-all-filtered-btn"
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 rounded-xl font-medium transition-colors"
                      >
                        {filteredMistakes.length > 0 &&
                        filteredMistakes.every((m) => selectedMistakeIds.includes(m.id)) ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400" />
                        )}
                        <span>
                          {filteredMistakes.every((m) => selectedMistakeIds.includes(m.id))
                            ? 'Deselect All'
                            : `Select All (${filteredMistakes.length})`}
                        </span>
                      </button>

                      {selectedMistakeIds.length > 0 && (
                        <span className="text-amber-300 font-semibold bg-amber-950/80 border border-amber-800 px-2.5 py-1 rounded-lg">
                          {selectedMistakeIds.length} Selected
                        </span>
                      )}
                    </div>

                    {selectedMistakeIds.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedMistakeIds([])}
                          className="px-3 py-1.5 text-xs text-stone-400 hover:text-white transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleBulkDelete}
                          id="bulk-delete-btn"
                          className="flex items-center space-x-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-transform active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Selected ({selectedMistakeIds.length})</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredMistakes.map((entry) => (
                        <MistakeCard
                          key={entry.id}
                          entry={entry}
                          subject={subjects.find((s) => s.id === entry.subjectId)}
                          onEdit={(e) => {
                            setEditingEntry(e);
                            setIsEditorOpen(true);
                          }}
                          onDelete={handleDeleteMistake}
                          onToggleSundayFlag={handleToggleSundayFlag}
                          onToggleMastered={(id) => handleToggleMastered(id)}
                          paperGridStyle={preferences.paperGridStyle}
                          handwrittenFont={preferences.handwrittenFont}
                          isSelected={selectedMistakeIds.includes(entry.id)}
                          onToggleSelect={handleToggleSelectMistake}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Checklist View */}
        {activeView === 'checklist' && (
          <ChecklistSystem
            items={checklistItems}
            onUpdateItems={handleUpdateChecklist}
          />
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <AnalyticsPanel mistakes={mistakes} subjects={subjects} />
        )}

        {/* Floating Action Button for Quick One-Line Mistake Entry */}
        {activeView === 'notebook' && (
          <button
            onClick={() => setIsQuickModalOpen(true)}
            id="quick-mistake-fab"
            className="fixed bottom-24 right-4 sm:right-8 z-30 flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950 font-bold rounded-full shadow-[0_8px_25px_rgba(245,158,11,0.5)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.7)] transition-all hover:scale-105 active:scale-95 border-2 border-stone-900 touch-manipulation"
            title="Quick One-Line Mistake Entry"
          >
            <Zap className="w-5 h-5 fill-amber-950 stroke-[2]" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Quick Log</span>
          </button>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-amber-950 border-t border-amber-900/80 py-4 text-center text-xs text-amber-400/80 font-serif">
        <p>Academic Mistake Notebook & Study Checklist System • Always Learn From Errors 🎓</p>
      </footer>

      {/* Modals */}
      <MistakeEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveMistakeEntry}
        initialEntry={editingEntry}
        subjects={subjects}
      />

      <CustomSubjectModal
        isOpen={isCustomSubjectOpen}
        onClose={() => setIsCustomSubjectOpen(false)}
        subjects={subjects}
        onSaveSubject={handleAddCustomSubject}
        onDeleteSubject={handleDeleteSubject}
      />

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onUpdatePreferences={(newP) => {
          setPreferences(newP);
          savePreferences(newP);
        }}
        onDataReload={() => {
          setMistakes(getSavedMistakes());
          setSubjects(getSavedSubjects());
          setStats(getSavedSundayStats());
          setPreferences(getSavedPreferences());
        }}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Mobile PWA Install Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Camera Scan Photo Modal */}
      <CameraScanModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setIsCameraOpen(false);
          // If we are currently editing an entry, attach to it or start a new mistake with the snapshot
          if (editingEntry) {
            setEditingEntry({ ...editingEntry, imageUrl: dataUrl });
          } else {
            setEditingEntry({
              id: '',
              subjectId: subjects[0]?.id || 's1',
              title: 'Camera Scanned Problem',
              topic: 'Scanned Worksheet',
              question: 'Attached image scan below.',
              whyWrong: '',
              correctAnswer: '',
              goldenTakeaway: '',
              mistakeType: 'calculation',
              severity: 3,
              revisionStatus: 'needs_review',
              reviewCount: 0,
              lastReviewedDate: null,
              createdDate: new Date().toISOString().split('T')[0],
              flaggedForSunday: true,
              tags: ['scanned', 'camera'],
              imageUrl: dataUrl,
            });
          }
          setIsEditorOpen(true);
        }}
      />

      {/* Quick Mistake Entry Modal */}
      <QuickMistakeModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
        subjects={subjects}
        currentSubjectId={filter.subjectId}
        onSaveQuickEntry={(quickData) => {
          handleSaveMistakeEntry({
            title: quickData.title,
            subjectId: quickData.subjectId,
            mistakeType: quickData.mistakeType,
          });
        }}
        onOpenFullEditor={() => {
          setEditingEntry(null);
          setIsEditorOpen(true);
        }}
      />

      {/* Floating iOS Glass Dock Bar */}
      <IOSGlassDock
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAddModal={() => {
          setEditingEntry(null);
          setIsEditorOpen(true);
        }}
        onOpenCameraModal={() => setIsCameraOpen(true)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        totalMistakesCount={mistakes.length}
        checklistPendingCount={checklistItems.filter((i) => !i.completed).length}
      />

    </div>
  );
}
