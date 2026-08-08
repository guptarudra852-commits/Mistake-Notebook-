import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { MistakeEntry, Subject } from '../types';
import { Award, BookOpen, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface AnalyticsPanelProps {
  mistakes: MistakeEntry[];
  subjects: Subject[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ mistakes, subjects }) => {
  // 1. Root cause category distribution
  const categoryCounts: Record<string, number> = {
    'Conceptual Gap': 0,
    'Careless / Calculation': 0,
    'Misread Question': 0,
    'Formula Recall': 0,
    'Time Pressure': 0,
    'Notation / Formatting': 0,
    Other: 0,
  };

  mistakes.forEach((m) => {
    switch (m.mistakeType) {
      case 'conceptual':
        categoryCounts['Conceptual Gap'] += 1;
        break;
      case 'calculation':
        categoryCounts['Careless / Calculation'] += 1;
        break;
      case 'misread':
        categoryCounts['Misread Question'] += 1;
        break;
      case 'formula':
        categoryCounts['Formula Recall'] += 1;
        break;
      case 'time':
        categoryCounts['Time Pressure'] += 1;
        break;
      case 'formatting':
        categoryCounts['Notation / Formatting'] += 1;
        break;
      default:
        categoryCounts['Other'] += 1;
        break;
    }
  });

  const categoryData = Object.keys(categoryCounts)
    .filter((k) => categoryCounts[k] > 0)
    .map((k) => ({
      name: k,
      count: categoryCounts[k],
    }));

  const CATEGORY_COLORS = ['#f43f5e', '#f59e0b', '#ea580c', '#8b5cf6', '#0284c7', '#64748b', '#a8a29e'];

  // 2. Subject wise distribution
  const subjectData = subjects.map((sub) => {
    const totalSub = mistakes.filter((m) => m.subjectId === sub.id).length;
    const masteredSub = mistakes.filter(
      (m) => m.subjectId === sub.id && m.revisionStatus === 'mastered'
    ).length;
    return {
      name: sub.name,
      total: totalSub,
      mastered: masteredSub,
      pending: totalSub - masteredSub,
      color: sub.color,
    };
  }).filter((d) => d.total > 0);

  // Overall Stats
  const totalCount = mistakes.length;
  const masteredCount = mistakes.filter((m) => m.revisionStatus === 'mastered').length;
  const masteredPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  // Find top mistake category
  const topCategoryEntry = categoryData.sort((a, b) => b.count - a.count)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Title */}
      <div className="flex items-center space-x-3 bg-amber-100/90 p-4 rounded-2xl border-2 border-amber-300 shadow-sm">
        <TrendingUp className="w-7 h-7 text-amber-800" />
        <div>
          <h2 className="text-xl font-serif font-extrabold text-amber-950">
            Academic Error Pattern & Revision Analytics
          </h2>
          <p className="text-xs text-amber-900/80">
            Discover recurring mistake root causes and track subject mastery over time.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-200 text-amber-900 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-amber-950">{totalCount}</span>
            <span className="block text-xs font-semibold text-stone-600">Total Mistakes Logged</span>
          </div>
        </div>

        <div className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-300 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-200 text-emerald-900 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-emerald-950">{masteredCount} ({masteredPercent}%)</span>
            <span className="block text-xs font-semibold text-emerald-800">Mastered Entries</span>
          </div>
        </div>

        <div className="bg-rose-50 p-5 rounded-2xl border-2 border-rose-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-200 text-rose-900 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-bold text-rose-950 block truncate">
              {topCategoryEntry ? topCategoryEntry.name : 'None'}
            </span>
            <span className="block text-xs font-semibold text-rose-800">#1 Root Cause Error</span>
          </div>
        </div>

        <div className="bg-indigo-50 p-5 rounded-2xl border-2 border-indigo-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-200 text-indigo-900 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-indigo-950">
              {mistakes.filter((m) => m.flaggedForSunday).length}
            </span>
            <span className="block text-xs font-semibold text-indigo-800">In Sunday Queue</span>
          </div>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Breakdown Pie Chart */}
        <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-200 shadow-md">
          <h3 className="text-base font-serif font-bold text-amber-950 mb-4">
            Mistake Root Cause Breakdown
          </h3>
          <div className="h-64 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-xs text-stone-500 pt-20">No mistake data available.</p>
            )}
          </div>
        </div>

        {/* Subject-Wise Mistakes Bar Chart */}
        <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-200 shadow-md">
          <h3 className="text-base font-serif font-bold text-amber-950 mb-4">
            Mistakes & Mastery By Subject
          </h3>
          <div className="h-64 w-full">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <XAxis dataKey="name" stroke="#78350f" fontSize={11} />
                  <YAxis stroke="#78350f" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="pending" name="Pending Review" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="mastered" name="Mastered" fill="#10b981" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-xs text-stone-500 pt-20">No subject data available.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
