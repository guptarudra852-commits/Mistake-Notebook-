import { MistakeEntry, Subject, SundayRevisionStats, UserPreferences, ChecklistItem } from '../types';
import { DEFAULT_SUBJECTS, INITIAL_MISTAKES } from '../data/defaultData';

const MISTAKES_KEY = 'academic_notebook_mistakes_clean_v2';
const SUBJECTS_KEY = 'academic_notebook_subjects_v1';
const SUNDAY_STATS_KEY = 'academic_notebook_sunday_stats_v1';
const PREFERENCES_KEY = 'academic_notebook_prefs_v1';
const CHECKLIST_KEY = 'academic_notebook_checklist_v1';

export const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk_1',
    title: 'Review calculus derivative chain rule mistakes',
    completed: false,
    category: 'Revision',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'chk_2',
    title: 'Verify sign conventions in physics work-energy problems',
    completed: false,
    category: 'Revision',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'chk_3',
    title: 'Practice 3 redox oxidation state calculations in Chemistry',
    completed: true,
    category: 'Homework',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'chk_4',
    title: 'Check binary search loop boundary condition (low <= high)',
    completed: false,
    category: 'Exam Prep',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  handwrittenFont: false,
  paperGridStyle: 'lines',
  sundayReminderEnabled: true,
  autoFlagNewMistakesForSunday: true,
  openRouterApiKey: '',
  darkMode: false,
  pinLockCode: '',
  isPinLocked: false,
  pushNotificationsEnabled: false,
  gpsLocationTagging: false,
};

// Storage getters & setters
export function getSavedMistakes(): MistakeEntry[] {
  try {
    const raw = localStorage.getItem(MISTAKES_KEY);
    if (!raw) {
      saveMistakes(INITIAL_MISTAKES);
      return INITIAL_MISTAKES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load mistakes from localStorage', e);
    return INITIAL_MISTAKES;
  }
}

export function saveMistakes(mistakes: MistakeEntry[]): void {
  try {
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
  } catch (e) {
    console.error('Failed to save mistakes to localStorage', e);
  }
}

export function getSavedSubjects(): Subject[] {
  try {
    const raw = localStorage.getItem(SUBJECTS_KEY);
    if (!raw) {
      saveSubjects(DEFAULT_SUBJECTS);
      return DEFAULT_SUBJECTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SUBJECTS;
  }
}

export function saveSubjects(subjects: Subject[]): void {
  try {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
  } catch (e) {
    console.error('Failed to save subjects', e);
  }
}

export function getSavedSundayStats(): SundayRevisionStats {
  try {
    const raw = localStorage.getItem(SUNDAY_STATS_KEY);
    if (!raw) {
      const initial: SundayRevisionStats = {
        totalReviewed: 0,
        totalMastered: 0,
        currentStreak: 1,
      };
      saveSundayStats(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return { totalReviewed: 0, totalMastered: 0, currentStreak: 1 };
  }
}

export function saveSundayStats(stats: SundayRevisionStats): void {
  try {
    localStorage.setItem(SUNDAY_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save Sunday stats', e);
  }
}

export function getSavedPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences', e);
  }
}

export function getSavedChecklist(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) {
      saveChecklist(DEFAULT_CHECKLIST_ITEMS);
      return DEFAULT_CHECKLIST_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load checklist', e);
    return DEFAULT_CHECKLIST_ITEMS;
  }
}

export function saveChecklist(items: ChecklistItem[]): void {
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save checklist', e);
  }
}

// Sunday Date Helpers
export function isTodaySunday(): boolean {
  return new Date().getDay() === 0;
}

export function getDaysUntilSunday(): number {
  const day = new Date().getDay();
  if (day === 0) return 0; // Today is Sunday!
  return 7 - day;
}

export function getFormattedNextSunday(): string {
  const now = new Date();
  const days = getDaysUntilSunday();
  const nextSunday = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return nextSunday.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function getSundayWeekId(): string {
  const d = new Date();
  // Get Sunday of current week
  const day = d.getDay();
  const diff = d.getDate() - day; // Adjust to Sunday
  const sundayDate = new Date(d.setDate(diff));
  return sundayDate.toISOString().split('T')[0];
}

export function exportBackupData(): string {
  const data = {
    mistakes: getSavedMistakes(),
    subjects: getSavedSubjects(),
    sundayStats: getSavedSundayStats(),
    preferences: getSavedPreferences(),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.mistakes && Array.isArray(parsed.mistakes)) {
      saveMistakes(parsed.mistakes);
    }
    if (parsed.subjects && Array.isArray(parsed.subjects)) {
      saveSubjects(parsed.subjects);
    }
    if (parsed.sundayStats) {
      saveSundayStats(parsed.sundayStats);
    }
    return true;
  } catch (e) {
    console.error('Import error', e);
    return false;
  }
}

export function resetToDefaultData(): void {
  saveMistakes(INITIAL_MISTAKES);
  saveSubjects(DEFAULT_SUBJECTS);
  saveSundayStats({ totalReviewed: 0, totalMastered: 0, currentStreak: 1 });
}
