import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { CheckSquare, Square, Plus, Trash2, CheckCircle2, ListFilter, Sparkles, AlertCircle } from 'lucide-react';

interface ChecklistSystemProps {
  items: ChecklistItem[];
  onUpdateItems: (items: ChecklistItem[]) => void;
}

export const ChecklistSystem: React.FC<ChecklistSystemProps> = ({ items, onUpdateItems }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Revision' | 'Homework' | 'Exam Prep' | 'General'>('Revision');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleToggle = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateItems(updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    onUpdateItems(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ChecklistItem = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      completed: false,
      category: newCategory,
      priority: newPriority,
      createdAt: new Date().toISOString(),
    };

    onUpdateItems([newItem, ...items]);
    setNewTitle('');
  };

  const handleClearCompleted = () => {
    const updated = items.filter((item) => !item.completed);
    onUpdateItems(updated);
  };

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  const getPriorityBadge = (p: 'high' | 'medium' | 'low') => {
    switch (p) {
      case 'high':
        return <span className="bg-rose-950/80 text-rose-300 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">High</span>;
      case 'medium':
        return <span className="bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Med</span>;
      case 'low':
        return <span className="bg-stone-800 text-stone-300 border border-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Low</span>;
    }
  };

  const getCategoryBadge = (c: string) => {
    return (
      <span className="bg-amber-900/40 text-amber-200 border border-amber-700/60 text-[10px] px-2 py-0.5 rounded-md font-mono">
        {c}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner & Progress Header */}
      <div className="bg-gradient-to-br from-amber-950/90 via-stone-900 to-stone-950 border border-amber-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-300 rounded-2xl flex items-center justify-center border border-amber-500/40 shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-amber-100 flex items-center space-x-2">
                <span>Academic Study Checklist</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h2>
              <p className="text-xs text-amber-200/80">
                Track daily tasks, formula revisions, and exam preparation items.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-right">
            <div className="bg-amber-900/60 border border-amber-700/70 rounded-2xl px-4 py-2 text-center">
              <span className="text-2xl font-extrabold text-amber-300">{completedCount} / {totalCount}</span>
              <span className="block text-[10px] text-amber-200/70 uppercase tracking-wider font-semibold">Done</span>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-amber-300">
            <span>Overall Task Completion</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-950 h-3 rounded-full overflow-hidden p-0.5 border border-amber-900">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Task Input Form */}
      <form onSubmit={handleAddItem} className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new checklist task or revision item..."
            className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <div className="flex items-center gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="bg-stone-950 border border-stone-700 text-amber-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="Revision">Revision</option>
              <option value="Homework">Homework</option>
              <option value="Exam Prep">Exam Prep</option>
              <option value="General">General</option>
            </select>

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className="bg-stone-950 border border-stone-700 text-amber-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1 shadow active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* Filter Tabs & Bulk Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-900/40 p-2 rounded-xl border border-stone-800">
        <div className="flex items-center space-x-2 text-xs">
          <ListFilter className="w-4 h-4 text-amber-400 ml-2" />
          <span className="text-stone-400 font-medium mr-1">Show:</span>
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-amber-400 text-amber-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {completedCount > 0 && (
          <button
            onClick={handleClearCompleted}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-rose-950/40 border border-transparent hover:border-rose-900/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed ({completedCount})</span>
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="bg-stone-900/40 border border-dashed border-stone-800 rounded-2xl p-8 text-center text-stone-400 text-xs space-y-2">
            <AlertCircle className="w-6 h-6 text-amber-400/60 mx-auto" />
            <p>No checklist tasks found in this view.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                item.completed
                  ? 'bg-stone-950/50 border-stone-800/80 text-stone-500 line-through opacity-75'
                  : 'bg-stone-900/90 border-amber-900/30 hover:border-amber-500/50 text-amber-100 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(item.id);
                  }}
                  className="text-amber-400 hover:text-amber-300 transition-colors focus:outline-none"
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-stone-500 group-hover:text-amber-400" />
                  )}
                </button>

                <span className={`text-xs sm:text-sm font-medium truncate ${item.completed ? 'line-through text-stone-500' : 'text-amber-100'}`}>
                  {item.title}
                </span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {getCategoryBadge(item.category)}
                {getPriorityBadge(item.priority)}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
