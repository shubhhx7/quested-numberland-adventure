import React, { useState, useCallback, useEffect } from 'react';
import type { Scene, Profile, Progress, RewardData } from './types';
import {
  loadData, saveData, saveProfile, clearData,
  defaultProgress, hasExistingProgress,
} from './utils/storage';
import {
  calculateLevel,
  XP_PER_CORRECT, COINS_PER_CORRECT,
  MISSION_BONUS_XP, MISSION_BONUS_COINS,
} from './utils/gameLogic';
import { trackEvent } from './utils/analytics';
import { getMissionById, getNextMissionId } from './data/missions';
import { getQuestionsByIds } from './data/questions';

import GameStage from './components/GameStage';
import RotateDeviceOverlay from './components/RotateDeviceOverlay';
import HomeScreen from './components/HomeScreen';
import OnboardingScreen from './components/OnboardingScreen';
import MapScene from './components/MapScene';
import GameplayScene from './components/GameplayScene';
import RewardScene from './components/RewardScene';
import DashboardOverlay from './components/DashboardOverlay';
import ProgressReportOverlay from './components/ProgressReportOverlay';
import ProfileOverlay from './components/ProfileOverlay';
import { ToastContainer, useToast } from './components/Toast';
import ConfirmModal from './components/ConfirmModal';

