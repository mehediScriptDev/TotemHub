import React from 'react';

/**
 * A reusable Select dropdown styled consistently with the Input component.
 */
const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-surface-300"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        className={`
          w-full rounded-xl bg-surface-800/80 border text-surface-100
          transition-all duration-200 focus-ring text-sm px-4 py-2.5
          cursor-pointer appearance-none
          ${
            error
              ? 'border-danger-500'
              : 'border-surface-700 focus:border-brand-500 hover:border-surface-500'
          }
          ${className}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
        {...props}
      >
        <option value="" className="bg-surface-800 text-surface-400">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-surface-800 text-surface-100"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-danger-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Select;
