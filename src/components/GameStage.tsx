import React from 'react';

interface GameStageProps {
  children: React.ReactNode;
}

const GameStage: React.FC<GameStageProps> = ({ children }) => {
  return (
    <div
      className="game-stage-wrapper"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div className="game-stage">
        {children}
      </div>
    </div>
  );
};

export default GameStage;
