import React from 'react';
import type { Progress } from '../types';
import { missions } from '../data/missions';
import { getMissionStatus } from '../utils/gameLogic';

interface Props {
  progress: Progress;
}

// Label anchor positions (% of the 16:9 map container)
// Labels sit ABOVE their island's hotspot area so arrows/text point down to the island.
const STICKER_POSITIONS: Record<string, { labelX: number; labelY: number }> = {
  'rainbow-bridge': { labelX: 5,  labelY: 56 },
  'splash-tank':    { labelX: 13, labelY: 34 },
  'fruit-market':   { labelX: 32, labelY: 20 },
  'shape-gate':     { labelX: 47, labelY: 26 },
  'mystery-cave':   { labelX: 49, labelY: 60 },
  'star-tower':     { labelX: 63, labelY: 17 },
  'animal-arena':   { labelX: 77, labelY: 53 },
  'happy-castle':   { labelX: 76, labelY: 4  },
};

const TOPIC_SUBTITLES: Record<string, string> = {
  Counting:  'Numbers & Counting',
  Numbers:   'Bigger & Smaller',
  Addition:  'Add & Combine',
  Shapes:    'Shapes & Space',
  Patterns:  'Find the Pattern',
  Animals:   'Fun Animal Facts',
  Mixed:     'Mix of All Skills',
};

// Edge-aware horizontal alignment so labels don't overflow the map container.
// labelX < 14  → left-align (translateX 0)
// labelX > 86  → right-align (translateX -100%)
// Otherwise    → center  (translateX -50%)
function labelTransform(labelX: number): string {
  if (labelX < 14) return 'translateX(0%)';
  if (labelX > 86) return 'translateX(-100%)';
  return 'translateX(-50%)';
}

const MapLabelStickers: React.FC<Props> = ({ progress }) => {
  return (
    <>
      {missions.map((mission) => {
        const pos = STICKER_POSITIONS[mission.id];
        if (!pos) return null;

        const status = getMissionStatus(
          mission.id,
          progress.unlockedMissionIds,
          progress.completedMissionIds,
        );
        const isActive  = status === 'unlocked';
        const isLocked  = status === 'locked';
        const transform = labelTransform(pos.labelX);

        // ── ACTIVE (NEXT) island: highly visible marker ──────────────────
        if (isActive) {
          return (
            <div
              key={mission.id}
              style={{
                position: 'absolute',
                left: `${pos.labelX}%`,
                top: `${pos.labelY}%`,
                transform,
                pointerEvents: 'none',
                zIndex: 7,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // same alignment as transform so content flows consistently
              }}
            >
              {/* ── Outer pulsing halo ring ── */}
              <div style={{
                position: 'absolute',
                inset: -10,
                borderRadius: '28px',
                border: '3px solid rgba(255, 220, 50, 0.85)',
                boxShadow: [
                  '0 0 18px rgba(255,220,50,0.65)',
                  '0 0 40px rgba(255,220,50,0.30)',
                  '0 0 70px rgba(255,220,50,0.12)',
                ].join(', '),
                animation: 'outerRingPulse 1.6s ease-in-out infinite',
                pointerEvents: 'none',
              }} />

              {/* ── Main badge ── */}
              <div style={{
                background: 'linear-gradient(140deg, #ffe066 0%, #ffba00 55%, #ff9100 100%)',
                borderRadius: '22px',
                padding: '8px 16px 7px',
                border: '3.5px solid rgba(255,255,255,0.97)',
                boxShadow: [
                  '0 7px 0 rgba(160,90,0,0.5)',
                  '0 10px 28px rgba(255,140,0,0.55)',
                ].join(', '),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                minWidth: 'clamp(110px, 14vmin, 175px)',
                position: 'relative',
              }}>
                {/* Top row: icon + name + NEXT pill */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap',
                }}>
                  <span style={{ fontSize: 'clamp(0.9rem, 1.6vmin, 1.3rem)', lineHeight: 1, flexShrink: 0 }}>
                    {mission.icon}
                  </span>
                  <span style={{
                    color: 'white',
                    fontWeight: 900,
                    fontSize: 'clamp(0.7rem, 1.25vw, 1rem)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.35)',
                    whiteSpace: 'nowrap',
                  }}>
                    {mission.title}
                  </span>
                  <span style={{
                    background: '#cc0000',
                    color: 'white',
                    borderRadius: '999px',
                    padding: '2px 8px',
                    fontSize: 'clamp(0.46rem, 0.76vw, 0.62rem)',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  }}>
                    NEXT ▶
                  </span>
                </div>

                {/* Subtitle */}
                <div style={{
                  color: 'rgba(80,30,0,0.85)',
                  fontSize: 'clamp(0.48rem, 0.78vw, 0.64rem)',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}>
                  {TOPIC_SUBTITLES[mission.topic] ?? mission.topic}
                </div>
              </div>

              {/* ── Animated downward arrow ── */}
              <div style={{
                alignSelf: 'center',
                fontSize: 'clamp(1rem, 2vmin, 1.5rem)',
                color: '#ffe066',
                textShadow: '0 2px 8px rgba(0,0,0,0.65)',
                animation: 'tapHereBounce 0.7s ease-in-out infinite alternate',
                lineHeight: 1,
                marginTop: 4,
              }}>
                ▼
              </div>

              {/* ── Tap-here label ── */}
              <div style={{
                alignSelf: 'center',
                color: 'white',
                fontWeight: 900,
                fontSize: 'clamp(0.62rem, 1.05vw, 0.85rem)',
                textShadow: [
                  '0 1px 8px rgba(0,0,0,0.85)',
                  '0 0 16px rgba(255,220,50,0.7)',
                ].join(', '),
                whiteSpace: 'nowrap',
                marginTop: 2,
              }}>
                👆 Tap to play!
              </div>
            </div>
          );
        }

        // ── COMPLETED island: green checkmark sticker ─────────────────────
        if (status === 'completed') {
          return (
            <div
              key={mission.id}
              style={{
                position: 'absolute',
                left: `${pos.labelX}%`,
                top: `${pos.labelY}%`,
                transform,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                borderRadius: '14px',
                padding: '3px 10px',
                border: '2px solid rgba(255,255,255,0.75)',
                boxShadow: '0 2px 10px rgba(46,204,113,0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: '0.72rem', lineHeight: 1 }}>✅</span>
                <span style={{
                  color: 'white',
                  fontWeight: 800,
                  fontSize: 'clamp(0.52rem, 0.84vw, 0.68rem)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                }}>
                  {mission.title}
                </span>
              </div>
            </div>
          );
        }

        // ── LOCKED island: dimmed lock sticker ────────────────────────────
        if (isLocked) {
          return (
            <div
              key={mission.id}
              style={{
                position: 'absolute',
                left: `${pos.labelX}%`,
                top: `${pos.labelY}%`,
                transform,
                pointerEvents: 'none',
                zIndex: 5,
                opacity: 0.65,
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, rgba(40,40,60,0.82), rgba(20,20,40,0.82))',
                borderRadius: '12px',
                padding: '3px 9px',
                border: '1.5px solid rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: '0.68rem', lineHeight: 1 }}>🔒</span>
                <span style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontWeight: 700,
                  fontSize: 'clamp(0.5rem, 0.8vw, 0.64rem)',
                }}>
                  {mission.title}
                </span>
              </div>
            </div>
          );
        }

        return null;
      })}
    </>
  );
};

export default MapLabelStickers;
