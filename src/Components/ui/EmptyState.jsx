import React from 'react';

/**
 * Empty state placeholder for lists with no data.
 */
const EmptyState = ({
  icon: Icon,
  title = 'No data found',
  description = '',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700/50 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-surface-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-300 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-surface-500 text-center max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
