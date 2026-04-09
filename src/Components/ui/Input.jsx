import React, { forwardRef } from 'react';

/**
 * Reusable Input component with label, error state, and icon support.
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon className="w-4 h-4 text-surface-400" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl bg-surface-800/80 border text-surface-100
              placeholder:text-surface-500 transition-all duration-200
              focus-ring text-xs
              ${Icon ? 'pl-10 pr-4' : 'px-4'}
              py-2
              ${
                error
                  ? 'border-danger-500 focus:border-danger-500'
                  : 'border-surface-700 focus:border-brand-500 hover:border-surface-500'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-danger-500 mt-1 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-danger-500" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
