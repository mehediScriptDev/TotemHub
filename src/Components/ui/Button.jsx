import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Premium Button component with dark-mode optimized variants.
 * Variants: primary | secondary | danger | ghost | outline
 */
const VARIANT_CLASSES = {
  primary:
    'bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-500/10 hover:shadow-brand-500/20',
  secondary:
    'bg-surface-200 hover:bg-surface-300 text-white/90 border border-surface-300/50',
  danger:
    'bg-danger-500/10 hover:bg-danger-500 text-danger-500 hover:text-white border border-danger-500/20 shadow-lg shadow-danger-500/5',
  ghost:
    'bg-transparent hover:bg-surface-200/50 text-surface-400 hover:text-white',
  outline:
    'bg-transparent border border-surface-200 text-surface-400 hover:border-brand-500 hover:text-white shadow-sm',
};

const SIZE_CLASSES = {
  sm: 'px-4 py-2 text-[10px] font-black uppercase tracking-widest gap-2',
  md: 'px-6 py-3 text-[11px] font-black uppercase tracking-[0.15em] gap-3',
  lg: 'px-10 py-4 text-xs font-black uppercase tracking-[0.2em] gap-4',
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
        inline-flex items-center justify-center rounded-2xl
        transition-all duration-300 ease-in-out cursor-pointer
        active:scale-[0.97]
        disabled:opacity-20 disabled:cursor-not-allowed disabled:scale-100
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
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
