import React, { useState } from 'react';
import { setSoundEnabled, isSoundEnabled } from '../utils/sounds';

interface Props {
  style?: React.CSSProperties;
}

const SoundToggle: React.FC<Props> = ({ style }) => {
  const [on, setOn] = useState(isSoundEnabled);

  const toggle = () => {
    const next = !on;
    setSoundEnabled(next);
    setOn(next);
  };

  return (
    <button
      onClick={toggle}
      title={on ? 'Sound On — click to mute' : 'Sound Off — click to unmute'}
      style={{
        background: 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        border: '2px solid rgba(255,255,255,0.6)',
        borderRadius: '50%',
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1rem',
        lineHeight: 1,
        transition: 'background 0.15s ease, transform 0.1s ease',
        flexShrink: 0,
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.55)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.35)';
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      {on ? '🔊' : '🔇'}
    </button>
  );
};

export default SoundToggle;
