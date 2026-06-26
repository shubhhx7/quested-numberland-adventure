import React from 'react';
import type { Progress } from '../types';
import { missions } from '../data/missions';
import { getMissionStatus } from '../utils/gameLogic';

interface Props {
  progress: Progress;
  onMissionSelect: (missionId: string) => void;
  onLockedClick: () => void;
}

const InteractiveWorldMap: React.FC<Props> = ({ progress, onMissionSelect, onLockedClick }) => {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>

      {/* Mission hotspot buttons — % positions relative to this 16:9 coordinate layer */}
      {missions.map((mission) => {
        const status = getMissionStatus(
          mission.id,
          progress.unlockedMissionIds,
          progress.completedMissionIds
        );

        const handleClick = () => {
          if (status === 'locked') {
            onLockedClick();
          } else {
            onMissionSelect(mission.id);
          }
        };

        const statusClass = [
          'map-hotspot',
          status === 'completed' ? 'completed hotspot-completed' : '',
          status === 'unlocked' ? 'current hotspot-pulse' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={mission.id}
            className={statusClass}
            style={{
              left: `${mission.mapPosition.x}%`,
              top: `${mission.mapPosition.y}%`,
              width: `${mission.mapPosition.w}%`,
              height: `${mission.mapPosition.h}%`,
            }}
            aria-label={`${mission.title} - ${status}`}
            onClick={handleClick}
          >
            {/* Radial glow — invisible by default, CSS shows on hover */}
            <div className="hotspot-glow" />

            {/* Tooltip */}
            <div className="hotspot-tooltip">
              {status === 'locked' ? '🔒 ' : status === 'completed' ? '✅ ' : '⭐ '}
              {mission.title}
            </div>

            {/* Small badge bottom-right for completed/locked */}
            {status === 'completed' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '4%',
                  right: '4%',
                  width: '22%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: '#2ECC71',
                  border: '2px solid rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.55em',
                  fontWeight: 900,
                  color: '#fff',
                  pointerEvents: 'none',
                }}
              >
                ✓
              </div>
            )}
            {status === 'locked' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '4%',
                  right: '4%',
                  width: '22%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.55em',
                  pointerEvents: 'none',
                }}
              >
                🔒
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default InteractiveWorldMap;
