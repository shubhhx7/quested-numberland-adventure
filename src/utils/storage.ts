import type { SavedData, Progress, Profile, Topic } from '../types';

const STORAGE_KEY = 'quested_progress_v1';

const VALID_TOPICS: Topic[] = ['Counting', 'Numbers', 'Addition', 'Shapes', 'Patterns', 'Animals', 'Mixed'];

const VALID_MISSION_IDS = [
  'rainbow-bridge', 'splash-tank', 'fruit-market', 'shape-gate',
  'mystery-cave', 'star-tower', 'animal-arena', 'happy-castle',
];

// Mapping from old mission IDs to new IDs
const MISSION_ID_MIGRATION: Record<string, string> = {
  'broken-bridge':    'rainbow-bridge',
  'water-tank-rescue': 'splash-tank',
  'market-maths':     'fruit-market',
  'geometry-gate':    'shape-gate',
  'algebra-cave':     'mystery-cave',
  'percentage-tower': 'star-tower',
  'time-trial-arena': 'animal-arena',
  'boss-castle':      'happy-castle',
};

const defaultTopicStats = (): Record<Topic, { attempted: number; correct: number }> => ({
  Counting:  { attempted: 0, correct: 0 },
  Numbers:   { attempted: 0, correct: 0 },
  Addition:  { attempted: 0, correct: 0 },
  Shapes:    { attempted: 0, correct: 0 },
  Patterns:  { attempted: 0, correct: 0 },
  Animals:   { attempted: 0, correct: 0 },
  Mixed:     { attempted: 0, correct: 0 },
});

export const defaultProgress = (): Progress => ({
  xp: 0,
  coins: 0,
  level: 1,
  streak: 1,
  completedMissionIds: [],
  unlockedMissionIds: ['rainbow-bridge'],
  badges: [],
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  topicStats: defaultTopicStats(),
  missionAttempts: {},
  lastPlayedAt: new Date().toISOString(),
});

function migrateMissionIds(ids: string[]): string[] {
  return ids
    .map((id) => MISSION_ID_MIGRATION[id] ?? id)
    .filter((id) => VALID_MISSION_IDS.includes(id));
}

function migrateProgress(raw: Progress): Progress {
  // Migrate old mission IDs to new IDs
  raw.completedMissionIds = migrateMissionIds(raw.completedMissionIds ?? []);
  raw.unlockedMissionIds = migrateMissionIds(raw.unlockedMissionIds ?? []);

  // Ensure at least first mission is unlocked
  if (raw.unlockedMissionIds.length === 0) {
    raw.unlockedMissionIds = ['rainbow-bridge'];
  }

  // Migrate missionAttempts keys
  const newAttempts: Progress['missionAttempts'] = {};
  for (const [oldId, attempt] of Object.entries(raw.missionAttempts ?? {})) {
    const newId = MISSION_ID_MIGRATION[oldId] ?? oldId;
    if (VALID_MISSION_IDS.includes(newId)) {
      newAttempts[newId] = attempt;
    }
  }
  raw.missionAttempts = newAttempts;

  // Migrate topicStats — reset if stale keys present
  const existingKeys = Object.keys(raw.topicStats ?? {});
  const isStale = existingKeys.some((k) => !VALID_TOPICS.includes(k as Topic));
  if (isStale || !raw.topicStats) {
    raw.topicStats = defaultTopicStats();
  }
  VALID_TOPICS.forEach((t) => {
    if (!raw.topicStats[t]) raw.topicStats[t] = { attempted: 0, correct: 0 };
  });

  return raw;
}

export function loadData(): SavedData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedData;
    if (!parsed.profile || !parsed.progress) return null;
    parsed.progress = migrateProgress(parsed.progress);
    return parsed;
  } catch {
    return null;
  }
}

export function saveData(data: SavedData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save to localStorage');
  }
}

export function saveProfile(profile: Profile): SavedData {
  const existing = loadData();
  const data: SavedData = {
    profile,
    progress: existing?.progress ?? defaultProgress(),
  };
  saveData(data);
  return data;
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasExistingProgress(): boolean {
  const data = loadData();
  return !!(data?.profile?.onboardingCompleted);
}
