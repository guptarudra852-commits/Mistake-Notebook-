import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Flame,
  Award,
  BellRing,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Bookmark,
  CheckSquare,
  Square,
  PartyPopper,
} from 'lucide-react';
import { MistakeEntry, Subject, SundayRevisionStats } from '../types';
import { isTodaySunday, getDaysUntilSunday, getFormattedNextSunday } from '../utils/storage';

interface SundayRevisionHubProps {
  mistakes: MistakeEntry[];
  subjects: Subject[];
  stats: SundayRevisionStats;
  onUpdateEntryStatus: (id: string, status: 'needs_review' | 'mastered', logReview?: boolean) => void;
  onToggleSundayFlag: (id: string) => void;
}

export const SundayRevisionHub: React.FC<SundayRevisionHubProps> = ({
  mistakes,
  subjects,
  stats,
  onUpdateEntryStatus,
  onToggleSundayFlag,
}) => {
  const isSunday = isTodaySunday();
  const daysLeft = getDaysUntilSunday();
  const nextSundayFormatted = getFormattedNextSunday();

  // Filter queued mistakes for Sunday
  const sundayQueued = mistakes.filter((m) => m.flaggedForSunday);
  const sundayMastered = sundayQueued.filter((m) => m.revisionStatus === 'mastered');
  const sundayPending = sundayQueued.filter((m) => m.revisionStatus !== 'mastered');

  const progressPercent =
    sundayQueued.length > 0 ? Math.round((sundayMastered.length / sundayQueued.length) * 100) : 0;

  // Active Flashcard test state
  const [activeTestIndex, setActiveTestIndex] = useState<number | null>(null);
  const [revealedSolution, setRevealedSolution] = useState<boolean>(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const filteredQueue =
    selectedSubjectFilter === 'all'
      ? sundayQueued
      : sundayQueued.filter((m) => m.subjectId === selectedSubjectFilter);

  const handleStartFlashcardMode = () => {
    if (sundayPending.length > 0) {
      setActiveTestIndex(0);
      setRevealedSolution(false);
    }
  };

  const handleNextFlashcard = () => {
    if (activeTestIndex !== null && activeTestIndex < filteredQueue.length - 1) {
      setActiveTestIndex(activeTestIndex + 1);
      setRevealedSolution(false);
    } else {
      setActiveTestIndex(null);
    }
  };

  const currentFlashcard =
    activeTestIndex !== null && filteredQueue[activeTestIndex]
      ? filteredQueue[activeTestIndex]
      : null;

  const currentSubject = currentFlashcard
    ? subjects.find((s) => s.id === currentFlashcard.subjectId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Sunday Notification Banner */}
      <div
        className={`rounded-3xl p-6 shadow-xl border-4 transition-all ${
          isSunday
            ? 'bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-emerald-50 border-emerald-400'
            : 'bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 text-amber-50 border-amber-600'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className={`p-4 rounded-2xl shadow-inner ${isSunday ? 'bg-emerald-500 text-emerald-950' : 'bg-amber-500 text-amber-950'}`}>
              <BellRing className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/40 border border-white/20">
                  Weekly Sunday Revision Protocol
                </span>
                <span className="text-xs bg-amber-400/90 text-amber-950 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-950" />
                  <span>{stats.currentStreak} Week Streak!</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-black mt-1">
                {isSunday ? '🗓️ Today is Sunday Revision Day!' : `🗓️ Next Sunday Revision: ${nextSundayFormatted}`}
              </h2>

              <p className="text-sm opacity-90 mt-1 max-w-xl font-sans">
                {isSunday
                  ? 'Time to consolidate your knowledge! Review your flagged mistakes below, test yourself, and check them off.'
                  : `You have ${sundayPending.length} pending academic mistakes queued for Sunday review. Review them now or on Sunday!`}
              </p>
            </div>
          </div>

          {/* Quick Sunday Progress Circle Card */}
          <div className="bg-black/40 border border-white/20 rounded-2xl p-4 flex items-center space-x-4 min-w-[220px]">
            <div className="text-center">
              <span className="text-3xl font-black font-mono text-amber-300">
                {sundayMastered.length}/{sundayQueued.length}
              </span>
              <span className="block text-[11px] opacity-80 uppercase tracking-wider font-semibold">
                Mistakes Mastered
              </span>
            </div>
            
            <div className="flex-1">
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-300 block text-right mt-1">
                {progressPercent}% Done
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Test Mode Modal / Drawer */}
      {currentFlashcard ? (
        <div className="bg-amber-100/90 border-4 border-amber-900 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
          <div className="flex items-center justify-between border-b-2 border-amber-900/40 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <h3 className="text-lg font-serif font-extrabold text-amber-950">
                Active Sunday Revision Flashcard Mode ({activeTestIndex! + 1} of {filteredQueue.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTestIndex(null)}
              className="text-xs bg-stone-300 hover:bg-stone-400 px-3 py-1 rounded-lg font-bold"
            >
              Exit Flashcard Mode
            </button>
          </div>

          {/* Card Details */}
          <div className="bg-white rounded-2xl p-6 border-2 border-amber-300 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: currentSubject?.color || '#d97706' }}
              >
                {currentSubject?.name || 'General'} • {currentFlashcard.topic}
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 font-mono px-2 py-0.5 rounded">
                Mistake Type: {currentFlashcard.mistakeType}
              </span>
            </div>

            <h4 className="text-xl font-serif font-bold text-slate-900">
              {currentFlashcard.title}
            </h4>

            {/* Question */}
            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200">
              <strong className="text-xs font-bold text-amber-950 block mb-1">
                Problem Statement:
              </strong>
              <p className="text-sm text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
                {currentFlashcard.question}
              </p>
            </div>

            {/* My Wrong Answer */}
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
              <strong className="text-xs font-bold text-rose-900 block mb-1">
                What You Previously Got Wrong:
              </strong>
              <p className="text-sm text-rose-950 font-sans leading-relaxed">
                {currentFlashcard.myWrongAnswer}
              </p>
            </div>

            {/* Reveal Answer Control */}
            <div>
              <button
                onClick={() => setRevealedSolution(!revealedSolution)}
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-amber-100 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow transition-all"
              >
                {revealedSolution ? (
                  <>
                    <EyeOff className="w-5 h-5" />
                    <span>Hide Correct Solution</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    <span>Reveal Correct Solution & Golden Rule</span>
                  </>
                )}
              </button>

              {revealedSolution && (
                <div className="mt-4 space-y-3 animate-fadeIn">
                  <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-400">
                    <strong className="text-xs font-bold text-emerald-900 block mb-1">
                      Correct Solution:
                    </strong>
                    <p className="text-sm text-emerald-950 font-sans leading-relaxed whitespace-pre-wrap">
                      {currentFlashcard.correctAnswer}
                    </p>
                  </div>

                  <div className="bg-amber-200 p-4 rounded-xl border-2 border-amber-400">
                    <strong className="text-xs font-bold text-amber-950 block mb-1">
                      Golden Takeaway:
                    </strong>
                    <p className="text-sm font-serif font-bold text-amber-950">
                      "{currentFlashcard.goldenTakeaway}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Flashcard Navigation & Rating */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onUpdateEntryStatus(currentFlashcard.id, 'needs_review', true);
                  handleNextFlashcard();
                }}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 rounded-xl font-bold text-xs"
              >
                Needs More Practice ⏳
              </button>

              <button
                onClick={() => {
                  onUpdateEntryStatus(currentFlashcard.id, 'mastered', true);
                  handleNextFlashcard();
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md flex items-center space-x-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Mastered! ✅</span>
              </button>
            </div>

            <button
              onClick={handleNextFlashcard}
              className="px-4 py-2 bg-amber-900 text-amber-100 rounded-xl font-bold text-xs flex items-center space-x-1 hover:bg-amber-950"
            >
              <span>Next Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Checklist Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-amber-100/80 p-4 rounded-2xl border-2 border-amber-300 shadow-sm">
        <div className="flex items-center space-x-3">
          <CalendarCheck2 className="w-6 h-6 text-amber-800" />
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-950">
              Sunday Revision Checklist
            </h3>
            <p className="text-xs text-amber-900/80">
              Check off mistakes as you review them during your Sunday session.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            id="sunday-subject-filter"
            className="bg-white border border-amber-300 text-amber-950 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Subjects ({sundayQueued.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({sundayQueued.filter((m) => m.subjectId === s.id).length})
              </option>
            ))}
          </select>

          {/* Flashcard Test Launch */}
          {sundayPending.length > 0 && (
            <button
              onClick={handleStartFlashcardMode}
              id="start-flashcards-btn"
              className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-50 rounded-xl font-bold text-xs shadow hover:scale-105 transition-all flex items-center space-x-1"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start Flashcard Test</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Checklist Table / List */}
      {filteredQueue.length === 0 ? (
        <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-12 text-center space-y-3">
          <PartyPopper className="w-12 h-12 text-amber-600 mx-auto" />
          <h4 className="text-lg font-serif font-bold text-amber-950">
            No mistakes queued for Sunday Revision in this view!
          </h4>
          <p className="text-xs text-amber-800 max-w-md mx-auto">
            You can flag any mistake entry for Sunday review by clicking the "Sunday Queue" button on any notebook page.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQueue.map((entry) => {
            const isMastered = entry.revisionStatus === 'mastered';
            const subject = subjects.find((s) => s.id === entry.subjectId);

            return (
              <div
                key={entry.id}
                id={`sunday-item-${entry.id}`}
                className={`bg-amber-50/90 border-2 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isMastered ? 'border-emerald-300 bg-emerald-50/40' : 'border-amber-200'
                }`}
              >
                {/* Left Checkbox & Info */}
                <div className="flex items-start space-x-3.5 flex-1">
                  <button
                    onClick={() =>
                      onUpdateEntryStatus(
                        entry.id,
                        isMastered ? 'needs_review' : 'mastered',
                        true
                      )
                    }
                    id={`sunday-checkbox-${entry.id}`}
                    className="mt-1 text-emerald-600 hover:scale-110 transition-transform"
                    title={isMastered ? 'Mark as Needs Review' : 'Mark as Mastered'}
                  >
                    {isMastered ? (
                      <CheckCircle2 className="w-6 h-6 fill-emerald-600 text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-amber-700 hover:text-emerald-600" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center space-x-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: subject?.color || '#d97706' }}
                      >
                        {subject?.name || 'General'}
                      </span>
                      <span className="text-xs font-semibold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded font-serif">
                        {entry.topic}
                      </span>
                      <span className="text-[11px] font-mono text-stone-600">
                        {entry.mistakeType}
                      </span>
                    </div>

                    <h4
                      className={`text-base font-bold text-slate-900 ${
                        isMastered ? 'line-through opacity-70' : ''
                      }`}
                    >
                      {entry.title}
                    </h4>

                    <p className="text-xs text-amber-950/90 font-serif font-medium bg-amber-100/70 p-2 rounded-lg border border-amber-200">
                      <strong>Takeaway:</strong> "{entry.goldenTakeaway}"
                    </p>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => onToggleSundayFlag(entry.id)}
                    className="p-1.5 text-amber-800 hover:text-rose-700 text-xs font-semibold rounded-lg hover:bg-amber-200/60 transition-colors"
                    title="Remove from Sunday Queue"
                  >
                    Remove Queue
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
