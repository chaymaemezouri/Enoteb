'use client';

import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="admin-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="admin-modal__title">
          {title}
        </h2>
        <p className="admin-modal__message">{message}</p>
        <div className="admin-modal__actions">
          <button
            ref={cancelRef}
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={variant === 'danger' ? 'admin-btn admin-btn--danger' : 'admin-btn admin-btn--primary'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Veuillez patienter…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
