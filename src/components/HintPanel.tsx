import React, { useEffect } from 'react';
import type { Question } from '../types';
import { assets } from '../utils/assets';

interface HintPanelProps {
  question: Question;
  visibleHintCount: number;
  onShowNextHint: () => void;
  onClose: () => void;
}

const HintPanel: React.FC<HintPanelProps> = ({
  question,
  visibleHintCount,
  onShowNextHint,
  onClose,
}) => {
  const currentHint = question.hints[visibleHintCount - 1] ?? '';
  const hasMoreHints = visibleHintCount < question.hints.length;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(22, 33, 62, 0.55)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Q-Buddy's Hint"
      >
        <div
          className="w-full rounded-t-3xl bg-white shadow-2xl overflow-hidden"
          style={{
            maxWidth: 480,
            animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Purple accent line at the top of the panel */}
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, #7B3FF2, #45B7FF)' }}
          />

          {/* Drag handle indicator */}
          <div className="flex justify-center pt-2 pb-0">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          <div className="px-5 pt-3 pb-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <h2 className="text-base font-bold text-gray-900">Q-Buddy's Hint</h2>
              </div>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
                onClick={onClose}
                aria-label="Close hint panel"
              >
                <span className="text-gray-600 text-base font-bold leading-none">✕</span>
              </button>
            </div>

            {/* Q-Buddy section */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0">
                <img
                  src={assets.character}
                  alt="Q-Buddy"
                  className="rounded-full object-cover"
                  style={{ width: 48, height: 48 }}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  className="rounded-full items-center justify-center text-2xl"
                  style={{
                    width: 48,
                    height: 48,
                    display: 'none',
                    background: 'linear-gradient(135deg, #7B3FF2, #45B7FF)',
                  }}
                >
                  🤖
                </div>
              </div>
              <span className="text-sm font-semibold text-purple-700">Q-Buddy says:</span>
            </div>

            {/* Hint text card */}
            <div
              className="rounded-2xl p-4 mb-4"
              style={{
                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                border: '1.5px solid #BFDBFE',
              }}
            >
              <p className="text-gray-800 text-sm leading-relaxed font-medium">
                {currentHint}
              </p>
            </div>

            {/* More hints or all-done message */}
            {hasMoreHints ? (
              <div className="flex items-center justify-between gap-3 mb-4">
                <button
                  className="btn-secondary flex-1 py-2.5 text-sm"
                  onClick={onShowNextHint}
                >
                  Show next hint →
                </button>
                <span className="text-xs font-semibold text-gray-500 whitespace-nowrap flex-shrink-0">
                  Hint {visibleHintCount}/{question.hints.length}
                </span>
              </div>
            ) : (
              <div
                className="rounded-xl px-4 py-3 mb-4 flex items-center gap-2"
                style={{
                  background: '#E8FAF1',
                  border: '1.5px solid #6EE7B7',
                }}
              >
                <span className="text-lg">✅</span>
                <p className="text-sm font-semibold text-green-700">
                  That's all the hints I have! Try now.
                </p>
              </div>
            )}

            {/* Footer note */}
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              💡 Try solving after each hint — hints help you learn!
            </p>
          </div>
        </div>
      </div>

      {/* Slide-up keyframe injected inline so it works without extra CSS */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default HintPanel;
