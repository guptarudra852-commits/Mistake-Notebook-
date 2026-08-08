import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Star,
  Camera,
} from 'lucide-react';
import { MistakeEntry, Subject, MistakeType } from '../types';

interface MistakeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Partial<MistakeEntry>) => void;
  initialEntry?: MistakeEntry | null;
  subjects: Subject[];
}

export const MistakeEditorModal: React.FC<MistakeEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
  subjects,
}) => {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'math');
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [myWrongAnswer, setMyWrongAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [goldenTakeaway, setGoldenTakeaway] = useState('');
  const [mistakeType, setMistakeType] = useState<MistakeType>('conceptual');
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [flaggedForSunday, setFlaggedForSunday] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title || '');
      setSubjectId(initialEntry.subjectId || subjects[0]?.id || 'math');
      setTopic(initialEntry.topic || '');
      setQuestion(initialEntry.question || '');
      setMyWrongAnswer(initialEntry.myWrongAnswer || '');
      setCorrectAnswer(initialEntry.correctAnswer || '');
      setGoldenTakeaway(initialEntry.goldenTakeaway || '');
      setMistakeType(initialEntry.mistakeType || 'conceptual');
      setSeverity(initialEntry.severity || 3);
      setFlaggedForSunday(initialEntry.flaggedForSunday ?? true);
      setTags(initialEntry.tags || []);
      setImageUrl(initialEntry.imageUrl || '');
    } else {
      setTitle('');
      setSubjectId(subjects[0]?.id || 'math');
      setTopic('');
      setQuestion('');
      setMyWrongAnswer('');
      setCorrectAnswer('');
      setGoldenTakeaway('');
      setMistakeType('conceptual');
      setSeverity(3);
      setFlaggedForSunday(true);
      setTags([]);
      setImageUrl('');
    }
  }, [initialEntry, isOpen, subjects]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !question.trim()) {
      alert('Please fill in at least the Title and Problem Statement.');
      return;
    }

    onSave({
      id: initialEntry?.id,
      title: title.trim(),
      subjectId,
      topic: topic.trim() || 'General',
      question: question.trim(),
      myWrongAnswer: myWrongAnswer.trim(),
      correctAnswer: correctAnswer.trim(),
      goldenTakeaway: goldenTakeaway.trim() || 'Review problem steps carefully before answering.',
      mistakeType,
      severity,
      flaggedForSunday,
      tags,
      imageUrl,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-amber-50 rounded-2xl shadow-2xl border-4 border-amber-900 w-full max-w-2xl my-8 overflow-hidden transform transition-all animate-scaleUp">
        
        {/* Header */}
        <div className="bg-amber-900 text-amber-100 px-6 py-4 flex items-center justify-between border-b-2 border-amber-950">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-serif font-bold text-amber-100">
              {initialEntry ? 'Edit Mistake Entry' : 'Write New Mistake Entry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-amber-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Title & Subject Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                Entry Title / Core Issue *
              </label>
              <input
                type="text"
                placeholder="e.g. Forgot Chain Rule Derivative / Sign Flip in Kinematics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                id="edit-mistake-title"
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                Subject *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                id="edit-mistake-subject"
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic & Mistake Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                Topic / Unit Name
              </label>
              <input
                type="text"
                placeholder="e.g. Calculus, Organic Chem, Newtonian Dynamics"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                id="edit-mistake-topic"
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                Root Cause Category
              </label>
              <select
                value={mistakeType}
                onChange={(e) => setMistakeType(e.target.value as MistakeType)}
                id="edit-mistake-category"
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="conceptual">Conceptual Misunderstanding</option>
                <option value="calculation">Calculation / Careless Error</option>
                <option value="misread">Misread Question / Requirement</option>
                <option value="formula">Formula / Fact Recall</option>
                <option value="time">Time Pressure / Rushed</option>
                <option value="formatting">Formatting / Notation</option>
                <option value="other">Other Error</option>
              </select>
            </div>
          </div>

          {/* Question / Problem Statement */}
          <div>
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Problem / Question Statement *</span>
              </span>
            </label>
            <textarea
              rows={3}
              placeholder="Write the original question or problem description..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              id="edit-mistake-question"
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* My Wrong Answer */}
          <div>
            <label className="block text-xs font-bold text-rose-900 uppercase tracking-wider mb-1 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>What I Wrote Wrong / My Misconception</span>
            </label>
            <textarea
              rows={2}
              placeholder="Detail your exact error or wrong line of working..."
              value={myWrongAnswer}
              onChange={(e) => setMyWrongAnswer(e.target.value)}
              id="edit-mistake-wrong-answer"
              className="w-full px-3 py-2 bg-rose-50/70 border border-rose-300 rounded-xl text-sm text-rose-950 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Correct Solution */}
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Correct Solution & Steps</span>
            </label>
            <textarea
              rows={3}
              placeholder="Write the correct step-by-step solution..."
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              id="edit-mistake-correct-answer"
              className="w-full px-3 py-2 bg-emerald-50/70 border border-emerald-300 rounded-xl text-sm text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Golden Takeaway / Key Rule */}
          <div>
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1 flex items-center space-x-1">
              <Bookmark className="w-3.5 h-3.5 text-amber-700" />
              <span>Golden Takeaway / Rule To Avoid Repeating This</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Always multiply by the derivative of the inner function in Chain Rule!"
              value={goldenTakeaway}
              onChange={(e) => setGoldenTakeaway(e.target.value)}
              id="edit-mistake-golden-takeaway"
              className="w-full px-3 py-2 bg-amber-100/80 border-2 border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Severity & Sunday Queue Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                Difficulty / Severity (1-5)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl as any)}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${
                      severity === lvl
                        ? 'bg-amber-400 text-amber-950 border-amber-600 shadow'
                        : 'bg-white text-stone-600 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 mr-0.5 ${severity >= lvl ? 'fill-amber-500 text-amber-600' : 'text-stone-300'}`} />
                    <span>{lvl}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flaggedForSunday}
                  onChange={(e) => setFlaggedForSunday(e.target.checked)}
                  id="edit-mistake-sunday-flag"
                  className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-amber-950">
                  Flag for Weekly Sunday Revision 🗓️
                </span>
              </label>
            </div>
          </div>

          {/* Image Attachment (Photo / Camera Snapshot) */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1 flex items-center space-x-1">
              <Camera className="w-3.5 h-3.5 text-amber-700" />
              <span>Problem Image / Photo Attachment</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Paste Image URL or snapshot photo data..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
            {imageUrl && (
              <div className="mt-2 max-h-36 overflow-hidden rounded-xl border border-amber-300 bg-stone-900 flex items-center justify-center">
                <img src={imageUrl} alt="Mistake problem snapshot" className="max-h-36 object-contain" />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
              Custom Tags
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add tag (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-amber-800 text-amber-100 text-xs font-bold rounded-lg hover:bg-amber-900"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full flex items-center space-x-1"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-700 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-amber-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-mistake-submit-btn"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-extrabold shadow-md border border-amber-300 transition-transform active:scale-95 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{initialEntry ? 'Update Entry' : 'Save Entry to Notebook'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
