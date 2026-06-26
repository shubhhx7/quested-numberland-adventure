import React, { useState } from 'react';
import { assets } from '../utils/assets';
import type { Profile, Progress } from '../types';
import { missions } from '../data/missions';
import { calculateLevel, getMissionStatus } from '../utils/gameLogic';
import SoundToggle from './SoundToggle';

interface Props {
  profile: Profile;
  progress: Progress;
  onOpenDashboard: () => void;
  onOpenReport: () => void;
  onOpenProfile: () => void;
}

const LDRAWER = 242; // left drawer width px
const RDRAWER = 210; // right drawer width px

const GameHud: React.FC<Props> = ({
  profile,
  progress,
  onOpenDashboard,
  onOpenReport,
  onOpenProfile,
}) => {
  const [leftOpen, setLeftOpen]   = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [charError, setCharError] = useState(false);

  const level         = calculateLevel(progress.xp);
  const truncatedName = profile.name.length > 10 ? profile.name.slice(0, 10) + '…' : profile.name;

  const nextMission = missions.find((m) =>
    getMissionStatus(m.id, progress.unlockedMissionIds, progress.completedMissionIds) === 'unlocked'
  );
  const allComplete =
    missions.length > 0 &&
    missions.every((m) => progress.completedMissionIds.includes(m.id));

  // ── Shared drawer panel style ──────────────────────────────
  const drawerPanel: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    height: '100vh',
    zIndex: 60,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '14px 12px 18px',
    overflowY: 'auto',
    background: 'rgba(10, 8, 28, 0.93)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderRight: '1.5px solid rgba(255,255,255,0.1)',
    transition: 'transform 0.26s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
  };

  // ── Shared tab-button style (peek handle on edge) ──────────
  const tabBtn = (side: 'left' | 'right', open: boolean): React.CSSProperties => ({
    position: 'fixed',
    top: '50%',
    [side]: open
      ? (side === 'left' ? LDRAWER : RDRAWER)
      : 0,
    transform: 'translateY(-50%)',
    zIndex: 61,
    width: 22,
    height: 54,
    background: 'rgba(10,8,28,0.88)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1.5px solid rgba(255,255,255,0.15)',
    ...(side === 'left'
      ? { borderLeft: 'none', borderRadius: '0 10px 10px 0' }
      : { borderRight: 'none', borderRadius: '10px 0 0 10px' }),
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.7rem',
    fontWeight: 900,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.26s cubic-bezier(0.4, 0, 0.2, 1)',
  });

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 13,
    padding: '10px 12px',
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          BACKDROP — closes whichever drawer is open
          ═══════════════════════════════════════════════════ */}
      {(leftOpen || rightOpen) && (
        <div
          onClick={() => { setLeftOpen(false); setRightOpen(false); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.22)',
            zIndex: 59,
            cursor: 'pointer',
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════
          LEFT DRAWER — profile + stats + mission + owl
          ═══════════════════════════════════════════════════ */}
      <button
        onClick={() => setLeftOpen((o) => !o)}
        style={tabBtn('left', leftOpen)}
        aria-label={leftOpen ? 'Close menu' : 'Open menu'}
      >
        {leftOpen ? '◀' : '▶'}
      </button>

      <div
        style={{
          ...drawerPanel,
          left: 0,
          width: LDRAWER,
          transform: leftOpen ? 'translateX(0)' : `translateX(-${LDRAWER}px)`,
        }}
      >
        {/* Close row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#FFC857', fontWeight: 900, fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            🎮 QuestED
          </span>
          <button
            onClick={() => setLeftOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1rem', cursor: 'pointer', padding: 2, lineHeight: 1 }}
          >✕</button>
        </div>

        {/* Profile card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#7b3ff2,#2633a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 2px 8px rgba(123,63,242,0.4)',
            }}>
              {profile.avatar || '🧒'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {truncatedName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                <span style={{ background: 'linear-gradient(135deg,#7b3ff2,#2633a6)', color: '#fff', borderRadius: 5, padding: '1px 7px', fontSize: '0.62rem', fontWeight: 700 }}>
                  Lv.{level}
                </span>
                <span style={{ color: '#FFC857', fontWeight: 900, fontSize: '0.6rem' }}>QuestED ⭐</span>
              </div>
            </div>
          </div>
          {/* XP / coins / streak */}
          <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
            {[
              { icon: '⚡', val: progress.xp,     color: '#c084fc' },
              { icon: '🪙', val: progress.coins,  color: '#fbbf24' },
              { icon: '🔥', val: progress.streak, color: '#f87171' },
            ].map((s) => (
              <div key={s.icon} style={{
                flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '4px 2px', textAlign: 'center',
                color: s.color, fontWeight: 700, fontSize: '0.68rem',
              }}>
                {s.icon} {s.val}
              </div>
            ))}
          </div>
        </div>

        {/* Next mission */}
        <div style={cardStyle}>
          {allComplete ? (
            <div style={{ color: '#FFC857', fontWeight: 800, fontSize: '0.72rem' }}>🏆 All islands complete!</div>
          ) : nextMission ? (
            <>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: '0.62rem', marginBottom: 4 }}>🗺️ Next up:</div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nextMission.icon} {nextMission.title}
              </div>
            </>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.68rem' }}>🌟 Tap a glowing island!</div>
          )}
        </div>

        {/* Q-Buddy hint — pushed to bottom */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {charError ? (
            <div className="float-anim" style={{ fontSize: '2.4rem', flexShrink: 0 }}>🦉</div>
          ) : (
            <img
              src={assets.character}
              alt="Q-Buddy"
              className="float-anim"
              style={{ height: 54, flexShrink: 0, objectFit: 'contain', filter: 'drop-shadow(0 3px 10px rgba(255,200,87,0.5))' }}
              onError={() => setCharError(true)}
            />
          )}
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '10px 10px 10px 3px',
            padding: '7px 10px', color: 'rgba(255,255,255,0.88)',
            fontSize: '0.66rem', lineHeight: 1.55, fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            🌟 Tap the glowing island to play!
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          RIGHT DRAWER — stats / report / profile / sound
          ═══════════════════════════════════════════════════ */}
      <button
        onClick={() => setRightOpen((o) => !o)}
        style={tabBtn('right', rightOpen)}
        aria-label={rightOpen ? 'Close tools' : 'Open tools'}
      >
        {rightOpen ? '▶' : '◀'}
      </button>

      <div
        style={{
          ...drawerPanel,
          right: 0,
          left: 'auto',
          width: RDRAWER,
          borderRight: 'none',
          borderLeft: '1.5px solid rgba(255,255,255,0.1)',
          transform: rightOpen ? 'translateX(0)' : `translateX(${RDRAWER}px)`,
        }}
      >
        {/* Close row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setRightOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1rem', cursor: 'pointer', padding: 2, lineHeight: 1 }}
          >✕</button>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: '0.68rem' }}>Tools</span>
        </div>

        {/* Nav buttons */}
        {[
          { icon: '📊', label: 'Stats',   onClick: () => { onOpenDashboard(); setRightOpen(false); } },
          { icon: '📋', label: 'Report',  onClick: () => { onOpenReport();    setRightOpen(false); } },
          { icon: '👤', label: 'Profile', onClick: () => { onOpenProfile();   setRightOpen(false); } },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12, padding: '11px 14px',
              color: 'white', fontWeight: 700, fontSize: '0.82rem',
              cursor: 'pointer', textAlign: 'left', width: '100%',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(123,63,242,0.28)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
          >
            <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{btn.icon}</span>
            {btn.label}
          </button>
        ))}

        {/* Sound toggle */}
        <div style={{ marginTop: 4 }}>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6, paddingLeft: 2 }}>
            SOUND
          </div>
          <SoundToggle style={{
            width: '100%', height: 42, borderRadius: 12,
            fontSize: '0.82rem', fontWeight: 700,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
          }} />
        </div>
      </div>
    </>
  );
};

export default GameHud;