export default function App() {
  const [scene, setScene] = useState<Scene>('home');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<Progress>(defaultProgress());
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [rewardData, setRewardData] = useState<RewardData | null>(null);

  // Overlay visibility states (shown on top of map)
  const [showDashboard, setShowDashboard] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { toasts, showToast, removeToast } = useToast();

  // Load saved data on mount — always start at home screen
  useEffect(() => {
    const data = loadData();
    if (data) {
      setProfile(data.profile);
      setProgress(data.progress);
    }
  }, []);

  // Close overlays on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showProfile) { setShowProfile(false); return; }
      if (showReport) { setShowReport(false); return; }
      if (showDashboard) { setShowDashboard(false); return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showDashboard, showReport, showProfile]);

  const closeAllOverlays = useCallback(() => {
    setShowDashboard(false);
    setShowReport(false);
    setShowProfile(false);
  }, []);

  /* ── Home handlers ──────────────────────────────────────── */
  const handleStart = useCallback(() => {
    if (hasExistingProgress()) {
      setScene('map');
    } else {
      // Bypass onboarding — create a default Player profile immediately
      const saved = saveProfile({
        name: 'Player',
        classLevel: '6',
        avatar: '🧒',
        goal: 'All Fun!',
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
      });
      setProfile(saved.profile);
      setProgress(saved.progress);
      setScene('map');
    }
  }, []);

  const handleContinue = useCallback(() => {
    setScene('map');
  }, []);

  /* ── Onboarding ─────────────────────────────────────────── */
  const handleOnboardingComplete = useCallback((newProfile: Profile) => {
    const saved = saveProfile(newProfile);
    setProfile(saved.profile);
    setProgress(saved.progress);
    trackEvent('onboarding_completed', {
      classLevel: newProfile.classLevel,
      goal: newProfile.goal,
    });
    setScene('map');
  }, []);

  /* ── Mission start ──────────────────────────────────────── */
  const handleStartMission = useCallback((missionId: string) => {
    setSelectedMissionId(missionId);
    closeAllOverlays();
    trackEvent('mission_started', { missionId });
    setScene('gameplay');
  }, [closeAllOverlays]);

  /* ── Mission complete ───────────────────────────────────── */
  const handleMissionComplete = useCallback(
    (correctCount: number, hintsUsed: number, timeSpentSeconds: number) => {
      if (!selectedMissionId || !profile) return;

      const mission = getMissionById(selectedMissionId);
      if (!mission) return;

      const totalQuestions = 5;
      const accuracy = Math.round((correctCount / totalQuestions) * 100);
      const xpFromQuestions = correctCount * XP_PER_CORRECT;
      const coinsFromQuestions = correctCount * COINS_PER_CORRECT;
      const totalXP = xpFromQuestions + MISSION_BONUS_XP;
      const totalCoins = coinsFromQuestions + MISSION_BONUS_COINS;

      const isFirstCompletion = !progress.completedMissionIds.includes(selectedMissionId);
      const nextMissionId = getNextMissionId(selectedMissionId);

      const newProgress: Progress = { ...progress };
      newProgress.xp = progress.xp + totalXP;
      newProgress.coins = progress.coins + totalCoins;
      newProgress.level = calculateLevel(newProgress.xp);
      newProgress.totalQuestionsAnswered = progress.totalQuestionsAnswered + totalQuestions;
      newProgress.totalCorrectAnswers = progress.totalCorrectAnswers + correctCount;

      // Topic stats
      const topic = mission.topic;
      const existing = newProgress.topicStats[topic] ?? { attempted: 0, correct: 0 };
      newProgress.topicStats = {
        ...newProgress.topicStats,
        [topic]: {
          attempted: existing.attempted + totalQuestions,
          correct: existing.correct + correctCount,
        },
      };

      // Completion + badge
      if (isFirstCompletion) {
        newProgress.completedMissionIds = [...progress.completedMissionIds, selectedMissionId];
        if (!progress.badges.includes(mission.badge)) {
          newProgress.badges = [...progress.badges, mission.badge];
        }
      }

      // Unlock next
      if (nextMissionId && !newProgress.unlockedMissionIds.includes(nextMissionId)) {
        newProgress.unlockedMissionIds = [...newProgress.unlockedMissionIds, nextMissionId];
      }

      // Mission attempt log
      const prev = progress.missionAttempts[selectedMissionId];
      newProgress.missionAttempts = {
        ...newProgress.missionAttempts,
        [selectedMissionId]: {
          attempts: (prev?.attempts ?? 0) + 1,
          bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
          lastAccuracy: accuracy,
          completedAt: new Date().toISOString(),
          hintsUsed: (prev?.hintsUsed ?? 0) + hintsUsed,
          timeSpentSeconds: (prev?.timeSpentSeconds ?? 0) + timeSpentSeconds,
        },
      };

      // Streak
      const lastPlayed = progress.lastPlayedAt ? new Date(progress.lastPlayedAt) : null;
      if (lastPlayed) {
        const diffDays = Math.floor(
          (Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24)
        );
        newProgress.streak = diffDays === 1 ? progress.streak + 1 : diffDays > 1 ? 1 : progress.streak;
      }
      newProgress.lastPlayedAt = new Date().toISOString();

      setProgress(newProgress);
      saveData({ profile, progress: newProgress });

      trackEvent('mission_completed', {
        missionId: selectedMissionId,
        accuracy,
        correctCount,
        hintsUsed,
        isFirstCompletion,
      });

      setRewardData({
        missionId: selectedMissionId,
        missionTitle: mission.title,
        xpEarned: totalXP,
        coinsEarned: totalCoins,
        accuracy,
        correctAnswers: correctCount,
        totalQuestions,
        badgeUnlocked: mission.badge,
        nextMissionId,
        isFirstCompletion,
      });

      setScene('reward');
    },
    [selectedMissionId, profile, progress]
  );

  /* ── Quit mission ───────────────────────────────────────── */
  const handleQuitMission = useCallback(() => {
    setScene('map');
    setSelectedMissionId(null);
  }, []);

  /* ── Reset progress ─────────────────────────────────────── */
  const handleResetProgress = useCallback(() => {
    clearData();
    setProfile(null);
    setProgress(defaultProgress());
    setSelectedMissionId(null);
    setRewardData(null);
    setShowResetConfirm(false);
    closeAllOverlays();
    setScene('home');
    trackEvent('progress_reset', {});
  }, [closeAllOverlays]);

  /* ── Questions for current mission ─────────────────────── */
  const questionsForMission = selectedMissionId
    ? getQuestionsByIds(getMissionById(selectedMissionId)?.questionIds ?? [])
    : [];

  return (
    <>
      {/* Portrait mobile rotate overlay — shown/hidden via CSS media query */}
      <RotateDeviceOverlay />

      {/* Main 16:9 game stage — hidden on portrait mobile via CSS */}
      <GameStage>
        {/* Toast system lives inside game stage */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* ── HOME ──────────────────────────────────────────── */}
        {scene === 'home' && (
          <HomeScreen
            onStart={handleStart}
            onContinue={handleContinue}
            hasSavedProgress={hasExistingProgress()}
          />
        )}

        {/* ── ONBOARDING ────────────────────────────────────── */}
        {scene === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}

        {/* ── MAP ───────────────────────────────────────────── */}
        {scene === 'map' && profile && (
          <MapScene
            profile={profile}
            progress={progress}
            onStartMission={handleStartMission}
            onShowToast={showToast}
            onOpenDashboard={() => { closeAllOverlays(); setShowDashboard(true); }}
            onOpenReport={() => { closeAllOverlays(); setShowReport(true); }}
            onOpenProfile={() => { closeAllOverlays(); setShowProfile(true); }}
          />
        )}

        {/* ── GAMEPLAY ──────────────────────────────────────── */}
        {scene === 'gameplay' && selectedMissionId && questionsForMission.length > 0 && (
          <GameplayScene
            missionId={selectedMissionId}
            questions={questionsForMission}
            onMissionComplete={handleMissionComplete}
            onQuit={handleQuitMission}
          />
        )}

        {/* ── REWARD ────────────────────────────────────────── */}
        {scene === 'reward' && rewardData && (
          <RewardScene
            rewardData={rewardData}
            onContinueMap={() => {
              setScene('map');
              setRewardData(null);
            }}
            onViewDashboard={() => {
              setScene('map');
              setRewardData(null);
              setShowDashboard(true);
            }}
          />
        )}

        {/* ── OVERLAYS (on top of map) ───────────────────────── */}
        {showDashboard && profile && (
          <DashboardOverlay
            profile={profile}
            progress={progress}
            onClose={() => setShowDashboard(false)}
            onNavigateReport={() => {
              setShowDashboard(false);
              setShowReport(true);
            }}
          />
        )}

        {showReport && profile && (
          <ProgressReportOverlay
            profile={profile}
            progress={progress}
            onClose={() => setShowReport(false)}
          />
        )}

        {showProfile && profile && (
          <ProfileOverlay
            profile={profile}
            progress={progress}
            onClose={() => setShowProfile(false)}
            onReset={() => {
              setShowProfile(false);
              setShowResetConfirm(true);
            }}
          />
        )}

        {/* ── RESET CONFIRM ─────────────────────────────────── */}
        <ConfirmModal
          isOpen={showResetConfirm}
          title="Start Over? 🔄"
          message="This will erase all your stars, coins and badges. Are you sure you want to start again?"
          confirmText="Yes, start over"
          cancelText="Keep my progress! 🏅"
          variant="danger"
          onConfirm={handleResetProgress}
          onCancel={() => setShowResetConfirm(false)}
        />
      </GameStage>
    </>
  );
}
