import React, { useEffect, useState } from 'react';
import { assets } from '../utils/assets';
import { getMissionById } from '../data/missions';
import { playClickSound } from '../utils/sounds';

interface Props {
  missionId: string;
  onStart: () => void;
  onClose: () => void;
}

const TOPIC_COLORS: Record<string, string> = {
  Counting:  'linear-gradient(135deg,#ff6b9d,#ff3a7a)',
  Numbers:   'linear-gradient(135deg,#4ecdc4,#00b09b)',
  Addition:  'linear-gradient(135deg,#ffd93d,#ffba00)',
  Shapes:    'linear-gradient(135deg,#a78bfa,#7c3aed)',
  Patterns:  'linear-gradient(135deg,#4facfe,#00f2fe)',
  Animals:   'linear-gradient(135deg,#f7971e,#ffd200)',
  Mixed:     'linear-gradient(135deg,#f953c6,#b91d73)',
};

const MissionIntroModal: React.FC<Props> = ({ missionId, onStart, onClose }) => {
  const [badgeError, setBadgeError] = useState(false);
  const [charError, setCharError] = useState(false);
  const [mounted, setMounted] = useState(false);

  const mission = getMissionById(missionId);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(t); };
  }, [onClose]);

  if (!mission) return null;

  const topicGrad = TOPIC_COLORS[mission.topic] ?? TOPIC_COLORS.Mixed;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${mission.title} mission details`}
    >
      <div
        className={mounted ? 'slide-up-enter' : ''}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg,#4facfe 0%,#00f2fe 50%,#a8edea 100%)',
          borderRadius: '24px',
          width: '54%',
          maxWidth: '620px',
          maxHeight: '82%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35), 0 0 0 3px rgba(255,255,255,0.4)',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          background: topicGrad,
          padding: '16px 18px 14px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 8, position: 'relative', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 10, left: 12,
            background: 'rgba(255,255,255,0.3)', border: '2px solid rgba(255,255,255,0.6)',
            borderRadius: '999px', color: 'white', cursor: 'pointer',
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
          }}>← Back</button>

          {/* Mission icon — large */}
          <div style={{
            fontSize: 'clamp(2.5rem,6vmin,4rem)',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
            lineHeight: 1,
          }}>
            {mission.icon}
          </div>

          <h2 style={{
            color: 'white', fontWeight: 900, margin: 0,
            fontSize: 'clamp(1rem,2.2vw,1.5rem)', lineHeight: 1.2,
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {mission.title}
          </h2>

          {/* Topic chip */}
          <div style={{
            background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)',
            borderRadius: '999px', padding: '3px 12px',
            color: 'white', fontWeight: 700, fontSize: '0.72rem',
            border: '1.5px solid rgba(255,255,255,0.6)',
          }}>
            {mission.topic} · {mission.difficulty}
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '14px 18px 8px',
          background: 'rgba(255,255,255,0.5)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* Q-Buddy + story */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: 'rgba(255,255,255,0.65)', borderRadius: '16px',
            padding: '10px 12px',
            border: '2px solid rgba(255,255,255,0.9)',
          }}>
            {charError ? (
              <div style={{ fontSize: '2.2rem', flexShrink: 0 }}>🦉</div>
            ) : (
              <img
                src={assets.character}
                alt="Q-Buddy"
                onError={() => setCharError(true)}
                style={{ height: 'clamp(42px,7vmin,60px)', objectFit: 'contain', flexShrink: 0 }}
              />
            )}
            <div>
              <div style={{ fontSize: '0.65rem', color: '#7c3aed', fontWeight: 700, marginBottom: 4 }}>
                Q-Buddy says:
              </div>
              <p style={{
                color: '#3d1f6e', fontSize: 'clamp(0.78rem,1.4vw,0.92rem)',
                lineHeight: 1.65, margin: 0, fontWeight: 500,
              }}>
                {mission.story}
              </p>
            </div>
          </div>

          {/* 5 stars preview */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.55)', borderRadius: '14px',
            padding: '8px 12px', border: '2px solid rgba(255,200,87,0.5)',
          }}>
            <span style={{ color: '#3d1f6e', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
              5 questions:
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ fontSize: 'clamp(1rem,2.2vmin,1.4rem)' }}>⭐</span>
              ))}
            </div>
          </div>

          {/* Rewards + badge row */}
          <div style={{ display: 'flex', gap: 10 }}>
            {/* Rewards */}
            <div style={{
              flex: 1, background: 'rgba(255,255,255,0.55)', borderRadius: '14px',
              padding: '10px 12px', border: '2px solid rgba(255,255,255,0.8)',
            }}>
              <div style={{ color: '#7c3aed', fontSize: '0.65rem', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Win these! 🎁
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ color: '#3d1f6e', fontSize: '0.8rem', fontWeight: 600 }}>
                  ⚡ <span style={{ color: '#ff6b00' }}>+{mission.rewardXP}</span> XP
                </div>
                <div style={{ color: '#3d1f6e', fontSize: '0.8rem', fontWeight: 600 }}>
                  🪙 <span style={{ color: '#ff6b00' }}>+{mission.rewardCoins}</span> Coins
                </div>
              </div>
            </div>

            {/* Badge preview */}
            <div style={{
              flex: 1, background: 'rgba(255,255,255,0.55)', borderRadius: '14px',
              padding: '10px 12px', border: '2px solid rgba(255,200,87,0.6)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {badgeError ? (
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>🏅</span>
              ) : (
                <img
                  src={assets.achievementBadge}
                  alt="Badge"
                  onError={() => setBadgeError(true)}
                  style={{ width: 'clamp(36px,6vmin,48px)', height: 'clamp(36px,6vmin,48px)', objectFit: 'contain', flexShrink: 0 }}
                />
              )}
              <div>
                <div style={{ color: '#7c3aed', fontSize: '0.62rem', fontWeight: 700, marginBottom: 2 }}>Earn badge:</div>
                <div style={{ color: '#3d1f6e', fontWeight: 700, fontSize: '0.78rem' }}>
                  {mission.badge}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          borderTop: '2px solid rgba(255,255,255,0.6)',
          padding: '10px 16px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,255,255,0.4)', flexShrink: 0, gap: 10,
        }}>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            style={{
              background: 'rgba(255,255,255,0.5)', border: '2px solid rgba(61,31,110,0.25)',
              borderRadius: '14px', color: '#5a3e8a', fontWeight: 700,
              fontSize: 'clamp(0.72rem,1.2vw,0.88rem)', padding: '8px 16px', cursor: 'pointer',
            }}
          >
            ← Not Now
          </button>
          <button
            onClick={() => { playClickSound(); onStart(); }}
            style={{
              background: 'linear-gradient(135deg,#ffd93d,#ffba00)',
              border: '3px solid rgba(255,255,255,0.9)',
              borderRadius: '14px', color: '#3d1f00', fontWeight: 900,
              fontSize: 'clamp(0.85rem,1.5vw,1.05rem)',
              padding: 'clamp(8px,1.4vmin,12px) clamp(18px,3vw,28px)',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(255,186,0,0.45)',
            }}
          >
            🚀 Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionIntroModal;
