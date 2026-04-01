import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from './index';

/**
 * Empty state placeholder for lists with no data (Premium Light Mode).
 */
const EmptyState = ({
  icon: Icon = Layers,
  title = 'No data found',
  description = '',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-6 shadow-sm shadow-brand-500/5 transition-transform hover:scale-105">
        <Icon className="w-9 h-9 text-brand-500" />
      </div>
      
      <h3 className="text-xl font-black text-surface-900 mb-2 tracking-tight uppercase">{title}</h3>
      
      {description && (
        <p className="text-sm font-bold text-surface-500 text-center max-w-sm mb-10 leading-relaxed uppercase tracking-tighter">
          {description}
        </p>
      )}

      {action && (
        <Button 
          onClick={action.onClick} 
          icon={action.icon}
          size="lg"
          className="shadow-lg shadow-brand-500/20"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
