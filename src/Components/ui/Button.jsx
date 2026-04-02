import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component with variant support.
 * Variants: primary | secondary | danger | ghost
 * Sizes: sm | md | lg
 */
const VARIANT_CLASSES = {
  primary:
    'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-600/30',
  secondary:
    'bg-surface-700 hover:bg-surface-600 text-surface-100 border border-surface-600 hover:border-surface-500',
  danger:
    'bg-danger-600 hover:bg-danger-500 text-white shadow-lg shadow-danger-600/20',
  ghost:
    'bg-transparent hover:bg-surface-800 text-surface-300 hover:text-surface-100',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-200 ease-out cursor-pointer
        focus-ring disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
