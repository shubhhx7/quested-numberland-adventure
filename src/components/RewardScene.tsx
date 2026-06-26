import React, { useState, useEffect } from 'react';
import { assets } from '../utils/assets';
import type { RewardData } from '../types';
import { getMissionById } from '../data/missions';
import { playRewardSound, playUnlockSound } from '../utils/sounds';
import SoundToggle from './SoundToggle';

interface Props {
  rewardData: RewardData;
  onContinueMap: () => void;
  onViewDashboard: () => void;
}

const RewardScene: React.FC<Props> = ({ rewardData, onContinueMap, onViewDashboard }) => {
  const [mounted, setMounted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [badgeError, setBadgeError] = useState(false);
  const [charError, setCharError] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => { setMounted(true); playRewardSound(); }, 120);
    const t2 = setTimeout(() => setStatsVisible(true), 420);
    const t3 = rewardData.nextMissionId
      ? setTimeout(() => playUnlockSound(), 900)
      : null;
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (t3) clearTimeout(t3);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stars = Math.round(rewardData.accuracy / 20);
  const nextMission = rewardData.nextMissionId ? getMissionById(rewardData.nextMissionId) : null;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg,#4facfe 0%,#00f2fe 30%,#a8edea 60%,#fed6e3 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'clamp(14px,2.5vh,28px) clamp(16px,3vw,32px)',
      overflow: 'hidden',
    }}>
      {/* ── Floating decorations ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {['🌟','✨','⭐','💫','🌟','✨','⭐'].map((s, i) => (
          <div key={i} className="float-anim" style={{
            position: 'absolute',
            top: `${8 + i * 12}%`,
            left: i % 2 === 0 ? `${3 + i * 4}%` : undefined,
            right: i % 2 !== 0 ? `${3 + i * 3}%` : undefined,
            fontSize: 'clamp(1rem,2vmin,1.6rem)', opacity: 0.55,
            animationDelay: `${i * 0.3}s`,
          }}>{s}</div>
        ))}
        {[
          { top: '10%', left: '15%', size: 70, delay: '0s' },
          { top: '60%', right: '10%', size: 55, delay: '0.6s' },
          { bottom: '5%', left: '20%', size: 45, delay: '1.2s' },
        ].map((c, i) => (
          <div key={`b${i}`} className="float-anim" style={{
            position: 'absolute',
            top: (c as Record<string,unknown>).top as string | undefined,
            left: (c as Record<string,unknown>).left as string | undefined,
            right: (c as Record<string,unknown>).right as string | undefined,
            bottom: (c as Record<string,unknown>).bottom as string | undefined,
            width: c.size, height: c.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            animationDelay: c.delay,
          }} />
        ))}
      </div>

      {/* Sound toggle */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
        <SoundToggle />
      </div>

      {/* ── TITLE ── */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, flexShrink: 0 }}>
        <h1 className={mounted ? 'xp-bounce' : ''} style={{
          fontSize: 'clamp(1.4rem,3.2vw,2.6rem)',
          color: '#3d1f6e',
          textShadow: '0 2px 12px rgba(61,31,110,0.2), 0 0 30px rgba(255,200,87,0.4)',
          fontWeight: 900, margin: 0, lineHeight: 1.2,
        }}>
          🌟 Yay! Mission Complete! 🌟
        </h1>
        <p style={{
          color: '#5a3e8a', fontSize: 'clamp(0.85rem,1.6vw,1.15rem)',
          margin: '4px 0 0', fontWeight: 600,
        }}>
          You finished: {rewardData.missionTitle} 🎉
        </p>
        {rewardData.isFirstCompletion && (
          <p style={{ color: '#1a7a4a', fontSize: 'clamp(0.72rem,1.3vw,0.92rem)', margin: '2px 0 0', fontWeight: 700 }}>
            🏅 First time! You earned a badge!
          </p>
        )}
      </div>

      {/* ── MIDDLE ROW: Q-Buddy + Badge ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 'clamp(16px,3vw,36px)', position: 'relative', zIndex: 2,
        flex: '0 0 auto',
      }}>
        {/* Q-Buddy celebrating */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {charError ? (
            <div style={{ fontSize: 'clamp(3.5rem,10vmin,7rem)', animation: 'floatAnim 2s ease-in-out infinite' }}>🦉</div>
          ) : (
            <img
              src={assets.character}
              alt="Q-Buddy"
              className="float-anim"
              onError={() => setCharError(true)}
              style={{
                height: 'clamp(80px,15vmin,130px)',
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 18px rgba(123,63,242,0.4))',
              }}
            />
          )}
          <div style={{
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)',
            borderRadius: '999px', padding: '2px 10px',
            color: '#3d1f6e', fontWeight: 700, fontSize: '0.72rem',
          }}>Q-Buddy 🌟</div>
        </div>

        {/* Badge + stars */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {badgeError ? (
            <div style={{
              width: 'clamp(70px,12vmin,115px)', height: 'clamp(70px,12vmin,115px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'clamp(2.5rem,7vmin,4.5rem)',
              filter: 'drop-shadow(0 4px 14px rgba(255,200,87,0.5))',
            }}>🏅</div>
          ) : (
            <img
              src={assets.achievementBadge}
              alt="Achievement Badge"
              className={mounted ? 'badge-pop' : ''}
              onError={() => setBadgeError(true)}
              style={{
                width: 'clamp(70px,12vmin,115px)', height: 'clamp(70px,12vmin,115px)',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 16px rgba(255,200,87,0.55))',
              }}
            />
          )}
          <div style={{
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(6px)',
            borderRadius: '12px', padding: '6px 14px', textAlign: 'center',
            border: '2px solid rgba(255,200,87,0.6)',
          }}>
            <div style={{ color: '#3d1f6e', fontWeight: 700, fontSize: 'clamp(0.78rem,1.4vw,1rem)', marginBottom: 4 }}>
              {rewardData.badgeUnlocked}
            </div>
            <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{
                  fontSize: 'clamp(0.9rem,1.8vw,1.4rem)',
                  opacity: i < stars ? 1 : 0.22,
                  transition: `opacity ${0.1 + i * 0.1}s ease`,
                }}>⭐</span>
              ))}
            </div>
            <div style={{ color: '#5a3e8a', fontSize: '0.7rem', fontWeight: 600, marginTop: 2 }}>
              {stars} / 5 stars
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className={statsVisible ? 'xp-bounce' : ''} style={{
        display: 'flex', gap: 'clamp(8px,1.5vw,14px)',
        width: '100%', maxWidth: '520px',
        position: 'relative', zIndex: 2, flexShrink: 0,
      }}>
        {[
          { icon: '⚡', val: `+${rewardData.xpEarned}`, label: 'XP Earned', color: '#3d1f6e' },
          { icon: '🪙', val: `+${rewardData.coinsEarned}`, label: 'Coins', color: '#7c3aed' },
          { icon: '🎯', val: `${rewardData.accuracy}%`, label: 'Accuracy', color: rewardData.accuracy >= 70 ? '#1a7a4a' : '#b06000' },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.62)', backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255,255,255,0.85)', borderRadius: '14px',
            padding: 'clamp(8px,1.5vw,14px) clamp(10px,2vw,18px)',
            flex: 1, textAlign: 'center',
            boxShadow: '0 4px 16px rgba(61,31,110,0.1)',
          }}>
            <div style={{ fontSize: 'clamp(1rem,2.2vw,1.5rem)', fontWeight: 800, color: s.color }}>
              {s.icon} {s.val}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(61,31,110,0.6)', marginTop: 2, fontWeight: 600 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Score line */}
      <p style={{
        color: '#3d1f6e', fontSize: 'clamp(0.82rem,1.4vw,0.98rem)',
        margin: 0, fontWeight: 700, position: 'relative', zIndex: 2,
      }}>
        You got {rewardData.correctAnswers} out of {rewardData.totalQuestions} right! 🎯
      </p>

      {/* Next mission unlock */}
      {nextMission && (
        <div style={{
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
          border: '2px solid rgba(79,172,254,0.7)', borderRadius: '14px',
          padding: '8px 18px', textAlign: 'center',
          position: 'relative', zIndex: 2, flexShrink: 0,
        }}>
          <span style={{ color: '#3d1f6e', fontSize: 'clamp(0.78rem,1.4vw,0.95rem)', fontWeight: 700 }}>
            🔓 New island unlocked: {nextMission.icon} {nextMission.title}!
          </span>
        </div>
      )}

      {/* ── BUTTONS ── */}
      <div style={{
        display: 'flex', gap: 12, width: '100%', maxWidth: '500px',
        position: 'relative', zIndex: 2, flexShrink: 0,
      }}>
        <button
          onClick={onViewDashboard}
          style={{
            flex: 1, padding: 'clamp(9px,1.6vmin,14px) 0',
            background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255,255,255,0.8)', borderRadius: '16px',
            color: '#3d1f6e', fontWeight: 700,
            fontSize: 'clamp(0.78rem,1.4vw,0.95rem)', cursor: 'pointer',
          }}
        >
          See My Stars! ⭐
        </button>
        <button
          onClick={onContinueMap}
          style={{
            flex: 1, padding: 'clamp(9px,1.6vmin,14px) 0',
            background: 'linear-gradient(135deg,#ffd93d,#ffba00)',
            border: '3px solid rgba(255,255,255,0.85)', borderRadius: '16px',
            color: '#3d1f00', fontWeight: 900,
            fontSize: 'clamp(0.82rem,1.5vw,1rem)', cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(255,186,0,0.45)',
          }}
        >
          🗺️ Back to the Map!
        </button>
      </div>
    </div>
  );
};

export default RewardScene;
