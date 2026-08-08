import { Subject, MistakeEntry } from '../types';

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    color: '#3b82f6', // blue-500
    bgGradient: 'from-blue-500 to-indigo-600',
    iconName: 'Calculator',
  },
  {
    id: 'physics',
    name: 'Physics',
    color: '#8b5cf6', // purple-500
    bgGradient: 'from-purple-500 to-violet-600',
    iconName: 'Atom',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: '#0d9488', // teal-600
    bgGradient: 'from-teal-500 to-emerald-600',
    iconName: 'FlaskConical',
  },
  {
    id: 'biology',
    name: 'Biology',
    color: '#16a34a', // green-600
    bgGradient: 'from-emerald-500 to-green-600',
    iconName: 'Dna',
  },
  {
    id: 'cs',
    name: 'Computer Science',
    color: '#0284c7', // sky-600
    bgGradient: 'from-cyan-500 to-blue-600',
    iconName: 'Code2',
  },
  {
    id: 'history',
    name: 'History & Social',
    color: '#ea580c', // orange-600
    bgGradient: 'from-amber-500 to-orange-600',
    iconName: 'BookOpen',
  },
];

export const INITIAL_MISTAKES: MistakeEntry[] = [];
