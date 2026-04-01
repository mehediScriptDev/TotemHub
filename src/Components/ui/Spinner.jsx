import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Page-level spinner overlay for loading states.
 */
const Spinner = ({ text = 'Loading...', fullScreen = false }) => {
  const wrapperClass = fullScreen
    ? 'fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-sm'
    : 'w-full py-20';

  return (
    <div className={`${wrapperClass} flex flex-col items-center justify-center gap-3`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-surface-700" />
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin absolute inset-0" />
      </div>
      <p className="text-sm text-surface-400 font-medium">{text}</p>
    </div>
  );
};

export default Spinner;
