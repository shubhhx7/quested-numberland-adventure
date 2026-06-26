import type { Mission } from '../types';

export const missions: Mission[] = [
  {
    id: 'rainbow-bridge',
    title: 'Counting Canyon',
    topic: 'Counting',
    difficulty: 'Easy',
    story: 'Count the shiny stones to help Q-Buddy cross the canyon! Every stone counts! 🌈',
    badge: 'Bridge Helper',
    rewardXP: 100,
    rewardCoins: 30,
    icon: '🌈',
    questionIds: ['rb1', 'rb2', 'rb3', 'rb4', 'rb5'],
    mapPosition: { x: 5, y: 62, w: 25, h: 32 },
  },
  {
    id: 'splash-tank',
    title: 'Number Nook',
    topic: 'Numbers',
    difficulty: 'Easy',
    story: 'Which number is bigger? Smaller? Help fill the tank with just the right amount! 💧',
    badge: 'Splash Star',
    rewardXP: 120,
    rewardCoins: 35,
    icon: '💧',
    questionIds: ['st1', 'st2', 'st3', 'st4', 'st5'],
    mapPosition: { x: 13, y: 42, w: 18, h: 22 },
  },
  {
    id: 'fruit-market',
    title: 'Addition Arena',
    topic: 'Addition',
    difficulty: 'Easy',
    story: 'The fruit market is open! Add up apples, bananas, and coins to win! 🍎',
    badge: 'Fruit Counter',
    rewardXP: 140,
    rewardCoins: 40,
    icon: '🍎',
    questionIds: ['fm1', 'fm2', 'fm3', 'fm4', 'fm5'],
    mapPosition: { x: 33, y: 27, w: 17, h: 20 },
  },
  {
    id: 'shape-gate',
    title: 'Geometry Garden',
    topic: 'Shapes',
    difficulty: 'Easy',
    story: 'The magical garden opens only for shape experts! Find the right shapes to enter! 🔷',
    badge: 'Shape Finder',
    rewardXP: 150,
    rewardCoins: 45,
    icon: '🔷',
    questionIds: ['sg1', 'sg2', 'sg3', 'sg4', 'sg5'],
    mapPosition: { x: 48, y: 34, w: 17, h: 20 },
  },
  {
    id: 'mystery-cave',
    title: 'Pattern Park',
    topic: 'Patterns',
    difficulty: 'Easy',
    story: "Q-Buddy found a magical park! Spot the patterns to light the path ahead! ✨",
    badge: 'Pattern Explorer',
    rewardXP: 160,
    rewardCoins: 50,
    icon: '🔮',
    questionIds: ['mc1', 'mc2', 'mc3', 'mc4', 'mc5'],
    mapPosition: { x: 50, y: 68, w: 23, h: 23 },
  },
  {
    id: 'star-tower',
    title: 'Number Tower',
    topic: 'Numbers',
    difficulty: 'Easy',
    story: 'Climb the tower by counting bright stars! Put numbers in order and go higher! 🌟',
    badge: 'Star Climber',
    rewardXP: 180,
    rewardCoins: 55,
    icon: '🌟',
    questionIds: ['stw1', 'stw2', 'stw3', 'stw4', 'stw5'],
    mapPosition: { x: 64, y: 25, w: 16, h: 34 },
  },
  {
    id: 'animal-arena',
    title: 'Animal Arena',
    topic: 'Animals',
    difficulty: 'Easy',
    story: 'Meet friendly animals and answer fun animal questions. They all want to be your friend! 🐾',
    badge: 'Animal Friend',
    rewardXP: 200,
    rewardCoins: 60,
    icon: '🐾',
    questionIds: ['aa1', 'aa2', 'aa3', 'aa4', 'aa5'],
    mapPosition: { x: 78, y: 61, w: 20, h: 31 },
  },
  {
    id: 'happy-castle',
    title: 'Challenge Coliseum',
    topic: 'Mixed',
    difficulty: 'Easy',
    story: "The final challenge! Show Q-Buddy all your skills — counting, shapes, patterns, and more! 🏆",
    badge: 'Castle Champion',
    rewardXP: 250,
    rewardCoins: 80,
    icon: '🏰',
    questionIds: ['hc1', 'hc2', 'hc3', 'hc4', 'hc5'],
    mapPosition: { x: 77, y: 8, w: 22, h: 33 },
  },
];

export const missionOrder = missions.map((m) => m.id);

export function getMissionById(id: string): Mission | undefined {
  return missions.find((m) => m.id === id);
}

export function getNextMissionId(currentId: string): string | null {
  const idx = missionOrder.indexOf(currentId);
  if (idx === -1 || idx === missionOrder.length - 1) return null;
  return missionOrder[idx + 1];
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy':   return '#2ecc71';
    case 'Medium': return '#45b7ff';
    case 'Hard':   return '#ff9f1c';
    case 'Boss':   return '#ff6b4a';
    default:       return '#aaa';
  }
}

export function getDifficultyLabel(difficulty: string): string {
  return difficulty;
}
