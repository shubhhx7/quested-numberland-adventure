import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { ToastMessage } from '../types';

// ─── Toast type helpers ────────────────────────────────────────────────────────

export type ToastType = ToastMessage['type'];

function borderColor(type: ToastType): string {
  switch (type) {
    case 'success': return '#2ecc71';
    case 'error':   return '#ff6b4a';
    case 'info':    return '#45b7ff';
    case 'warning': return '#ffc857';
  }
}

function toastIcon(type: ToastType): string {
  switch (type) {
    case 'success': return '✓';
    case 'error':   return '✕';
    case 'info':    return 'ℹ';
    case 'warning': return '⚠';
  }
}

// ─── ToastItem ────────────────────────────────────────────────────────────────

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleRemove = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 280);
  }, [leaving, toast.id, onRemove]);

  const color = borderColor(toast.type);

  return (
    <div
      className="toast-item"
      role="alert"
      aria-live="assertive"
      onClick={handleRemove}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(10,12,40,0.9)',
        borderLeft: `4px solid ${color}`,
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '0.82rem',
        color: 'white',
        cursor: 'pointer',
        width: '100%',
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 0.28s ease, transform 0.28s ease',
        boxSizing: 'border-box',
      }}
    >
      {/* Colored type badge */}
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: toast.type === 'warning' ? '#3d1f00' : 'white',
        }}
      >
        {toastIcon(toast.type)}
      </span>

      {/* Message */}
      <span style={{ flex: 1, lineHeight: 1.4, fontWeight: 600 }}>
        {toast.message}
      </span>

      {/* Dismiss button */}
      <button
        aria-label="Dismiss notification"
        onClick={(e) => { e.stopPropagation(); handleRemove(); }}
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.55)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          lineHeight: 1,
          padding: '2px 4px',
          borderRadius: '4px',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'white';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
        }}
      >
        ✕
      </button>
    </div>
  );
};

// ─── ToastContainer ───────────────────────────────────────────────────────────

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// ─── useToast hook ─────────────────────────────────────────────────────────────

interface UseToastReturn {
  toasts: ToastMessage[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType, duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastMessage = { id, message, type };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Keep at most 4; drop the oldest ones
        return updated.length > 4 ? updated.slice(updated.length - 4) : updated;
      });

      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);

      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  // Clear all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return { toasts, showToast, removeToast };
}

export default ToastContainer;
