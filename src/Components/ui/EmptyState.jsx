import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from './index';

/**
 * Empty state placeholder for lists with no data (Premium Light Mode).
 * Accepts action as either:
 * - A JSX element (e.g., <Button>Click me</Button>)
 * - An object with {onClick, icon, label}
 */
const EmptyState = ({
  icon: Icon = Layers,
  title = 'No data found',
  description = '',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-3xl bg-surface-100 border border-surface-200 flex items-center justify-center mb-6 shadow-sm shadow-black/5 transition-transform hover:scale-105">
        <Icon className="w-9 h-9 text-surface-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm text-surface-600 text-center max-w-sm mb-10 leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        // Support both JSX elements and object configs
        React.isValidElement(action) ? (
          action
        ) : (
          <Button 
            onClick={action.onClick} 
            icon={action.icon}
            size="lg"
            className="shadow-lg shadow-brand-500/20"
          >
            {action.label}
          </Button>
        )
      )}
    </div>
  );
};

export default EmptyState;
