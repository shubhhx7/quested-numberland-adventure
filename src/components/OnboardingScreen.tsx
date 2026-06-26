import React, { useState } from 'react';
import { assets } from '../utils/assets';
import type { Profile, ClassLevel } from '../types';

interface OnboardingScreenProps {
  onComplete: (profile: Profile) => void;
}

const CLASS_OPTIONS: ClassLevel[] = ['6', '7', '8'];

const CLASS_LABELS: Record<string, string> = {
  '6': 'Little Learner',
  '7': 'Super Starter',
  '8': 'Bright Explorer',
};

const AVATAR_OPTIONS = [
  { emoji: '🧒', label: 'Boy' },
  { emoji: '👧', label: 'Girl' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐼', label: 'Panda' },
];

const GOAL_OPTIONS = [
  { label: 'Numbers', icon: '🔢' },
  { label: 'Shapes', icon: '🔷' },
  { label: 'Animals', icon: '🐾' },
  { label: 'All Fun!', icon: '🎉' },
];

// ── Step progress dots ────────────────────────────────────────────────────────
const StepDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 'clamp(8px,1.5vmin,16px)' }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i + 1 === current ? 24 : 10,
          height: 10,
          borderRadius: 5,
          background: i + 1 === current ? '#FFC857' : 'rgba(255,255,255,0.3)',
          transition: 'all 0.3s ease',
        }}
      />
    ))}
  </div>
);

// ── Q-Buddy thumbnail ─────────────────────────────────────────────────────────
const QBuddyThumb: React.FC = () => {
  const [err, setErr] = useState(false);
  return err ? (
    <span style={{ fontSize: 28, display: 'inline-flex', alignItems: 'center' }}>🤖</span>
  ) : (
    <img
      src={assets.character}
      alt="Q-Buddy"
      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFC857', flexShrink: 0 }}
      onError={() => setErr(true)}
    />
  );
};

// ── Left side character ───────────────────────────────────────────────────────
const LeftCharacter: React.FC = () => {
  const [err, setErr] = useState(false);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '40%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '4%',
        pointerEvents: 'none',
      }}
    >
      {/* Speech bubble */}
      <div
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          padding: 'clamp(8px,1.2vmin,14px) clamp(10px,1.5vmin,18px)',
          maxWidth: '88%',
          marginBottom: '2%',
          position: 'relative',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(0.6rem, 1vmin, 0.82rem)',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 500,
            lineHeight: 1.4,
            textAlign: 'center',
          }}
        >
          Hi hero! I'm Q-Buddy! 🌟 Welcome to Wonder Island!
        </p>
        {/* Bubble tail */}
        <div
          style={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid rgba(255,255,255,0.18)',
          }}
        />
      </div>

      {/* Character image */}
      <div className="float-anim" style={{ width: '72%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {err ? (
          <span style={{ fontSize: 'clamp(4rem,9vmin,7rem)', filter: 'drop-shadow(0 8px 24px rgba(123,63,242,0.5))' }}>🧙</span>
        ) : (
          <img
            src={assets.character}
            alt="Q-Buddy"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '45vh',
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'drop-shadow(0 8px 32px rgba(123,63,242,0.55))',
            }}
            onError={() => setErr(true)}
          />
        )}
      </div>
    </div>
  );
};

// ── Achievement badge image ───────────────────────────────────────────────────
const AchievementBadge: React.FC = () => {
  const [err, setErr] = useState(false);
  return err ? (
    <span className="badge-pop" style={{ fontSize: 'clamp(2rem, 4vmin, 3.5rem)' }}>🏅</span>
  ) : (
    <img
      src={assets.achievementBadge}
      alt="Achievement badge"
      className="badge-pop"
      style={{ width: 'clamp(44px, 7vmin, 70px)', height: 'clamp(44px, 7vmin, 70px)', objectFit: 'contain' }}
      onError={() => setErr(true)}
    />
  );
};

// ── Shared label style ────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: 'clamp(0.6rem, 1vmin, 0.8rem)',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: 'clamp(5px, 0.8vmin, 9px)',
};

