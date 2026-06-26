import React, { useEffect } from 'react';
import type { Profile, Progress, Topic } from '../types';
import { missions, getMissionById } from '../data/missions';
import {
  calculateLevel,
  xpToNextLevel,
  getTopicAccuracy,
  getWeakTopics,
  getOverallAccuracy,
} from '../utils/gameLogic';
import { trackEvent } from '../utils/analytics';

interface Props {
  profile: Profile;
  progress: Progress;
  onClose: () => void;
  onNavigateReport: () => void;
}

const TOPICS: Topic[] = ['Counting', 'Numbers', 'Addition', 'Shapes', 'Patterns', 'Animals', 'Mixed'];

function topicBarColor(acc: number, attempted: number): string {
  if (attempted === 0) return 'rgba(255,255,255,0.15)';
  if (acc >= 75) return '#2ECC71';
  if (acc >= 60) return '#ff9f1c';
  return '#FF6B4A';
}

const DashboardOverlay: React.FC<Props> = ({ profile, progress, onClose, onNavigateReport }) => {
  const completedCount = progress.completedMissionIds.length;
  const level = calculateLevel(progress.xp);
  const xpData = xpToNextLevel(progress.xp);
  const overallAccuracy = getOverallAccuracy(progress);
  const weakTopics = getWeakTopics(progress.topicStats);

  useEffect(() => {
    trackEvent('dashboard_viewed', { missionCount: completedCount });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Recommendation logic
  let recommendation = '🏆 You\'ve mastered Numberland!';
  if (weakTopics.length > 0) {
    const weakTopic = weakTopics[0];
    const relatedMission = missions.find((m) => m.topic === weakTopic);
    recommendation = `Strengthen ${weakTopic}${relatedMission ? ` — try ${relatedMission.title}` : ''}`;
  } else {
    const nextUnlocked = missions.find(
      (m) =>
        progress.unlockedMissionIds.includes(m.id) &&
        !progress.completedMissionIds.includes(m.id)
    );
    if (nextUnlocked) {
      recommendation = `Continue your adventure with ${nextUnlocked.title}`;
    }
  }

  return (
    <div className="overlay-panel">
      <div className="overlay-bg" onClick={onClose} />
      <div
        className="overlay-card"
        style={{ maxWidth: '860px', width: '92%', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '12px',
            marginBottom: '16px',
            flexShrink: 0,
          }}
        >
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.3rem' }}>📊 Dashboard</span>
          <span style={{ color: '#FFC857', fontSize: '0.8rem', fontWeight: 600 }}>
            Lv.{level} &nbsp;·&nbsp; {profile.name}
          </span>
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
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
            {/* XP/Level card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                <span style={{ color: '#FFC857', fontWeight: 800, fontSize: '1.6rem' }}>{level}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>/ 5 max</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginLeft: 'auto' }}>
                  Level {level}
                </span>
              </div>
              <div className="progress-track" style={{ height: '6px', marginBottom: '6px' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${xpData.percent}%`, background: '#FFC857' }}
                />
              </div>
              <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>
                ⚡ {progress.xp} XP · {xpData.current}/{xpData.needed} to next
              </span>
            </div>

            {/* Stats 2x2 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              {[
                { icon: '🏆', label: 'Missions', value: `${completedCount}/8` },
                { icon: '🎯', label: 'Accuracy', value: `${overallAccuracy}%` },
                { icon: '🪙', label: 'Coins', value: String(progress.coins) },
                { icon: '🔥', label: 'Streak', value: String(progress.streak) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ fontSize: '1rem', marginBottom: '2px' }}>{stat.icon}</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{stat.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Topic Mastery */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <div
                style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '8px',
                }}
              >
                Topic Mastery
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {TOPICS.map((topic) => {
                  const acc = getTopicAccuracy(progress.topicStats, topic);
                  const attempted = progress.topicStats[topic]?.attempted ?? 0;
                  return (
                    <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', width: '80px', flexShrink: 0 }}>
                        {topic}
                      </span>
                      <div className="progress-track" style={{ flex: 1, height: '5px' }}>
                        {attempted > 0 && (
                          <div
                            className="progress-fill"
                            style={{ width: `${acc}%`, background: topicBarColor(acc, attempted) }}
                          />
                        )}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', width: '28px', textAlign: 'right' }}>
                        {attempted === 0 ? '—' : `${acc}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
            {/* Badges */}
            <div>
              <div
                style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '8px',
                }}
              >
                🏅 Badges ({progress.badges.length}/{missions.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {missions.map((mission) => {
                  const earned = progress.badges.includes(mission.badge);
                  return (
                    <span
                      key={mission.id}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '0.68rem',
                        background: earned ? 'rgba(255,200,87,0.15)' : 'rgba(255,255,255,0.06)',
                        border: earned
                          ? '1px solid rgba(255,200,87,0.4)'
                          : '1px solid rgba(255,255,255,0.1)',
                        color: earned ? '#FFC857' : 'rgba(255,255,255,0.35)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {earned ? mission.badge : '???'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Recommendation */}
            <div
              style={{
                background: 'rgba(123,63,242,0.15)',
                border: '1px solid rgba(123,63,242,0.3)',
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '0.65rem',
                  color: '#7B3FF2',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '6px',
                  fontWeight: 700,
                }}
              >
                💡 Recommended
              </div>
              <div style={{ color: 'white', fontSize: '0.85rem', lineHeight: 1.4 }}>
                {recommendation}
              </div>
            </div>

            {/* Kingdom progress */}
            <div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                Kingdom Progress: {completedCount}/8 ({Math.round((completedCount / 8) * 100)}%)
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${Math.round((completedCount / 8) * 100)}%`, background: '#7B3FF2' }}
                />
              </div>
            </div>

            {/* Spacer + View Report */}
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-game btn-ghost-game"
                onClick={onNavigateReport}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                View Report →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverlay;
