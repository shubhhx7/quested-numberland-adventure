import React, { useState, useRef, useMemo, useCallback } from 'react';
import type { Question } from '../types';
import { assets } from '../utils/assets';
import { getMissionById } from '../data/missions';
import {
  getCorrectMessages,
  getWrongMessages,
  randomMessage,
  XP_PER_CORRECT,
  COINS_PER_CORRECT,
} from '../utils/gameLogic';
import { trackEvent } from '../utils/analytics';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/sounds';
import SoundToggle from './SoundToggle';
import ConfirmModal from './ConfirmModal';

interface Props {
  missionId: string;
  questions: Question[];
  onMissionComplete: (correctCount: number, hintsUsed: number, timeSpentSeconds: number) => void;
  onQuit: () => void;
}

// Q-Buddy hint lines per topic (rendered in speech bubble)
const HINT_LINES: Record<string, string> = {
  Counting: "Let's count! Touch each one!",
  Numbers:  'Look carefully at the numbers!',
  Addition: 'Start at the first number!',
  Shapes:   'Count the sides and corners!',
  Patterns: 'Look for what keeps repeating!',
  Animals:  'Think about this animal!',
  Mixed:    "Think it through — you've got this!",
};

const GameplayScene: React.FC<Props> = ({ missionId, questions, onMissionComplete, onQuit }) => {
  // ── Game state — unchanged ────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex]       = useState(0);
  const [selectedOption, setSelectedOption]   = useState<string | null>(null);
  const [submitted, setSubmitted]             = useState(false);
  const [correctCount, setCorrectCount]       = useState(0);
  const [hintsUsed, setHintsUsed]             = useState(0);
  const [visibleHintIdx, setVisibleHintIdx]   = useState(-1);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [pendingXP, setPendingXP]             = useState(0);
  const [pendingCoins, setPendingCoins]       = useState(0);
  const [feedbackMsg, setFeedbackMsg]         = useState('');
  const [charErr, setCharErr]                 = useState(false);
  const [showXPPop, setShowXPPop]             = useState(false);

  const startTimeRef = useRef(Date.now());
  const q        = questions[currentIndex];
  const mission  = useMemo(() => getMissionById(missionId), [missionId]);
  const isCorrect = submitted && selectedOption === q.correctAnswer;
  const isLast    = currentIndex === questions.length - 1;

  // Speech bubble state class and text
  const bubbleStateClass = submitted ? (isCorrect ? 'correct' : 'wrong') : '';
  const bubbleText = useMemo(() => {
    if (submitted) return feedbackMsg;
    if (visibleHintIdx >= 0 && q.hints[visibleHintIdx]) return `💡 ${q.hints[visibleHintIdx]}`;
    return HINT_LINES[q.topic] ?? HINT_LINES.Mixed;
  }, [submitted, feedbackMsg, visibleHintIdx, q]);

  // ── Game handlers — unchanged ─────────────────────────────────────────────
  const handleOptionSelect = useCallback((opt: string) => {
    if (submitted) return;
    setSelectedOption(opt);
    playClickSound();
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (!selectedOption || submitted) return;
    const correct = selectedOption === q.correctAnswer;
    setSubmitted(true);
    if (correct) {
      setCorrectCount(c => c + 1);
      setPendingXP(x => x + XP_PER_CORRECT);
      setPendingCoins(c => c + COINS_PER_CORRECT);
      setFeedbackMsg(randomMessage(getCorrectMessages()));
      setShowXPPop(true);
      playCorrectSound();
      setTimeout(() => setShowXPPop(false), 1800);
    } else {
      setFeedbackMsg(randomMessage(getWrongMessages()));
      playWrongSound();
    }
    trackEvent('answer_submitted', { missionId, questionId: q.id, correct });
  }, [selectedOption, submitted, q, missionId]);

  const handleNext = useCallback(() => {
    setCurrentIndex(i => i + 1);
    setSelectedOption(null);
    setSubmitted(false);
    setVisibleHintIdx(-1);
    setFeedbackMsg('');
    setShowXPPop(false);
    playClickSound();
  }, []);

  const handleComplete = useCallback(() => {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    onMissionComplete(correctCount, hintsUsed, elapsed);
  }, [correctCount, hintsUsed, onMissionComplete]);

  const handleHint = useCallback(() => {
    const next = visibleHintIdx + 1;
    if (next < q.hints.length) {
      setVisibleHintIdx(next);
      setHintsUsed(h => h + 1);
      playClickSound();
    }
  }, [visibleHintIdx, q.hints.length]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="gameplay-screen">
      <div className="qs-stage">

        {/* ── QNBG background image ── */}
        <img src={assets.qnbg} alt="" className="qs-bg-img" aria-hidden="true" />
        {/* ── Overlay tint + atmospheric effects ── */}
        <div className="qs-fantasy-bg" aria-hidden="true">
          <div className="qfx-vignette" />
        </div>

        {/* ── TOP HUD ── */}
        <div className="qs-hud">
          <div className="qs-hud-left">
            <button className="qs-back-btn" onClick={() => setShowQuitConfirm(true)} aria-label="Menu">☰</button>
            <div className="qs-logo-block">
              <span className="qs-logo-title">QuestED</span>
              <span className="qs-logo-sub">Numberland Adventure</span>
            </div>
            <button className="qs-map-btn" onClick={() => setShowQuitConfirm(true)} aria-label="Back to map">🗺️</button>
          </div>
          <div className="qs-mission-center">
            <div className="qs-mission-name">🏆 {mission?.title ?? 'Quest'}</div>
            <div className="qs-mission-sub">Level {currentIndex + 1} of {questions.length}</div>
            <div className="qs-dots">
              {questions.map((_, i) => {
                const done = i < currentIndex || (i === currentIndex && submitted && isCorrect);
                const cur  = i === currentIndex;
                return <div key={i} className={`qs-dot${done ? ' qs-dot-done' : cur ? ' qs-dot-cur' : ''}`} />;
              })}
            </div>
          </div>
          <div className="qs-stats">
            <span className="qs-stat">⚡ {pendingXP}</span>
            <span className="qs-stat">🪙 {pendingCoins}</span>
            <SoundToggle style={{ width: 'clamp(20px,3.2vmin,28px)', height: 'clamp(20px,3.2vmin,28px)', borderRadius: '50%', background: 'rgba(25,15,60,0.75)', border: '1.5px solid rgba(140,100,255,0.35)', fontSize: '0.78rem' }} />
          </div>
        </div>

        {/* ── MAIN 3-COLUMN LAYOUT ── */}
        <div className="qs-main">

          {/* ── LEFT: Bubble + Owl ── */}
          <div className="qs-owl-col">
            <div className={`qs-bubble${bubbleStateClass ? ` ${bubbleStateClass}` : ''}`}>
              <div className="qs-bubble-inner">
                {submitted && (
                  <div className="qs-bubble-header">
                    {isCorrect ? '🌟 Awesome!' : "💪 Try again!"}
                  </div>
                )}
                <p className="qs-bubble-text">
                  {!submitted && <span style={{ marginRight: 2 }}>🦉</span>}
                  {bubbleText}
                </p>
                {!submitted && visibleHintIdx < q.hints.length - 1 && (
                  <button onClick={handleHint} className="qs-hint-btn">
                    💡 {visibleHintIdx === -1 ? 'Get Hint!' : 'Next Hint →'}
                  </button>
                )}
              </div>
              <div className="qs-bubble-tail" />
            </div>
            {charErr ? (
              <div className="qs-owl-emoji float-anim">🦉</div>
            ) : (
              <img
                src={assets.character}
                alt="Q-Buddy"
                className={`qs-owl float-anim${isCorrect ? ' owl-correct' : submitted && !isCorrect ? ' owl-wrong' : ''}`}
                onError={() => setCharErr(true)}
              />
            )}
            <div className="qs-owl-pedestal" aria-hidden="true" />
          </div>

          {/* ── CENTER: Topic + Parchment card + Answers + CTA ── */}
          <div className="qs-quiz-col">
            <span className="qs-topic-badge">✦ {q.topic}</span>

            <div className="qs-parchment-card">
              <span className="qpc-corner qpc-tl" aria-hidden="true">❋</span>
              <span className="qpc-corner qpc-tr" aria-hidden="true">❋</span>
              <span className="qpc-corner qpc-bl" aria-hidden="true">❋</span>
              <span className="qpc-corner qpc-br" aria-hidden="true">❋</span>
              <div className="qs-parchment-inner">
                <p className="qs-question-text">{q.question}</p>
              </div>
            </div>

            <div className="qs-answer-grid">
              {q.options.map((opt) => {
                const isSel    = selectedOption === opt;
                const isCorr   = submitted && opt === q.correctAnswer;
                const isWrng   = submitted && isSel && opt !== q.correctAnswer;
                const isDimmed = submitted && !isCorr && !isWrng;
                const btnClass = [
                  'qs-answer-btn',
                  isSel && !submitted ? 'q-selected' : '',
                  isCorr              ? 'q-correct'  : '',
                  isWrng              ? 'q-wrong wrongShakeAnim' : '',
                  isDimmed            ? 'q-dimmed'   : '',
                ].filter(Boolean).join(' ');
                return (
                  <button key={opt} disabled={submitted} onClick={() => handleOptionSelect(opt)} className={btnClass}>
                    <span className="qs-btn-text">{opt}</span>
                    {(isCorr || isWrng) && <span className="qs-btn-badge">{isCorr ? '✅' : '❌'}</span>}
                    {isCorr && ['✨','⭐','✨'].map((s, si) => (
                      <span key={si} className="qs-sparkle" style={{
                        top:              si === 0 ? '10%' : si === 1 ? '50%' : '72%',
                        right:            si === 0 ? '20%' : si === 1 ? '40%' : '14%',
                        animationDelay:   `${si * 0.12}s`,
                        animationDuration:`${1 + si * 0.2}s`,
                      }}>{s}</span>
                    ))}
                  </button>
                );
              })}
            </div>

            {submitted && !isCorrect && (
              <div className="qs-wrong-strip slide-up-enter">
                <div className="qs-wrong-ans">✅ Right answer: <strong>{q.correctAnswer}</strong></div>
                {q.explanation && <div className="qs-wrong-exp">{q.explanation}</div>}
              </div>
            )}

            <div style={{ flex: 1 }} />

            {!submitted ? (
              <button onClick={handleSubmit} disabled={!selectedOption} className={`qs-cta-btn${!selectedOption ? ' nq-disabled' : ' cta-btn-bounce'}`}>
                {selectedOption ? '✅ Check My Answer!' : '👆 Tap an answer first!'}
              </button>
            ) : isLast ? (
              <button onClick={handleComplete} className="qs-cta-btn nq-reward cta-btn-bounce">🎁 Claim Reward!</button>
            ) : (
              <button onClick={handleNext} className="qs-cta-btn cta-btn-bounce">📖 Next Question →</button>
            )}
          </div>

          {/* ── RIGHT: Quest progress panel ── */}
          <div className="qs-progress-col">
            <div className="qs-progress-card">
              <div className="qs-progress-title">Your Quest</div>
              <div className="qs-progress-label">
                {Math.min(currentIndex + (submitted ? 1 : 0), questions.length)}/{questions.length}
              </div>
              <div className="qs-progress-circles">
                <div className="qs-progress-line" />
                {questions.map((_, i) => {
                  const done = i < currentIndex || (i === currentIndex && submitted && isCorrect);
                  const cur  = i === currentIndex;
                  return (
                    <div key={i} className={`qs-p-circle${done ? ' qspc-done' : cur ? ' qspc-cur' : ''}`}>
                      {done ? '✓' : i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>{/* end .qs-main */}

        {showXPPop && <div className="qs-xp-pop">+{XP_PER_CORRECT} ⚡</div>}

      </div>{/* end .qs-stage */}

      <ConfirmModal
        isOpen={showQuitConfirm}
        title="Going already? 🐾"
        message="Are you sure? Your progress on this mission will be lost."
        confirmText="Yes, go back"
        cancelText="Keep Playing! 🎮"
        variant="danger"
        onConfirm={onQuit}
        onCancel={() => setShowQuitConfirm(false)}
      />
    </div>
  );
};

export default GameplayScene;
