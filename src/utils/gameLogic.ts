import type { Progress, Topic } from '../types';

export function calculateLevel(xp: number): number {
  if (xp < 200) return 1;
  if (xp < 500) return 2;
  if (xp < 900) return 3;
  if (xp < 1400) return 4;
  return 5;
}

export function xpToNextLevel(xp: number): { current: number; needed: number; percent: number } {
  const thresholds = [200, 500, 900, 1400];
  const prevThresholds = [0, 200, 500, 900];
  const level = calculateLevel(xp);
  if (level >= 5) return { current: xp, needed: 1400, percent: 100 };
  const needed = thresholds[level - 1];
  const prev = prevThresholds[level - 1];
  const percent = Math.round(((xp - prev) / (needed - prev)) * 100);
  return { current: xp - prev, needed: needed - prev, percent };
}

export function getMissionStatus(
  missionId: string,
  unlockedMissionIds: string[],
  completedMissionIds: string[]
): 'locked' | 'unlocked' | 'completed' {
  if (completedMissionIds.includes(missionId)) return 'completed';
  if (unlockedMissionIds.includes(missionId)) return 'unlocked';
  return 'locked';
}

export function getTopicAccuracy(topicStats: Progress['topicStats'], topic: Topic): number {
  const stat = topicStats[topic];
  if (!stat || stat.attempted === 0) return 0;
  return Math.round((stat.correct / stat.attempted) * 100);
}

export function getStrongTopics(topicStats: Progress['topicStats']): Topic[] {
  return (Object.keys(topicStats) as Topic[]).filter(
    (t) => topicStats[t].attempted > 0 && getTopicAccuracy(topicStats, t) >= 75
  );
}

export function getWeakTopics(topicStats: Progress['topicStats']): Topic[] {
  return (Object.keys(topicStats) as Topic[]).filter(
    (t) => topicStats[t].attempted > 0 && getTopicAccuracy(topicStats, t) < 60
  );
}

export function getOverallAccuracy(progress: Progress): number {
  if (progress.totalQuestionsAnswered === 0) return 0;
  return Math.round((progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100);
}

export function getLearningStatus(completedCount: number): string {
  if (completedCount === 0) return 'Just Starting! 🌱';
  if (completedCount <= 3) return 'On a Roll! 🌟';
  if (completedCount <= 6) return 'Super Learner! 🚀';
  return 'Wonder Island Champion! 🏆';
}

// Kid-friendly correct messages
export function getCorrectMessages(): string[] {
  return [
    'Yay! You got it! 🌟',
    'Amazing! You\'re so smart!',
    'Woohoo! That\'s right!',
    'Great job, hero! 🎉',
    'You did it! Q-Buddy is so proud!',
    'Brilliant! ⭐ Keep going!',
    'That\'s correct! You\'re amazing!',
  ];
}

// Kid-friendly wrong messages
export function getWrongMessages(): string[] {
  return [
    'Good try! Let\'s learn it together.',
    'Almost! We\'ll get it next time!',
    'Oops! That\'s okay, let\'s see why.',
    'Nice try! Learning is fun!',
    'Keep going! You\'re doing great!',
    'Don\'t worry! Trying is how we learn!',
  ];
}

export function randomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export const XP_PER_CORRECT = 20;
export const COINS_PER_CORRECT = 5;
export const MISSION_BONUS_XP = 50;
export const MISSION_BONUS_COINS = 20;
