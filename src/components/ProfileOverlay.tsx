import React, { useState } from 'react';
import { assets } from '../utils/assets';
import type { Profile, Progress } from '../types';
import { calculateLevel, xpToNextLevel } from '../utils/gameLogic';

interface Props {
  profile: Profile;
  progress: Progress;
  onClose: () => void;
  onReset: () => void;
}

const ProfileOverlay: React.FC<Props> = ({ profile, progress, onClose, onReset }) => {
  const [charError, setCharError] = useState(false);

  const level = calculateLevel(progress.xp);
  const xpData = xpToNextLevel(progress.xp);

  const BADGE_LIMIT = 6;
  const visibleBadges = progress.badges.slice(0, BADGE_LIMIT);
  const extraBadges = progress.badges.length - BADGE_LIMIT;

  const createdDate = new Date(profile.createdAt).toLocaleDateString();

  return (
    <div className="overlay-panel">
      <div className="overlay-bg" onClick={onClose} />
      <div
        className="overlay-card"
        style={{ maxWidth: '700px', width: '88%', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '12px',
            marginBottom: '16px',
            flexShrink: 0,
          }}
        >
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>👤 Profile</span>
          <button
            className="btn-game btn-ghost-game"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              padding: 0,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* BODY — 2 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            gap: '20px',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* LEFT 40% */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            {charError ? (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '3px solid #FFC857',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  background: 'rgba(255,255,255,0.06)',
                }}
                className="float-anim"
              >
                🤖
              </div>
            ) : (
              <img
                src={assets.character}
                alt="Character"
                className="float-anim"
                onError={() => setCharError(true)}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #FFC857',
                }}
              />
            )}

            <div style={{ fontSize: '2rem', lineHeight: 1 }}>{profile.avatar}</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{profile.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
              Class {profile.classLevel}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
              Goal: {profile.goal}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
              Member since: {createdDate}
            </div>
          </div>

          {/* RIGHT 60% */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
            {/* Top stats 2x2 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: '#FFC857', fontWeight: 700, fontSize: '0.95rem' }}>
                  ⚡ {progress.xp} XP
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>Level {level}</div>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                  🪙 {progress.coins}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>Coins</div>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                  🔥 {progress.streak}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>Streak</div>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                  🏅 {progress.badges.length}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>Badges</div>
              </div>
            </div>

            {/* XP progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>
                  Level {level} → {level < 5 ? level + 1 : 'Max'}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
                  {xpData.current}/{xpData.needed} XP
                </span>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${xpData.percent}%`, background: '#FFC857' }}
                />
              </div>
            </div>

            {/* Badges section */}
            <div>
              <div
                style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '7px',
                }}
              >
                Your Badges
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
                {visibleBadges.map((badge) => (
                  <span
                    key={badge}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '0.65rem',
                      background: 'rgba(255,200,87,0.15)',
                      border: '1px solid rgba(255,200,87,0.4)',
                      color: '#FFC857',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {badge}
                  </span>
                ))}
                {extraBadges > 0 && (
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                    +{extraBadges} more
                  </span>
                )}
                {progress.badges.length === 0 && (
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                    No badges yet — complete missions!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '16px',
            paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <button
              className="btn-game btn-danger-game"
              onClick={onReset}
              style={{ fontSize: '0.8rem', padding: '7px 14px' }}
            >
              ⚠️ Reset Journey
            </button>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>
            This will erase all progress.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverlay;
