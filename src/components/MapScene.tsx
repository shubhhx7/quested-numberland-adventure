import React, { useState } from 'react';
import type { Profile, Progress } from '../types';
import InteractiveWorldMap from './InteractiveWorldMap';
import GameHud from './GameHud';
import MissionIntroModal from './MissionIntroModal';
import MapLabelStickers from './MapLabelStickers';
import { assets } from '../utils/assets';

interface Props {
  profile: Profile;
  progress: Progress;
  onStartMission: (missionId: string) => void;
  onShowToast: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  onOpenDashboard: () => void;
  onOpenReport: () => void;
  onOpenProfile: () => void;
}

const MapScene: React.FC<Props> = ({
  profile,
  progress,
  onStartMission,
  onShowToast,
  onOpenDashboard,
  onOpenReport,
  onOpenProfile,
}) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [showMissionModal, setShowMissionModal] = useState(false);

  const handleMissionClick = (missionId: string) => {
    setSelectedMissionId(missionId);
    setShowMissionModal(true);
  };

  const handleStartMission = () => {
    if (selectedMissionId) {
      onStartMission(selectedMissionId);
    }
    setShowMissionModal(false);
  };

  const handleCloseModal = () => {
    setShowMissionModal(false);
    setSelectedMissionId(null);
  };

  return (
    // Full viewport — no gaps, no flex centering, no limiting wrapper
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>

      {/* ── Map image: fill = exactly 100vw × 100vh, no cropping, no gaps ── */}
      <img
        src={assets.numberlandMap}
        alt="Numberland Map"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {/* ── Coordinate layer: full viewport, hotspots % aligned to image ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <InteractiveWorldMap
          progress={progress}
          onMissionSelect={handleMissionClick}
          onLockedClick={() =>
            onShowToast('Complete the glowing island first to unlock this one! 🔒', 'info')
          }
        />
        <MapLabelStickers progress={progress} />
      </div>

      {/* HUD + modals over full viewport */}
      <GameHud
        profile={profile}
        progress={progress}
        onOpenDashboard={onOpenDashboard}
        onOpenReport={onOpenReport}
        onOpenProfile={onOpenProfile}
      />

      {showMissionModal && selectedMissionId && (
        <MissionIntroModal
          missionId={selectedMissionId}
          onStart={handleStartMission}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MapScene;
