import React, { useMemo } from 'react';
import type { Question } from '../types';
import { getCorrectMessages, getWrongMessages, randomMessage } from '../utils/gameLogic';

interface ExplanationPanelProps {
  question: Question;
  selectedAnswer: string;
  isCorrect: boolean;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  question,
  selectedAnswer: _selectedAnswer,
  isCorrect,
}) => {
  // Pick a random encouragement message once on mount
  const encouragement = useMemo(() => {
    return isCorrect
      ? randomMessage(getCorrectMessages())
      : randomMessage(getWrongMessages());
  }, [isCorrect]);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg"
      style={{ border: isCorrect ? '1.5px solid #6EE7B7' : '1.5px solid #FCA5A5' }}
      role="region"
      aria-label={isCorrect ? 'Correct answer explanation' : 'Wrong answer explanation'}
    >
      {/* Status banner */}
      <div
        className={`px-5 py-3 flex items-center gap-2 ${
          isCorrect ? 'gradient-success' : 'gradient-danger'
        }`}
      >
        <span className="text-xl leading-none">
          {isCorrect ? '✓' : '✗'}
        </span>
        <span className="text-white font-black text-base text-shadow">
          {isCorrect ? 'Correct!' : 'Not quite!'}
        </span>
        <span className="ml-auto text-white/90 text-sm font-medium italic">
          {encouragement}
        </span>
      </div>

      <div className="bg-white px-5 py-4 flex flex-col gap-4">
        {/* Correct answer row */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-2"
          style={{
            background: '#E8FAF1',
            border: '1.5px solid #6EE7B7',
          }}
        >
          <span className="text-green-600 font-bold text-sm mt-0.5 flex-shrink-0">✓</span>
          <div>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-0.5">
              Correct Answer
            </p>
            <p className="text-gray-900 font-bold text-sm leading-snug">
              {question.correctAnswer}
            </p>
          </div>
        </div>

        {/* Why / Explanation section */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">🧠</span>
            <h3 className="text-sm font-bold text-gray-800">Why?</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {question.explanation}
          </p>
        </div>

        {/* Topic tag chip */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Topic:</span>
          <span
            className="chip text-xs px-3 py-1 font-semibold"
            style={{
              background: '#EDE0FF',
              color: '#7B3FF2',
            }}
          >
            {question.topic}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExplanationPanel;
