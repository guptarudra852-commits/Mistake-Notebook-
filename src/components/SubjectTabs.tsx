import React from 'react';
import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Code2,
  BookOpen,
  Plus,
  Folder,
  Layers,
  Sparkles,
  X,
  Trash2,
} from 'lucide-react';
import { Subject, MistakeEntry } from '../types';

interface SubjectTabsProps {
  subjects: Subject[];
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  mistakes: MistakeEntry[];
  onOpenAddCustomSubject: () => void;
  onDeleteSubject?: (subjectId: string) => void;
}

export const SubjectTabs: React.FC<SubjectTabsProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  mistakes,
  onOpenAddCustomSubject,
  onDeleteSubject,
}) => {
  // Helper to render icon component based on name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-4 h-4" />;
      case 'Atom':
        return <Atom className="w-4 h-4" />;
      case 'FlaskConical':
        return <FlaskConical className="w-4 h-4" />;
      case 'Dna':
        return <Dna className="w-4 h-4" />;
      case 'Code2':
        return <Code2 className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  const getSubjectMistakeCount = (subId: string) => {
    if (subId === 'all') return mistakes.length;
    return mistakes.filter((m) => m.subjectId === subId).length;
  };

  return (
    <div className="w-full bg-amber-950/20 backdrop-blur border-b border-amber-900/40 px-4 py-2 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 min-w-max">
        
        {/* All Subjects Tab */}
        <button
          onClick={() => onSelectSubject('all')}
          id="subject-tab-all"
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg font-serif text-xs sm:text-sm font-semibold transition-all transform border-t-2 border-x ${
            selectedSubjectId === 'all'
              ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-md -translate-y-0.5'
              : 'bg-amber-900/40 text-amber-200 border-amber-800/60 hover:bg-amber-800/50 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-600" />
          <span>All Subjects</span>
          <span className="bg-amber-950/20 text-amber-900 font-sans text-[11px] px-2 py-0.2 rounded-full font-bold ml-1">
            {getSubjectMistakeCount('all')}
          </span>
        </button>

        {/* Dynamic Subject Tabs */}
        {subjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          const count = getSubjectMistakeCount(sub.id);

          return (
            <div key={sub.id} className="relative group flex items-center">
              <button
                onClick={() => onSelectSubject(sub.id)}
                id={`subject-tab-${sub.id}`}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg font-serif text-xs sm:text-sm font-semibold transition-all transform border-t-2 border-x ${
                  isSelected
                    ? 'bg-amber-50 text-slate-900 shadow-md -translate-y-0.5 font-bold'
                    : 'bg-amber-900/30 text-amber-200 border-amber-800/40 hover:bg-amber-800/40 hover:text-white'
                }`}
                style={{
                  borderTopColor: sub.color,
                  ...(isSelected ? { backgroundColor: '#fef3c7' } : {}),
                }}
              >
                <span style={{ color: sub.color }}>{renderIcon(sub.iconName)}</span>
                <span>{sub.name}</span>
                <span
                  className={`font-sans text-[11px] px-2 py-0.2 rounded-full font-bold ml-1 ${
                    isSelected ? 'bg-amber-900/20 text-amber-950' : 'bg-amber-950/40 text-amber-300'
                  }`}
                >
                  {count}
                </span>

                {onDeleteSubject && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete the "${sub.name}" subject category?`)) {
                        onDeleteSubject(sub.id);
                      }
                    }}
                    className="ml-1 p-0.5 text-stone-500 hover:text-rose-600 hover:bg-rose-200/50 rounded transition-colors inline-flex items-center"
                    title={`Delete ${sub.name} subject`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            </div>
          );
        })}

        {/* Add Custom Subject Button */}
        <button
          onClick={onOpenAddCustomSubject}
          id="add-custom-subject-btn"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-t-lg bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 hover:text-white text-xs font-medium border border-dashed border-amber-700/80 transition-colors"
          title="Add Custom Subject Category"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>

      </div>
    </div>
  );
};
