import React, { useState } from 'react';
import { assets } from '../utils/assets';
import SoundToggle from './SoundToggle';

interface HomeScreenProps {
  onStart: () => void;
  onContinue: () => void;
  hasSavedProgress: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onContinue, hasSavedProgress }) => {
  const [imgErr, setImgErr] = useState(false);
  const [charErr, setCharErr] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* ── Background ── */}
      {imgErr ? (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg,#4facfe 0%,#00f2fe 40%,#a8edea 70%,#fed6e3 100%)',
        }} />
      ) : (
        <img
          src={assets.homeScreen}
          alt=""
          aria-hidden="true"
          onError={() => setImgErr(true)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }}
        />
      )}

      {/* Subtle bottom-only gradient so buttons stay readable while the art is visible */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, transparent 0%, transparent 42%, rgba(16,25,74,0.55) 68%, rgba(16,25,74,0.82) 100%)',
      }} />

      {/* Soft top vignette for title readability */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 35% at 50% 0%, rgba(16,25,74,0.55) 0%, transparent 70%)',
      }} />

      {/* Sound toggle — top right */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 20 }}>
        <SoundToggle />
      </div>

      {/* ── Content layer ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '3% 6% 3%',
      }}>

        {/* ── LOGO — top area ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.4em',
          flex: '0 0 auto',
        }}>
          <div style={{
            width: 'clamp(28px,3.5vmin,48px)', height: 2,
            background: 'linear-gradient(90deg,transparent,#FFC857,transparent)',
            marginBottom: '0.2em',
          }} />
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(2rem,4.2vmin,3.8rem)',
            fontWeight: 900, color: '#FFC857', letterSpacing: '0.04em',
            textShadow: '0 0 36px rgba(255,200,87,0.7), 0 2px 12px rgba(255,200,87,0.4), 0 3px 4px rgba(0,0,0,0.5)',
            lineHeight: 1,
          }}>
            QuestED
          </h1>
          <p style={{
            margin: 0,
            fontSize: 'clamp(0.78rem,1.5vmin,1.2rem)',
            fontWeight: 800, color: 'rgba(255,255,255,0.98)',
            letterSpacing: '0.07em', textTransform: 'uppercase',
            textShadow: '0 1px 8px rgba(0,0,0,0.7)',
          }}>
            Wonder Island Adventure
          </p>
          <p style={{
            margin: 0,
            fontSize: 'clamp(0.65rem,1.2vmin,0.95rem)',
            fontWeight: 600, color: 'rgba(255,255,255,0.82)',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}>
            Learn · Play · Smile 🌈
          </p>
        </div>

        {/* ── Q-Buddy character — center area ── */}
        <div style={{
          flex: '1 1 0', display: 'flex', alignItems: 'center',
          justifyContent: 'center', minHeight: 0,
        }}>
          {charErr ? (
            <div className="float-anim" style={{
              fontSize: 'clamp(4rem,9vmin,7.5rem)',
              filter: 'drop-shadow(0 8px 28px rgba(123,63,242,0.55))',
            }}>🧙</div>
          ) : (
            <img
              src={assets.character}
              alt="Q-Buddy"
              className="float-anim"
              onError={() => setCharErr(true)}
              style={{
                height: 'clamp(100px,24vmin,200px)',
                maxWidth: '40%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 28px rgba(123,63,242,0.55))',
              }}
            />
          )}
        </div>

        {/* ── Bottom buttons — compact panel ── */}
        <div style={{
          flex: '0 0 auto',
          width: '100%', maxWidth: '400px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8,
        }}>
          {/* Tag line inside a small frosted pill */}
          <div style={{
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '999px', padding: '4px 16px',
            color: 'rgba(255,255,255,0.88)', fontSize: 'clamp(0.62rem,1.1vmin,0.82rem)',
            fontWeight: 600, textAlign: 'center',
          }}>
            A magical adventure for little explorers! 🦋
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="btn-game btn-gold-game"
            style={{
              width: '100%',
              padding: 'clamp(11px,1.9vmin,17px) 0',
              fontSize: 'clamp(0.95rem,1.8vmin,1.3rem)',
              borderRadius: '18px',
            }}
          >
            🚀 Start Adventure!
          </button>

          {/* Continue button — only if saved progress exists */}
          {hasSavedProgress && (
            <button
              onClick={onContinue}
              style={{
                width: '100%',
                padding: 'clamp(7px,1.3vmin,11px) 0',
                fontSize: 'clamp(0.75rem,1.3vmin,0.98rem)',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.18)',
                border: '2px solid rgba(255,255,255,0.35)',
                color: 'white', fontWeight: 700, cursor: 'pointer',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.28)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)'; }}
            >
              🗺️ Continue My Adventure →
            </button>
          )}

          {/* Credit — bottom center of home screen */}
          <p style={{
            margin: '4px 0 0',
            fontSize: 'clamp(0.55rem,0.92vmin,0.72rem)',
            color: 'rgba(255,255,255,0.62)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textAlign: 'center',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}>
            Made by - Shubh ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
