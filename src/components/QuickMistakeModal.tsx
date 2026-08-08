import React, { useState } from 'react';
import { Subject, MistakeType } from '../types';
import { Zap, X, Check, ArrowRight, BookOpen } from 'lucide-react';

interface QuickMistakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  currentSubjectId: string;
  onSaveQuickEntry: (data: { title: string; subjectId: string; mistakeType: MistakeType }) => void;
  onOpenFullEditor: () => void;
}

export const QuickMistakeModal: React.FC<QuickMistakeModalProps> = ({
  isOpen,
  onClose,
  subjects,
  currentSubjectId,
  onSaveQuickEntry,
  onOpenFullEditor,
}) => {
  if (!isOpen) return null;

  const initialSubject = currentSubjectId === 'all' ? (subjects[0]?.id || 'math') : currentSubjectId;
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(initialSubject);
  const [mistakeType, setMistakeType] = useState<MistakeType>('conceptual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSaveQuickEntry({
      title: title.trim(),
      subjectId,
      mistakeType,
    });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-700/60 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-300 rounded-2xl flex items-center justify-center border border-amber-500/40">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-100">
                Quick Mistake Entry
              </h3>
              <p className="text-xs text-amber-200/70">
                Instant one-line logging on the fly
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

        {/* Mini Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1.5">
              Mistake Summary / Note *
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Forgot minus sign when multiplying derivative..."
              className="w-full bg-stone-950 border border-amber-900/80 rounded-xl px-4 py-3 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-amber-200/80 mb-1">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-amber-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-200/80 mb-1">
                Error Type
              </label>
              <select
                value={mistakeType}
                onChange={(e) => setMistakeType(e.target.value as MistakeType)}
                className="w-full bg-stone-950 border border-stone-800 text-amber-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="conceptual">Conceptual Gap</option>
                <option value="calculation">Calculation Error</option>
                <option value="misread">Misread Question</option>
                <option value="formula">Formula Recall</option>
                <option value="time">Time Pressure</option>
                <option value="formatting">Notation/Formatting</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullEditor();
              }}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 underline"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Detailed Editor</span>
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-amber-950 font-bold rounded-xl text-xs shadow-md flex items-center space-x-1.5 transition-transform active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Log Entry Now</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
