import React, { useState } from 'react';
import type { Profile, Progress, Topic } from '../types';
import { missions } from '../data/missions';
import {
  calculateLevel,
  getTopicAccuracy,
  getStrongTopics,
  getWeakTopics,
  getOverallAccuracy,
  getLearningStatus,
} from '../utils/gameLogic';
import { trackEvent } from '../utils/analytics';

interface Props {
  profile: Profile;
  progress: Progress;
  onClose: () => void;
}

const TOPICS: Topic[] = ['Counting', 'Numbers', 'Addition', 'Shapes', 'Patterns', 'Animals', 'Mixed'];

function statusColor(status: string): string {
  switch (status) {
    case 'Getting Started': return 'rgba(255,255,255,0.25)';
    case 'Building Momentum': return '#2633A6';
    case 'Progressing Well': return '#2ECC71';
    case 'Numberland Champion': return '#FFC857';
    default: return 'rgba(255,255,255,0.25)';
  }
}

function topicBarColor(acc: number, attempted: number): string {
  if (attempted === 0) return 'rgba(255,255,255,0.15)';
  if (acc >= 75) return '#2ECC71';
  if (acc >= 60) return '#ff9f1c';
  return '#FF6B4A';
}

const ProgressReportOverlay: React.FC<Props> = ({ profile, progress, onClose }) => {
  const [copied, setCopied] = useState(false);

  const completedCount = progress.completedMissionIds.length;
  const level = calculateLevel(progress.xp);
  const overallAccuracy = getOverallAccuracy(progress);
  const strongTopics = getStrongTopics(progress.topicStats);
  const weakTopics = getWeakTopics(progress.topicStats);
  const learningStatus = getLearningStatus(completedCount);
  const statusClr = statusColor(learningStatus);

  const earnedBadges = progress.badges.slice(0, 3);

  const weakestTopicLabel = weakTopics.length > 0 ? weakTopics[0] : null;
  const strongestTopicLabel = strongTopics.length > 0 ? strongTopics[0] : null;

  const summaryText = `${profile.name} has completed ${completedCount} of 8 QuestED missions with ${overallAccuracy}% accuracy. Strongest topic: ${strongestTopicLabel || 'None yet'}. Recommended revision: ${weakestTopicLabel || 'All topics strong'}. Status: ${learningStatus}.`;

  function handleCopy() {
    navigator.clipboard.writeText(summaryText).then(() => {
      trackEvent('progress_report_copied', {});
      setCopied(true);
      window.alert('Summary copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const createdDate = new Date(profile.createdAt).toLocaleDateString();

  return (
    <div className="overlay-panel">
      <div className="overlay-bg" onClick={onClose} />
      <div
        className="overlay-card"
        style={{ maxWidth: '780px', width: '90%', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '12px',
            marginBottom: '14px',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>📋 Progress Report</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginTop: '2px' }}>
              Learning snapshot for parents &amp; teachers
            </div>
          </div>
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
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* BODY — 3 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* COL 1 — Student & Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '2rem', lineHeight: 1 }}>{profile.avatar}</div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{profile.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
                Class {profile.classLevel}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
                Goal: {profile.goal}
              </div>
            </div>

            {/* Status badge */}
            <div
              style={{
                background: statusClr,
                borderRadius: '8px',
                padding: '8px 10px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>{learningStatus}</div>
            </div>

            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
              Member since: {createdDate}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
              Time estimate: {completedCount * 8} min approx.
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>
              Level {level} · {progress.xp} XP
            </div>
          </div>

          {/* COL 2 — Key Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Key Metrics
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                flex: 1,
              }}
            >
              {[
                { label: 'Missions', value: `${completedCount}/8` },
                { label: 'Completion', value: `${Math.round((completedCount / 8) * 100)}%` },
                { label: 'Accuracy', value: `${overallAccuracy}%` },
                { label: 'Total XP', value: String(progress.xp) },
                { label: 'Coins', value: String(progress.coins) },
                { label: 'Streak', value: `${progress.streak} days` },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{item.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.62rem' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* COL 3 — Topic Performance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Topic Performance
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {TOPICS.map((topic) => {
                const attempted = progress.topicStats[topic]?.attempted ?? 0;
                const acc = getTopicAccuracy(progress.topicStats, topic);
                const isStrong = attempted > 0 && acc >= 75;
                const isWeak = attempted > 0 && acc < 60;

                return (
                  <div key={topic}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '3px',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        {isStrong ? '💪' : isWeak ? '📚' : ''}
                        <span
                          style={{
                            color: isStrong ? '#2ECC71' : isWeak ? '#ff9f1c' : 'rgba(255,255,255,0.8)',
                          }}
                        >
                          {topic}
                        </span>
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                        {attempted === 0 ? '—' : `${acc}%`}
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: '4px' }}>
                      {attempted > 0 && (
                        <div
                          className="progress-fill"
                          style={{ width: `${acc}%`, background: topicBarColor(acc, attempted) }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '14px',
            paddingTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          {/* Earned badges row */}
          {earnedBadges.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Badges:</span>
              {earnedBadges.map((badge) => (
                <span
                  key={badge}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.65rem',
                    background: 'rgba(255,200,87,0.15)',
                    border: '1px solid rgba(255,200,87,0.4)',
                    color: '#FFC857',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Recommendation */}
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
            Recommended:{' '}
            <span style={{ color: 'white', fontWeight: 600 }}>
              {weakestTopicLabel ? weakestTopicLabel : 'All topics strong! 🌟'}
            </span>
          </div>

          {/* Copy button */}
          <button
            className="btn-game btn-primary-game"
            onClick={handleCopy}
            style={{ width: '100%', padding: '10px 0', fontSize: '0.9rem' }}
          >
            {copied ? '✓ Copied!' : 'Copy Summary'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressReportOverlay;
