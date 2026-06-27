# QuestED — Numberland Adventure

A browser-based educational math game for early learners (ages 5–7). Kids guide their owl mascot **Q-Buddy** through 8 sequential missions across Numberland, answering multiple-choice questions to earn XP, coins, and achievement badges.

---

## Table of Contents

1. [Game Overview](#game-overview)
2. [Missions & Levels](#missions--levels)
3. [Question Topics](#question-topics)
4. [Scoring & Progression](#scoring--progression)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Architecture](#architecture)
9. [Data Model](#data-model)
10. [Component Reference](#component-reference)

---

## Game Overview

QuestED presents Numberland as an interactive world map. Each location is a **mission** — a set of 5 multiple-choice questions on a specific math or knowledge topic. Players:

- Select an answer from 4 wooden plank-style buttons
- Receive instant correct/wrong feedback with Q-Buddy's reaction
- Unlock progressive hints if they're stuck
- Earn XP and coins per correct answer
- Unlock the next mission on completion
- Collect a unique badge for each completed mission

Progress is stored in `localStorage` — no account or backend required. A **Progress Report** overlay gives parents and teachers a copyable plain-text summary of the child's performance.

---

## Missions & Levels

All 8 missions unlock sequentially. Completing one unlocks the next.

### Mission 1 — Counting Canyon
| Field | Value |
|---|---|
| **ID** | `rainbow-bridge` |
| **Topic** | Counting |
| **Difficulty** | Easy |
| **Questions** | 5 |
| **Reward XP** | 100 |
| **Reward Coins** | 30 |
| **Badge** | Bridge Helper |
| **Story** | Count the shiny stones to help Q-Buddy cross the canyon! 🌈 |

**Questions:**
1. Count the apples! 🍎🍎🍎 → **3**
2. How many stars? ⭐⭐ → **2**
3. How many cats? 🐱🐱🐱🐱 → **4**
4. Count the flowers! 🌸🌸🌸🌸🌸 → **5**
5. How many balloons? 🎈🎈🎈 → **3**

---

### Mission 2 — Number Nook
| Field | Value |
|---|---|
| **ID** | `splash-tank` |
| **Topic** | Numbers |
| **Difficulty** | Easy |
| **Questions** | 5 |
| **Reward XP** | 120 |
| **Reward Coins** | 35 |
| **Badge** | Splash Star |
| **Story** | Which number is bigger? Help fill the tank! 💧 |

**Questions:**
1. Which number is bigger — 3 or 7? → **7**
2. Which number is smaller — 5 or 2? → **2**
3. What number comes after 4? → **5**
4. What number comes before 3? → **2**
5. Which group has MORE — 6 fish or 4 fish? → **6 fish**

---

### Mission 3 — Addition Arena
| Field | Value |
|---|---|
| **ID** | `fruit-market` |
| **Topic** | Addition |
| **Difficulty** | Easy |
| **Questions** | 5 |
| **Reward XP** | 140 |
| **Reward Coins** | 40 |
| **Badge** | Fruit Counter |
| **Story** | Add up apples, bananas & coins to win! 🍎 |

**Questions:**
1. How many stars total? ⭐⭐ + ⭐ = ? → **3**
2. 1 + 1 = ? → **2**
3. 2 + 2 = ? → **4**
4. 🍎🍎🍎 + 🍎🍎 = ? → **5**
5. 4 + 1 = ? → **5**

---

### Mission 4 — Geometry Garden
| Field | Value |
|---|---|
| **ID** | `shape-gate` |
| **Topic** | Shapes |
| **Difficulty** | Easy |
| **Questions** | 5 |
| **Reward XP** | 150 |
| **Reward Coins** | 45 |
| **Badge** | Shape Finder |
| **Story** | Find the right shapes to enter the magical garden! 🔷 |

**Questions:**
1. Which shape is round like a ball? → **Circle**
2. How many sides does a triangle have? → **3**
3. What shape does the sun look like? → **Circle**
4. How many sides does a square have? → **4**
5. A pizza slice looks like which shape? → **Triangle**

---

### Mission 5 — Pattern Park
| Field | Value |
|---|---|
| **ID** | `mystery-cave` |
| **Topic** | Patterns |
| **Difficulty** | Easy |
| **Questions** | 5 |
| **Reward XP** | 160 |
| **Reward Coins** | 50 |
| **Badge** | Pattern Explorer |
| **Story** | Spot patterns to light the path ahead! ✨ |

**Questions:**
1. ⭐ 🌙 ⭐ 🌙 __ → **⭐**
2. 1, 2, __, 4, 5 — What is missing? → **3**
3. 🔴 🔵 🔴 🔵 __ → **🔴**
4. 2, 4, __, 8 — What comes next? → **6**
5. 🐶 🐱 🐶 🐱 __ → **🐶**

---

### Mission 6 — Number Tower
| Field | Value |
|---|---|
| **ID** | `star-tower` |
| **Topic** | Numbers |
| **Difficulty** | Easy |
| **Questions** | 5 |
| **Reward XP** | 180 |
| **Reward Coins** | 55 |
| **Badge** | Star Climber |
| **Story** | Climb the tower by counting bright stars! 🌟 |

**Questions:**
1. Which number is bigger — 8 or 6? → **8**
2. What number comes after 9? → **10**
3. Count the fish! 🐟🐟🐟🐟🐟🐟 → **6**
4. Which is smallest — 1, 4, 9, or 6? → **1**
5. Count the ice creams! 🍦🍦🍦🍦🍦🍦🍦 → **7**

---

### Mission 7 — Animal Arena
| Field | Value |
|---|---|
| **ID** | `animal-arena` |
| **Topic** | Animals |
| **Difficulty** | Easy |
| **Questions** | 5 |
| **Reward XP** | 200 |
| **Reward Coins** | 60 |
| **Badge** | Animal Friend |
| **Story** | Meet friendly animals & answer fun questions! 🐾 |

**Questions:**
1. Which animal says MOO? → **Cow**
2. Which animal has the longest neck? → **Giraffe**
3. How many legs does a dog have? → **4**
4. Which animal can fly? → **Butterfly**
5. What is a baby cat called? → **Kitten**

---

### Mission 8 — Challenge Coliseum ⚔️
| Field | Value |
|---|---|
| **ID** | `happy-castle` |
| **Topic** | Mixed |
| **Difficulty** | Easy |
| **Questions** | 5 |
| **Reward XP** | 250 |
| **Reward Coins** | 80 |
| **Badge** | Castle Champion |
| **Story** | Final challenge — show all your skills! 🏆 |

**Questions (mixed topics):**
1. 2 + 3 = ? → **5** *(Addition)*
2. Which shape has NO corners? → **Circle** *(Shapes)*
3. Count the lions! 🦁🦁🦁🦁 → **4** *(Counting)*
4. 1, 2, 3, __ → **4** *(Patterns)*
5. Which animal says WOOF? → **Dog** *(Animals)*

---

## Question Topics

| Topic | Missions | Skills Covered |
|---|---|---|
| **Counting** | 1, 8 | 1-to-1 correspondence, object counting up to 7 |
| **Numbers** | 2, 6 | Comparing, ordering, before/after, up to 10 |
| **Addition** | 3, 8 | Simple addition facts up to 5 |
| **Shapes** | 4, 8 | Circle, triangle, square — sides and real-world recognition |
| **Patterns** | 5, 8 | AB patterns, skip counting by 2 |
| **Animals** | 7, 8 | General knowledge, habitats, sounds |
| **Mixed** | 8 | Review of all above |

---

## Scoring & Progression

### Per-Answer Rewards
| Event | XP | Coins |
|---|---|---|
| Correct answer | +20 | +5 |
| Incorrect answer | 0 | 0 |

### Mission Completion Bonus
| Event | XP | Coins |
|---|---|---|
| Completing a mission | +50 | +20 |

**Max per mission (all 5 correct):** 170 XP · 45 coins

### Player Level Thresholds
| Level | XP Required |
|---|---|
| Level 1 | 0 |
| Level 2 | 200 |
| Level 3 | 500 |
| Level 4 | 900 |
| Level 5 | 1,400+ |

### Total Game Rewards (all 8 missions, all correct)
- **XP:** 1,300 mission XP + 400 bonus XP + 800 answer XP = **2,500 XP**
- **Coins:** 335 mission coins + 160 bonus coins + 200 answer coins = **695 coins**
- **Badges:** 8 unique badges (one per mission)

### Hint System
Each question has **4 progressive hints**, each more direct than the last:
- Hint 1 — General strategy
- Hint 2 — Narrowed approach
- Hint 3 — Strong nudge
- Hint 4 — Near-answer

---

## Tech Stack

| Layer | Technology |
|---|---|
| **UI Library** | React 18.2 |
| **Language** | TypeScript 5.2 (strict mode) |
| **Build Tool** | Vite 5.0 |
| **Styling** | Custom CSS (scoped class-based, no runtime UI library) |
| **State** | React `useState` + `useCallback` (no external store) |
| **Persistence** | `localStorage` (key: `quested_progress_v1`) |
| **Routing** | None — scene switching via React state |
| **Backend** | None — fully client-side |
| **Linting** | ESLint 8 + TypeScript + React plugins |

---

## Project Structure

```
QuestED/
├── public/
│   └── assets/
│       ├── home-screen.png         # Home screen background
│       ├── bgg2.png                # Numberland world map
│       ├── numberland-map.png      # Map background (alt)
│       ├── character.png           # Q-Buddy owl mascot
│       ├── achievement-badge.png   # Badge graphic
│       ├── qnbg.png                # Question screen background
│       └── question-screen.png     # Reference design asset
│
├── src/
│   ├── main.tsx                    # React root mount
│   ├── App.tsx                     # Top-level scene router + global state
│   ├── index.css                   # All styles (global + per-scene)
│   │
│   ├── types/
│   │   └── index.ts                # Shared TypeScript types & enums
│   │
│   ├── data/
│   │   ├── missions.ts             # 8 mission definitions + helpers
│   │   └── questions.ts            # 40 question definitions + helpers
│   │
│   ├── components/
│   │   ├── GameStage.tsx           # Full-screen stage wrapper
│   │   ├── HomeScreen.tsx          # Landing screen
│   │   ├── OnboardingScreen.tsx    # First-run profile setup
│   │   ├── MapScene.tsx            # World map hub + overlay controller
│   │   ├── InteractiveWorldMap.tsx # Map image + mission hotspot layer
│   │   ├── MapLabelStickers.tsx    # Hotspot buttons with state styling
│   │   ├── GameplayScene.tsx       # Question screen (MCQ + hints + feedback)
│   │   ├── GameHud.tsx             # In-game HUD (XP, coins, level, menu)
│   │   ├── MissionIntroModal.tsx   # Mission briefing modal
│   │   ├── HintPanel.tsx           # Progressive hint reveal
│   │   ├── ExplanationPanel.tsx    # Answer feedback + explanation
│   │   ├── RewardScene.tsx         # Post-mission celebration screen
│   │   ├── DashboardOverlay.tsx    # XP progress + topic mastery overlay
│   │   ├── ProgressReportOverlay.tsx # Parent/teacher summary overlay
│   │   ├── ProfileOverlay.tsx      # Student profile + reset option
│   │   ├── Toast.tsx               # Toast notification system
│   │   ├── ConfirmModal.tsx        # Generic confirm dialog
│   │   ├── RotateDeviceOverlay.tsx # Portrait-mode rotation prompt
│   │   └── SoundToggle.tsx         # Audio on/off toggle
│   │
│   └── utils/
│       ├── storage.ts              # localStorage read/write + migration
│       ├── gameLogic.ts            # XP, coins, level, accuracy calculations
│       ├── analytics.ts            # Event tracking stub
│       ├── sounds.ts               # Audio effect stubs
│       └── assets.ts               # Asset URL constants
│
├── assets/
│   └── ref1.png                    # UI reference design image
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Type-check without building
npx tsc --noEmit

# Production build → dist/
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

### First Run
1. Open `http://localhost:5173`
2. Click **Start Adventure**
3. Complete the onboarding (class level, avatar, name, goal)
4. You land on the Numberland map — Mission 1 is unlocked
5. Click a mission hotspot → read the briefing → play

---

## Architecture

### Scene Flow

```
Home ──► Onboarding (first run only)
          │
          ▼
         Map ◄──────────────────────────────────┐
          │                                     │
          ├── [click hotspot] ──► MissionIntro  │
          │                          │          │
          │                      [Start]        │
          │                          │          │
          │                          ▼          │
          │                      Gameplay       │
          │                          │          │
          │                    [Complete] ──► Reward ──┘
          │                    [Quit] ──────────────────┘
          │
          ├── Dashboard overlay
          ├── Progress Report overlay
          └── Profile overlay
```

### State Management

All state lives in `App.tsx` and flows down as props:

```typescript
// Scene
scene: Scene                       // 'home' | 'onboarding' | 'map' | 'gameplay' | 'reward'

// Player
profile: Profile | null            // Name, class level, avatar, goal
progress: Progress                 // XP, coins, level, completedMissions[], badges[]

// Session
selectedMissionId: string | null   // Active mission
rewardData: RewardData | null      // Post-mission celebration payload

// Overlays
showDashboard: boolean
showProgressReport: boolean
showProfile: boolean
```

### Persistence

Progress is serialized to `localStorage` under key `quested_progress_v1` on every state change via `storage.ts`. A migration layer handles old mission ID formats from earlier builds.

### Mission Unlock Logic

```typescript
// Mission N is unlocked if mission N-1 is in progress.completedMissionIds
// First mission (rainbow-bridge) is always unlocked
getMissionStatus(missionId, progress) → 'locked' | 'unlocked' | 'completed'
```

---

## Data Model

### Mission
```typescript
interface Mission {
  id: string;
  title: string;
  topic: Topic;
  difficulty: Difficulty;
  story: string;          // Kid-friendly mission briefing
  badge: string;          // Badge name awarded on completion
  rewardXP: number;
  rewardCoins: number;
  icon: string;           // Emoji icon
  questionIds: string[];  // Ordered list of 5 question IDs
  mapPosition: {
    x: number;   // % from left edge of map
    y: number;   // % from top edge of map
    w: number;   // % width of hotspot
    h: number;   // % height of hotspot
  };
}
```

### Question
```typescript
interface Question {
  id: string;
  topic: Topic;
  classLevel: ClassLevel;       // '6' | '7' | '8' (age 5 / 6 / 7)
  question: string;
  options: string[];            // Always exactly 4 options
  correctAnswer: string;
  explanation: string;          // Shown after a wrong answer
  hints: string[];              // 4 progressive hints
  difficulty: Difficulty;
  estimatedTimeSeconds: number; // 15–25 seconds
}
```

### Progress
```typescript
interface Progress {
  xp: number;
  coins: number;
  level: number;                // Derived from XP thresholds (1–5)
  streak: number;               // Consecutive days played
  completedMissionIds: string[];
  unlockedMissionIds: string[];
  badges: string[];
  topicStats: Record<Topic, { correct: number; total: number }>;
  missionAttempts: Record<string, number>;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  lastPlayedAt: string;         // ISO date string
}
```

### Enums
```typescript
type ClassLevel  = '6' | '7' | '8'
type Topic       = 'Counting' | 'Numbers' | 'Addition' | 'Shapes' | 'Patterns' | 'Animals' | 'Mixed'
type Difficulty  = 'Easy' | 'Medium' | 'Hard' | 'Boss'
type MissionStatus = 'locked' | 'unlocked' | 'completed'
type Scene       = 'home' | 'onboarding' | 'map' | 'gameplay' | 'reward'
```

---

## Component Reference

| Component | Key Props | Responsibility |
|---|---|---|
| `App` | — | Global state, scene routing, all event handlers |
| `HomeScreen` | `onStart`, `hasProgress` | Landing hero, Start/Continue CTAs |
| `OnboardingScreen` | `onComplete(profile)` | Multi-step profile setup wizard |
| `MapScene` | `progress`, `missions`, overlay callbacks | Map hub, overlay toggling |
| `InteractiveWorldMap` | `missions`, `progress`, `onSelect` | Hotspot positioning and click detection |
| `GameplayScene` | `missionId`, `questions`, `onComplete`, `onQuit` | Full question loop, hint system, scoring display |
| `GameHud` | `progress`, `profile`, overlay callbacks | Top HUD bar with XP, coins, level, menus |
| `RewardScene` | `rewardData`, `onContinue`, `onDashboard` | XP/badge celebration animation |
| `DashboardOverlay` | `progress`, `missions` | Topic mastery heatmap, XP chart, next mission |
| `ProgressReportOverlay` | `profile`, `progress` | Parent-readable summary with copy-to-clipboard |
| `ProfileOverlay` | `profile`, `onReset` | Student identity display + Reset Journey |

---

## Roadmap / Planned Additions

- [ ] Medium and Hard difficulty questions per topic
- [ ] Sound effects and background music
- [ ] Animated Q-Buddy reactions (sprite or Lottie)
- [ ] Multiplayer / class leaderboard (Supabase backend)
- [ ] Teacher dashboard with per-student analytics
- [ ] Additional worlds beyond Numberland (Shapeland, Wordville)
- [ ] Accessibility: screen reader support, high-contrast mode
- [ ] PWA / offline support
- [ ] iOS/Android wrapper via Capacitor
