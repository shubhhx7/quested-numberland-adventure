export type ClassLevel = '6' | '7' | '8'; // repurposed: '6'=Age5, '7'=Age6, '8'=Age7

export type Topic = 'Counting' | 'Numbers' | 'Addition' | 'Shapes' | 'Patterns' | 'Animals' | 'Mixed';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Boss';
export type MissionStatus = 'locked' | 'unlocked' | 'completed';

export type Scene = 'home' | 'onboarding' | 'map' | 'gameplay' | 'reward';

export interface MapPosition {
  x: number; // left % of map container
  y: number; // top % of map container
  w: number; // width %
  h: number; // height %
}

export interface Profile {
  name: string;
  classLevel: ClassLevel;
  avatar: string;
  goal: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface TopicStat {
  attempted: number;
  correct: number;
}

export interface MissionAttempt {
  attempts: number;
  bestAccuracy: number;
  lastAccuracy: number;
  completedAt: string;
  hintsUsed: number;
  timeSpentSeconds: number;
}

export interface Progress {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  completedMissionIds: string[];
  unlockedMissionIds: string[];
  badges: string[];
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  topicStats: Record<Topic, TopicStat>;
  missionAttempts: Record<string, MissionAttempt>;
  lastPlayedAt: string;
}

export interface SavedData {
  profile: Profile;
  progress: Progress;
}

export interface Question {
  id: string;
  topic: Topic;
  classLevel: ClassLevel;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hints: string[];
  difficulty: Difficulty;
  estimatedTimeSeconds: number;
}

export interface Mission {
  id: string;
  title: string;
  topic: Topic;
  difficulty: Difficulty;
  story: string;
  badge: string;
  rewardXP: number;
  rewardCoins: number;
  icon: string;
  questionIds: string[];
  mapPosition: MapPosition;
}

export interface RewardData {
  missionId: string;
  missionTitle: string;
  xpEarned: number;
  coinsEarned: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  badgeUnlocked: string;
  nextMissionId: string | null;
  isFirstCompletion: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
