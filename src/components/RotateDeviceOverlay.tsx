import React from 'react';

const RotateDeviceOverlay: React.FC = () => {
  return (
    <div className="rotate-overlay">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          maxWidth: '320px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Phone rotation icon */}
        <div
          aria-hidden="true"
          style={{
            fontSize: '5rem',
            lineHeight: 1,
            animation: 'rotateHint 2.5s ease-in-out infinite',
          }}
        >
          📱
        </div>

        {/* Title */}
        <h1
          style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '0.01em',
          }}
        >
          Rotate to Play
        </h1>

        {/* Primary message */}
        <p
          style={{
            margin: 0,
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.5,
          }}
        >
          Rotate your phone to landscape mode to play{' '}
          <strong style={{ color: 'white' }}>QuestED: Numberland Adventure</strong>
        </p>

        {/* Hint */}
        <p
          style={{
            margin: 0,
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.4,
          }}
        >
          The game is designed for landscape / PC screens.
        </p>
      </div>

      {/* Keyframe injected inline via a style tag so we don't depend on Tailwind for the animation */}
      <style>{`
        @keyframes rotateHint {
          0%, 100% { transform: rotate(0deg); }
          30%       { transform: rotate(-90deg); }
          60%       { transform: rotate(-90deg); }
          80%       { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default RotateDeviceOverlay;
