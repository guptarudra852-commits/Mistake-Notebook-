import React, { useState } from 'react';
import { X, Folder, Calculator, Atom, FlaskConical, Dna, Code2, BookOpen, Star, Plus, Trash2 } from 'lucide-react';
import { Subject } from '../types';

interface CustomSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects?: Subject[];
  onSaveSubject: (subject: Subject) => void;
  onDeleteSubject?: (subjectId: string) => void;
}

export const CustomSubjectModal: React.FC<CustomSubjectModalProps> = ({
  isOpen,
  onClose,
  subjects = [],
  onSaveSubject,
  onDeleteSubject,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ec4899'); // pink-500
  const [iconName, setIconName] = useState('Folder');

  if (!isOpen) return null;

  const COLOR_OPTIONS = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#0d9488', // teal
    '#16a34a', // green
    '#0284c7', // sky
    '#ea580c', // orange
    '#ec4899', // pink
    '#eab308', // yellow
    '#64748b', // slate
  ];

  const ICON_OPTIONS = [
    { name: 'Calculator', label: 'Math' },
    { name: 'Atom', label: 'Physics' },
    { name: 'FlaskConical', label: 'Chem' },
    { name: 'Dna', label: 'Biology' },
    { name: 'Code2', label: 'CS' },
    { name: 'BookOpen', label: 'Literature' },
    { name: 'Folder', label: 'General' },
    { name: 'Star', label: 'Special' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSub: Subject = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      color,
      bgGradient: 'from-amber-500 to-amber-700',
      iconName,
      isCustom: true,
    };

    onSaveSubject(newSub);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-amber-50 rounded-2xl shadow-2xl border-4 border-amber-900 w-full max-w-md overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="bg-amber-900 text-amber-100 px-6 py-4 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base">Add Custom Subject Category</h3>
          <button onClick={onClose} className="text-amber-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Economics, Organic Chemistry, Statistics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              id="custom-subject-name-input"
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
              Theme Color
            </label>
            <div className="flex items-center space-x-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-125 border-slate-900 shadow-md' : 'border-white'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
              Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ICON_OPTIONS.map((ico) => (
                <button
                  key={ico.name}
                  type="button"
                  onClick={() => setIconName(ico.name)}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                    iconName === ico.name
                      ? 'bg-amber-400 text-amber-950 border-amber-600 shadow'
                      : 'bg-white text-stone-700 border-amber-200'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  <span>{ico.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 text-stone-800 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-custom-subject-btn"
              className="px-5 py-2 bg-amber-500 text-amber-950 rounded-xl text-xs font-extrabold shadow hover:bg-amber-400"
            >
              Save Subject
            </button>
          </div>

        </form>

        {/* Manage Existing Subjects List */}
        {subjects.length > 0 && (
          <div className="bg-amber-100/80 border-t border-amber-300 p-4 space-y-2">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Existing Subjects ({subjects.length})
            </h4>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs text-stone-800"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="font-semibold">{s.name}</span>
                  </div>
                  {onDeleteSubject && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${s.name}" subject category?`)) {
                          onDeleteSubject(s.id);
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title={`Delete ${s.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
