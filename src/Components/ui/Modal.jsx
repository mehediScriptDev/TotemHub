import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Modal component with overlay, close button, and animated entry.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  tone = 'dark',
  className = '',
}) => {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  const isLight = tone === 'light';

  const contentToneClasses = isLight
    ? 'bg-white border border-surface-200 shadow-2xl shadow-black/12'
    : 'bg-surface-900 border border-surface-700/50 shadow-2xl shadow-black/50';

  const headerBorderClasses = isLight ? 'border-surface-200' : 'border-surface-700/50';
  const titleClasses = isLight ? 'text-surface-900' : 'text-surface-100';
  const closeBtnClasses = isLight
    ? 'p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-surface-900 transition-colors cursor-pointer'
    : 'p-1.5 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors cursor-pointer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]}
          rounded-2xl
          ${contentToneClasses}
          animate-slide-up
          ${className}
        `}
      >
        {/* Header */}
        {title && (
          <div className={`flex items-center justify-between px-6 py-4 border-b ${headerBorderClasses}`}>
            <h3 className={`text-lg font-semibold ${titleClasses}`}>{title}</h3>
            <button
              onClick={onClose}
              className={closeBtnClasses}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${headerBorderClasses}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