// ── Main component ────────────────────────────────────────────────────────────
const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('6');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧒');
  const [goal, setGoal] = useState('All Fun!');

  const handleFinish = () => {
    onComplete({
      name: name.trim() || 'Knowledge Hero',
      classLevel: classLevel as ClassLevel,
      avatar,
      goal,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(145deg, #1e2560 0%, #10194a 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(123,63,242,0.3) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(38,51,166,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Left: character + speech bubble ── */}
      <LeftCharacter />

      {/* ── Right: onboarding panel (60% width) ── */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '60%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3% 4% 3% 2%',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(14px, 2.5vmin, 28px) clamp(16px, 2.8vmin, 32px)',
            overflow: 'hidden',
          }}
        >
          {/* Step dots */}
          <StepDots current={step} total={3} />

          {/* ─────────────── STEP 1: Choose Class ─────────────── */}
          {step === 1 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Q-Buddy row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(10px,1.8vmin,18px)' }}>
                <QBuddyThumb />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(0.62rem,1.05vmin,0.82rem)', fontWeight: 500 }}>
                  Hi! I'm Q-Buddy
                </span>
              </div>

              <h2
                style={{
                  margin: '0 0 clamp(10px,1.8vmin,20px)',
                  fontSize: 'clamp(1rem, 2vmin, 1.6rem)',
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.2,
                }}
              >
                Who is playing today? 🎮
              </h2>

              {/* Age buttons row */}
              <div style={{ display: 'flex', gap: 'clamp(6px,1.2vmin,14px)', marginBottom: 'auto' }}>
                {CLASS_OPTIONS.map((cls) => {
                  const selected = classLevel === cls;
                  return (
                    <button
                      key={cls}
                      onClick={() => setClassLevel(cls)}
                      style={{
                        flex: 1,
                        height: 'clamp(48px, 8vmin, 72px)',
                        borderRadius: '14px',
                        border: selected ? '2px solid #FFC857' : '2px solid rgba(255,255,255,0.2)',
                        background: selected
                          ? 'linear-gradient(135deg, #FFC857, #ff9f1c)'
                          : 'rgba(255,255,255,0.07)',
                        color: selected ? '#3d1f00' : '#fff',
                        fontWeight: 800,
                        fontSize: 'clamp(0.85rem, 1.6vmin, 1.2rem)',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        boxShadow: selected ? '0 4px 18px rgba(255,200,87,0.45)' : 'none',
                      }}
                    >
                      {CLASS_LABELS[cls]}
                    </button>
                  );
                })}
              </div>

              <button
                className="btn-game btn-primary-game"
                disabled={!classLevel}
                onClick={() => setStep(2)}
                style={{
                  width: '100%',
                  marginTop: 'clamp(12px, 2vmin, 20px)',
                  padding: 'clamp(10px, 1.6vmin, 15px) 0',
                  fontSize: 'clamp(0.8rem, 1.4vmin, 1.05rem)',
                  borderRadius: '12px',
                  opacity: classLevel ? 1 : 0.45,
                  cursor: classLevel ? 'pointer' : 'not-allowed',
                }}
              >
                Next →
              </button>
            </div>
          )}

          {/* ─────────────── STEP 2: Create Hero ─────────────── */}
          {step === 2 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 'clamp(8px, 1.4vmin, 14px)' }}>
              {/* Back + heading row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.6rem, 1vmin, 0.78rem)',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  ← Back
                </button>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 'clamp(0.9rem, 1.8vmin, 1.4rem)',
                    fontWeight: 800,
                    color: '#fff',
                  }}
                >
                  Pick Your Character! 🎮
                </h2>
              </div>

              {/* Name input */}
              <div>
                <p style={labelStyle}>What's your name? ✏️</p>
                <input
                  type="text"
                  placeholder="Super Explorer"
                  maxLength={18}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid rgba(255,255,255,0.4)',
                    color: '#fff',
                    fontSize: 'clamp(0.75rem, 1.35vmin, 1rem)',
                    fontWeight: 600,
                    padding: 'clamp(4px,0.8vmin,8px) 2px',
                    outline: 'none',
                    caretColor: '#FFC857',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Avatar picker */}
              <div>
                <p style={labelStyle}>Choose your animal friend! 🐾</p>
                <div style={{ display: 'flex', gap: 'clamp(6px,1.1vmin,12px)' }}>
                  {AVATAR_OPTIONS.map((av) => {
                    const selected = avatar === av.emoji;
                    return (
                      <button
                        key={av.emoji}
                        onClick={() => setAvatar(av.emoji)}
                        style={{
                          flex: 1,
                          height: 'clamp(48px, 8vmin, 68px)',
                          borderRadius: '12px',
                          border: selected ? '2px solid #FFC857' : '2px solid rgba(255,255,255,0.15)',
                          background: selected ? 'rgba(123,63,242,0.4)' : 'rgba(255,255,255,0.07)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 2,
                          transition: 'all 0.15s ease',
                          boxShadow: selected ? '0 2px 12px rgba(123,63,242,0.45)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: 'clamp(1.2rem, 2.4vmin, 2rem)', lineHeight: 1 }}>{av.emoji}</span>
                        <span style={{ fontSize: 'clamp(0.5rem, 0.85vmin, 0.68rem)', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                          {av.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal picker */}
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>What do you love? 🌟</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(5px, 0.9vmin, 10px)' }}>
                  {GOAL_OPTIONS.map((g) => {
                    const selected = goal === g.label;
                    return (
                      <button
                        key={g.label}
                        onClick={() => setGoal(g.label)}
                        style={{
                          height: 'clamp(36px, 6vmin, 52px)',
                          borderRadius: '10px',
                          border: selected ? '2px solid #FFC857' : '2px solid rgba(255,255,255,0.12)',
                          background: selected ? 'rgba(123,63,242,0.55)' : 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          fontSize: 'clamp(0.58rem, 1vmin, 0.78rem)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5,
                          padding: '0 6px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: 'clamp(0.75rem, 1.3vmin, 1rem)', flexShrink: 0 }}>{g.icon}</span>
                        <span style={{ textAlign: 'left', lineHeight: 1.2 }}>{g.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                className="btn-game btn-primary-game"
                disabled={!avatar || !goal}
                onClick={() => setStep(3)}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 1.6vmin, 15px) 0',
                  fontSize: 'clamp(0.8rem, 1.4vmin, 1.05rem)',
                  borderRadius: '12px',
                  opacity: avatar && goal ? 1 : 0.45,
                  cursor: avatar && goal ? 'pointer' : 'not-allowed',
                  marginTop: 'auto',
                }}
              >
                Next →
              </button>
            </div>
          )}

          {/* ─────────────── STEP 3: Ready! ─────────────── */}
          {step === 3 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', gap: 'clamp(8px, 1.3vmin, 14px)' }}>
              {/* Back */}
              <div style={{ alignSelf: 'flex-start' }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.6rem, 1vmin, 0.78rem)',
                    fontWeight: 600,
                  }}
                >
                  ← Back
                </button>
              </div>

              {/* Badge */}
              <AchievementBadge />

              {/* Welcome heading */}
              <h2
                style={{
                  margin: 0,
                  fontSize: 'clamp(1rem, 2.2vmin, 1.7rem)',
                  fontWeight: 900,
                  color: '#FFC857',
                  textAlign: 'center',
                  textShadow: '0 0 20px rgba(255,200,87,0.4)',
                }}
              >
                Yay! Hi, {name.trim() || 'Super Explorer'}! 🎉
              </h2>

              {/* Profile summary pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(123,63,242,0.25)',
                  border: '1px solid rgba(123,63,242,0.4)',
                  borderRadius: '999px',
                  padding: 'clamp(4px, 0.7vmin, 8px) clamp(10px, 1.6vmin, 18px)',
                }}
              >
                <span style={{ fontSize: 'clamp(1rem, 1.8vmin, 1.5rem)' }}>{avatar || '🧙'}</span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'clamp(0.62rem, 1.1vmin, 0.85rem)', fontWeight: 600 }}>
                  {CLASS_LABELS[classLevel as string] ?? `Class ${classLevel}`}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7em' }}>·</span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'clamp(0.62rem, 1.1vmin, 0.85rem)', fontWeight: 600 }}>
                  {goal}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 'clamp(0.62rem, 1.05vmin, 0.82rem)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  maxWidth: '80%',
                }}
              >
                Q-Buddy will guide you through Wonder Island! Count, play, find shapes, and collect cool badges! 🌈
              </p>

              {/* Decorative star strip */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {['⭐', '⭐', '⭐'].map((s, i) => (
                  <span key={i} style={{ fontSize: 'clamp(0.9rem, 1.6vmin, 1.3rem)', opacity: 0.9 }}>{s}</span>
                ))}
              </div>

              {/* CTA */}
              <button
                className="btn-game btn-gold-game"
                onClick={handleFinish}
                style={{
                  width: '100%',
                  marginTop: 'auto',
                  padding: 'clamp(12px, 2vmin, 18px) 0',
                  fontSize: 'clamp(0.85rem, 1.5vmin, 1.1rem)',
                  borderRadius: '14px',
                  letterSpacing: '0.03em',
                }}
              >
                🚀 Enter Wonder Island!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
