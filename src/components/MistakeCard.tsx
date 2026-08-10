import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarCheck2,
  CheckCircle2,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Award,
  Bookmark,
  AlertTriangle,
  Lightbulb,
  Clock,
  Tag,
  CheckSquare,
  Square,
  HelpCircle,
  Sparkles,
  Maximize2,
  ZoomIn,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { MistakeEntry, Subject, MistakeType } from '../types';

interface MistakeCardProps {
  entry: MistakeEntry;
  subject?: Subject;
  onEdit: (entry: MistakeEntry) => void;
  onDelete: (id: string) => void;
  onToggleSundayFlag: (id: string) => void;
  onToggleMastered: (id: string) => void;
  paperGridStyle?: 'lines' | 'grid' | 'dots' | 'blank';
  handwrittenFont?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const MistakeCard: React.FC<MistakeCardProps> = ({
  entry,
  subject,
  onEdit,
  onDelete,
  onToggleSundayFlag,
  onToggleMastered,
  paperGridStyle = 'lines',
  handwrittenFont = false,
  isSelected = false,
  onToggleSelect,
}) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  const handleMasteredClick = (id: string) => {
    if (entry.revisionStatus !== 'mastered') {
      setIsSuccessAnimating(true);
      try {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([30, 50, 40]);
        }
      } catch {}
      setTimeout(() => setIsSuccessAnimating(false), 1200);
    }
    onToggleMastered(id);
  };

  // Mistake Type Badge styling
  const getMistakeTypeBadge = (type: MistakeType) => {
    switch (type) {
      case 'conceptual':
        return { label: 'Conceptual Gap', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'calculation':
        return { label: 'Careless / Calculation', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'misread':
        return { label: 'Misread Question', bg: 'bg-orange-100 text-orange-800 border-orange-300' };
      case 'formula':
        return { label: 'Formula Recall', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'time':
        return { label: 'Time Pressure', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'formatting':
        return { label: 'Notation / Formatting', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
      default:
        return { label: 'General Error', bg: 'bg-stone-100 text-stone-800 border-stone-300' };
    }
  };

  const mistakeBadge = getMistakeTypeBadge(entry.mistakeType);
  const subjectColor = subject?.color || '#d97706';

  // Paper background style simulation
  const getPaperBackgroundClass = () => {
    switch (paperGridStyle) {
      case 'grid':
        return 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-amber-50/90';
      case 'dots':
        return 'bg-[radial-gradient(#d1d5db_1.5px,transparent_1.5px)] [background-size:20px_20px] bg-amber-50/90';
      case 'blank':
        return 'bg-amber-50/90';
      case 'lines':
      default:
        return 'bg-[linear-gradient(to_bottom,transparent_27px,#e5e7eb_28px)] [background-size:100%_28px] bg-amber-50/90';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
        layout: { duration: 0.25 }
      }}
      id={`mistake-card-${entry.id}`}
      className={`relative rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border-2 overflow-hidden flex flex-col ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-100/30'
          : entry.revisionStatus === 'mastered'
          ? 'border-emerald-500/80 bg-emerald-50/40 shadow-emerald-500/10'
          : 'border-amber-200/90'
      } ${isSuccessAnimating ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20' : ''}`}
    >
      {/* Left Spiral Notebook Ring Styling */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-amber-100/80 border-r border-amber-200 flex flex-col justify-around py-4 z-10 select-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <div className="w-4 h-2.5 bg-slate-700/80 rounded-full shadow-inner border border-slate-900" />
          </div>
        ))}
      </div>

      {/* Red Margin Line */}
      <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-rose-300/70 z-10 select-none" />

      {/* Main Notebook Page Content */}
      <div className={`pl-14 pr-5 py-5 flex-1 ${getPaperBackgroundClass()}`}>
        
        {/* Header Strip: Subject & Topic, Severity, Selection & Sunday Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-amber-200 pb-2.5">
          
          <div className="flex items-center space-x-2">
            {/* Selection Checkbox */}
            {onToggleSelect && (
              <button
                type="button"
                onClick={() => onToggleSelect(entry.id)}
                id={`select-mistake-${entry.id}`}
                className={`p-1 rounded-lg transition-colors focus:outline-none ${
                  isSelected
                    ? 'text-amber-700 bg-amber-300/80 border border-amber-400'
                    : 'text-stone-400 hover:text-amber-700 hover:bg-amber-200/50'
                }`}
                title={isSelected ? 'Deselect item' : 'Select item for bulk action'}
              >
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 fill-amber-300 text-amber-900" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Subject Tag */}
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-md text-white shadow-sm flex items-center space-x-1"
              style={{ backgroundColor: subjectColor }}
            >
              <span>{subject?.name || 'General'}</span>
            </span>

            {/* Topic Name */}
            <span className="text-xs font-semibold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded border border-amber-300 font-serif">
              {entry.topic}
            </span>

            {/* Error Type Badge */}
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${mistakeBadge.bg}`}>
              {mistakeBadge.label}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Severity Rating */}
            <div className="flex items-center space-x-0.5 text-amber-500" title={`Severity: ${entry.severity}/5`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < entry.severity ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>

            {/* Sunday Revision Queue Checkbox */}
            <button
              onClick={() => onToggleSundayFlag(entry.id)}
              id={`toggle-sunday-${entry.id}`}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                entry.flaggedForSunday
                  ? 'bg-amber-800 text-amber-100 font-bold border border-amber-900 shadow-sm'
                  : 'bg-amber-100/80 text-amber-800 border border-amber-300 hover:bg-amber-200'
              }`}
              title="Toggle Sunday Revision Queue"
            >
              <CalendarCheck2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sunday Queue</span>
            </button>
          </div>
        </div>

        {/* Mistake Title */}
        <h3
          className={`text-lg font-bold text-slate-900 mb-3 tracking-tight ${
            handwrittenFont ? 'font-mono' : 'font-serif'
          }`}
        >
          {entry.title}
        </h3>

        {/* Problem Statement Box */}
        <div className="mb-4 bg-white/80 p-3.5 rounded-xl border border-amber-200/80 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 mb-1.5">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Problem Statement:</span>
          </div>
          <p className="text-sm text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
            {entry.question}
          </p>
        </div>

        {/* Attached Photo Thumbnail Preview */}
        {entry.imageUrl && (
          <div className="mb-4">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 mb-1.5">
              <ImageIcon className="w-4 h-4 text-amber-700" />
              <span>Attached Problem Photo:</span>
            </div>
            <div
              onClick={() => setIsImageModalOpen(true)}
              id={`thumbnail-image-${entry.id}`}
              className="relative w-full rounded-xl overflow-hidden border-2 border-amber-300/90 bg-stone-900 group cursor-pointer shadow-sm hover:shadow-md hover:border-amber-400 transition-all"
            >
              <img
                src={entry.imageUrl}
                alt={entry.title || 'Attached mistake photo'}
                className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end justify-between p-2.5">
                <span className="text-[11px] font-bold text-amber-100 bg-stone-900/80 px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center space-x-1.5 border border-amber-500/40">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tap for Full-Screen View</span>
                </span>
                <span className="p-1.5 bg-amber-400 text-amber-950 rounded-lg font-bold text-xs shadow-md group-hover:scale-110 transition-transform">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* My Wrong Answer / Misconception */}
        <div className="mb-4 bg-rose-50/90 border-l-4 border-rose-500 p-3.5 rounded-r-xl shadow-xs">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-900 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>My Wrong Attempt / Misconception:</span>
          </div>
          <p className="text-sm text-rose-900 font-sans leading-relaxed whitespace-pre-wrap">
            {entry.myWrongAnswer}
          </p>
        </div>

        {/* Flashcard Reveal Answer Area */}
        <div className="mb-4">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            id={`toggle-answer-${entry.id}`}
            className="flex items-center space-x-2 text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300/80 px-3 py-1.5 rounded-lg border border-amber-300 transition-colors shadow-xs mb-2"
          >
            {showAnswer ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-800" />
                <span>Hide Correct Solution</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-amber-800" />
                <span>Reveal Correct Solution & Steps</span>
              </>
            )}
          </button>

          {showAnswer && (
            <div className="bg-emerald-50/90 border-l-4 border-emerald-500 p-3.5 rounded-r-xl shadow-inner transition-all animate-fadeIn">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct Solution & Explanation:</span>
              </div>
              <p className="text-sm text-emerald-950 font-sans leading-relaxed whitespace-pre-wrap">
                {entry.correctAnswer}
              </p>
            </div>
          )}
        </div>

        {/* Golden Takeaway Banner (Golden Rule) */}
        <div className="mb-4 bg-gradient-to-r from-amber-100 to-amber-200/80 border-2 border-amber-300/80 p-3.5 rounded-xl shadow-sm flex items-start space-x-3">
          <div className="p-2 bg-amber-400/80 rounded-lg text-amber-950 shadow-xs mt-0.5">
            <Bookmark className="w-5 h-5 fill-amber-950" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-900 block mb-0.5">
              Golden Takeaway / Rule To Remember
            </span>
            <p className="text-sm font-serif font-bold text-amber-950 leading-relaxed">
              "{entry.goldenTakeaway}"
            </p>
          </div>
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            {entry.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-amber-200/50 text-amber-900 font-mono px-2 py-0.5 rounded border border-amber-300/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer: Date, Mastered status, and Action buttons */}
        <div className="mt-auto pt-3 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2 text-xs text-stone-600">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Added {new Date(entry.dateAdded).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            
            {/* Toggle Mastered Button with Success Animation */}
            <div className="relative">
              <AnimatePresence>
                {isSuccessAnimating && (
                  <>
                    {/* Expanding Success Ring Wave */}
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0.9 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="absolute inset-0 rounded-lg border-2 border-emerald-500 bg-emerald-400/30 pointer-events-none"
                    />
                    {/* Floating Sparkle Tooltip Popup */}
                    <motion.div
                      initial={{ opacity: 0, y: 0, scale: 0.6 }}
                      animate={{ opacity: [0, 1, 1, 0], y: -28, scale: [0.6, 1.1, 1, 0.9] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: "easeOut" }}
                      className="absolute -top-7 right-0 z-30 pointer-events-none flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[11px] rounded-full shadow-lg border border-emerald-300 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Mastered! 🎉</span>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.90 }}
                whileHover={{ scale: 1.05 }}
                animate={isSuccessAnimating ? { scale: [1, 1.18, 0.95, 1.05, 1] } : {}}
                transition={{ duration: 0.4 }}
                onClick={() => handleMasteredClick(entry.id)}
                id={`toggle-mastered-${entry.id}`}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  entry.revisionStatus === 'mastered'
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'bg-stone-200 hover:bg-emerald-100 hover:text-emerald-900 text-stone-800 border border-stone-300'
                }`}
              >
                <motion.div
                  animate={isSuccessAnimating ? { rotate: [0, -25, 25, -10, 0], scale: [1, 1.35, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${entry.revisionStatus === 'mastered' ? 'text-white' : 'text-emerald-600'}`} />
                </motion.div>
                <span>{entry.revisionStatus === 'mastered' ? 'Mastered!' : 'Mark Mastered'}</span>
              </motion.button>
            </div>

            {/* Edit */}
            <button
              onClick={() => onEdit(entry)}
              id={`edit-mistake-${entry.id}`}
              className="p-1.5 text-amber-800 hover:text-amber-950 hover:bg-amber-200 rounded-lg transition-colors"
              title="Edit Mistake Entry"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this mistake entry?')) {
                  onDelete(entry.id);
                }
              }}
              id={`delete-mistake-${entry.id}`}
              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-colors"
              title="Delete Entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>

      {/* Full-Screen Image Inspection Modal */}
      <AnimatePresence>
        {isImageModalOpen && entry.imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            onClick={() => setIsImageModalOpen(false)}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between w-full max-w-5xl mx-auto z-10 bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 text-stone-100 shadow-2xl backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <ImageIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <h4 className="text-sm sm:text-base font-bold text-amber-100 truncate">
                  {entry.title || 'Attached Mistake Photo'}
                </h4>
              </div>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors"
                title="Close Full Screen View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View Area */}
            <div
              className="flex-1 flex items-center justify-center p-2 sm:p-4 my-3 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                src={entry.imageUrl}
                alt={entry.title || 'Full screen mistake photo'}
                className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl border border-stone-800/80 bg-black/50"
              />
            </div>

            {/* Modal Footer Caption */}
            <div
              className="w-full max-w-5xl mx-auto bg-stone-900/90 p-3 rounded-2xl border border-stone-800 text-center text-xs text-amber-200/80 backdrop-blur-md flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-semibold">Subject: {subject?.name || 'General'}</span>
              <span className="text-[11px] text-stone-400 hidden sm:inline">Click anywhere outside to close</span>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-3 py-1 bg-amber-400 text-amber-950 rounded-lg font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
