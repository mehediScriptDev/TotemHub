import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

/**
 * Confirmation dialog for destructive actions (built on top of Modal pattern).
 * Used inline rather than via Modal to keep it lightweight.
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl animate-slide-up p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-danger-600/15 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-danger-500" />
          </div>
          <h3 className="text-lg font-semibold text-surface-100 mb-2">{title}</h3>
          <p className="text-sm text-surface-400 mb-6">{message}</p>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant}
              size="md"
              className="flex-1"
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
