export type MistakeType = 
  | 'conceptual'
  | 'calculation'
  | 'misread'
  | 'formula'
  | 'time'
  | 'formatting'
  | 'other';

export type RevisionStatus = 'needs_review' | 'in_progress' | 'mastered';

export interface ReviewLog {
  date: string; // ISO date string
  masteryScore: number; // 1 to 5
  notes?: string;
}

export interface MistakeEntry {
  id: string;
  title: string;
  subjectId: string;
  customSubjectName?: string;
  topic: string;
  dateAdded: string; // ISO string
  updatedAt: string; // ISO string
  question: string;
  myWrongAnswer: string;
  correctAnswer: string;
  goldenTakeaway: string; // Mnemonic or rule
  mistakeType: MistakeType;
  severity: 1 | 2 | 3 | 4 | 5; // 1 = minor, 5 = critical conceptual gap
  revisionStatus: RevisionStatus;
  flaggedForSunday: boolean;
  lastReviewedAt?: string;
  reviewHistory: ReviewLog[];
  tags: string[];
  imageUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string; // Hex or Tailwind color class
  bgGradient: string;
  iconName: string; // Lucide icon identifier
  isCustom?: boolean;
}

export interface MistakeFilter {
  subjectId: string; // 'all' or specific subjectId
  mistakeType: string; // 'all' or specific MistakeType
  status: string; // 'all' | 'needs_review' | 'mastered'
  searchQuery: string;
  sundayOnly: boolean;
  severityMin?: number;
}

export interface SundayRevisionStats {
  totalReviewed: number;
  totalMastered: number;
  currentStreak: number;
  lastSundayCompleted?: string;
}

export interface PracticeDrillItem {
  id: string;
  problem: string;
  hint: string;
  solution: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  category: 'Revision' | 'Homework' | 'Exam Prep' | 'General';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface UserPreferences {
  handwrittenFont: boolean;
  paperGridStyle: 'lines' | 'grid' | 'dots' | 'blank';
  sundayReminderEnabled: boolean;
  autoFlagNewMistakesForSunday: boolean;
  openRouterApiKey?: string;
  darkMode: boolean;
  pinLockCode?: string;
  isPinLocked?: boolean;
  pushNotificationsEnabled?: boolean;
  gpsLocationTagging?: boolean;
}
