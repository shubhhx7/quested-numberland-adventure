import React, { useEffect, useCallback } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const confirmBtnClass =
    variant === 'danger'
      ? 'btn-game btn-danger-game'
      : 'btn-game btn-gold-game';

  return (
    /* Overlay — sits inside game-stage (position: absolute keeps it clipped) */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,12,40,0.8)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1f4e',
          border: '1px solid rgba(123,63,242,0.4)',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '420px',
          width: '88%',
          color: 'white',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Title */}
        <h2
          id="confirm-modal-title"
          style={{
            margin: '0 0 8px 0',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="confirm-modal-message"
          style={{
            margin: '0 0 24px 0',
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

        {/* Button row */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          {/* Cancel */}
          <button
            className="btn-game btn-ghost-game"
            onClick={onCancel}
            autoFocus
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '0.875rem',
            }}
          >
            {cancelText}
          </button>

          {/* Confirm */}
          <button
            className={confirmBtnClass}
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '0.875rem',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
