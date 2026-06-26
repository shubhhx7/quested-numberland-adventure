# QuestED: Numberland Adventure

> Learn. Play. Level Up.

A full-screen, PC-first gamified Maths learning adventure for Class 6–8 students.

---

## Overview

QuestED transforms curriculum Maths into a browser-based educational game. Students become "Knowledge Heroes" who navigate the fantasy kingdom of Numberland by clicking directly on locations on an interactive fantasy map — solving 5 MCQ questions per mission to earn XP, coins, and badges, with AI-style hints from their mascot Q-Buddy.

---

## PC-First Game Experience

The game is designed as a **full-screen PC browser game**, not a mobile app:

- **16:9 game stage** — scales proportionally to fill any desktop browser window
- **No scrolling** — every scene fits in one viewport; overlays replace page navigation
- **Click the map** — mission selection happens by clicking directly on drawn locations on the Numberland map
- **Game HUD** — XP, coins, level, and navigation are overlaid on the map like a real game
- **Dark fantasy aesthetic** — deep purple/blue game UI, not a mobile form-sheet

**Mobile landscape** is fully supported — the game fills the landscape viewport.  
**Mobile portrait** shows a rotate-device overlay prompting landscape mode.

---

## How to Run

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type-check and build for production
npm run build

# Preview production build
npm run preview
```

Requires Node.js 18+.

---

## Asset Setup

Assets live in `public/assets/` and are served as static files:

| File | Used For |
|------|----------|
| `home-screen.png` | Home screen hero background |
| `numberland-map.png` | Full-screen interactive world map |
| `character.png` | Q-Buddy AI tutor mascot throughout the game |
| `achievement-badge.png` | Mission completion badges and reward screen |

All images have graceful fallbacks — no broken icon placeholders.

Paths are centralised in `src/utils/assets.ts`:
```ts
export const assets = {
  homeScreen: '/assets/home-screen.png',
  numberlandMap: '/assets/numberland-map.png',
  character: '/assets/character.png',
  achievementBadge: '/assets/achievement-badge.png',
};
```

---

## Map Hotspot System

The Numberland map (`numberland-map.png`) is the primary navigation hub. Eight transparent hotspot buttons are overlaid on the exact positions of the drawn level areas using percentage coordinates:

```ts
// In src/data/missions.ts — each mission has:
mapPosition: { x: 27, y: 74, w: 12, h: 14 }
// x/y = top-left offset as % of map; w/h = size as %
```

Hotspot visual states:
- **Locked** — dark lock overlay, shows toast on click
- **Unlocked (current)** — pulsing gold glow, opens Mission Intro modal
- **Completed** — green glow + ✓ badge overlay

To adjust hotspot positions (after inspecting the actual map image), edit the `mapPosition` values in `src/data/missions.ts`.

---

## Gameplay Loop

```
Home → Onboarding (first run) → Map
  ↓ click hotspot
Mission Intro Modal
  ↓ Start Mission
Gameplay Scene (5 MCQ questions)
  → Q-Buddy hints (up to 4 per question)
  → Submit → Correct/Wrong feedback + explanation
  ↓ Complete
Reward Scene
  ↓ Continue Adventure
Map (next mission unlocked)
```

**Scoring per question:** +20 XP, +5 coins for correct answer  
**Mission completion bonus:** +50 XP, +20 coins  
**Badge:** unlocked on first completion  
**Levels:** 1 (0 XP) → 2 (200) → 3 (500) → 4 (900) → 5 (1400+)

---

## Scenes & Overlays

| Scene / Overlay | Type | Description |
|----------------|------|-------------|
| Home | Scene | Full-screen hero with map background and CTAs |
| Onboarding | Scene | Class/avatar/goal/name setup with Q-Buddy guide |
| Map | Scene (hub) | Interactive Numberland map with game HUD |
| Mission Intro | Modal | Story, rewards preview, Start button |
| Gameplay | Scene | 2-panel question/answer with hint panel |
| Reward | Scene | Mission completion celebration |
| Dashboard | Overlay | XP, topic mastery, badges, recommendations |
| Progress Report | Overlay | Parent/teacher snapshot with copy summary |
| Profile | Overlay | Student identity + reset journey |

---

## localStorage Persistence

All progress saved under key `quested_progress_v1`:

```json
{
  "profile": { "name", "classLevel", "avatar", "goal", "onboardingCompleted", "createdAt" },
  "progress": {
    "xp", "coins", "level", "streak",
    "completedMissionIds", "unlockedMissionIds", "badges",
    "topicStats": { "Fractions": { "attempted", "correct" }, ... },
    "missionAttempts": { "[missionId]": { "attempts", "bestAccuracy", "hintsUsed", ... } }
  }
}
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + custom CSS animations |
| State | React useState / useCallback |
| Persistence | localStorage |
| Deployment | Vercel / Netlify (static export) |

---

## Future Scope

- **Real AI Tutor** — Claude API for dynamic, personalized hints and explanations
- **Teacher Dashboard** — Class-wide analytics and student roster
- **Adaptive Difficulty** — Adjusts based on student performance data
- **Multiplayer Classroom Quests** — Real-time cooperative missions
- **Voice Questions** — Text-to-speech accessibility layer
- **Hindi/Hinglish Support** — Localization for Indian classrooms
- **Admin Question Builder** — Teacher-facing curriculum editor
- **Curriculum Mapping** — CBSE/NCERT alignment per question
- **Real Backend** — Authentication, cloud sync, cross-device play

---

*Built with React + Vite + TypeScript + Tailwind CSS*
