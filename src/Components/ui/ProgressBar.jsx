import React from 'react';

/**
 * Upload progress bar with percentage display.
 * Used during video uploads to show real-time progress.
 */
const ProgressBar = ({ progress = 0, label = 'Uploading...', showPercent = true }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-surface-600">{label}</span>
        {showPercent && (
          <span className="text-xs font-semibold text-brand-600">
            {clampedProgress}%
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
