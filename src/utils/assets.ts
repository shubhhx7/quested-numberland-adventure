export const assets = {
  homeScreen: '/assets/home-screen.png',
  numberlandMap: '/assets/bgg2.png',
  character: '/assets/character.png',
  achievementBadge: '/assets/achievement-badge.png',
  questionScreen: '/assets/question-screen.png',
  qnbg: '/assets/qnbg.png',
};

export function withFallback(src: string, fallback: string): string {
  return src || fallback;
}
