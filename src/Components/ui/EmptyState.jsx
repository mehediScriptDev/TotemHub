import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from './index';

/**
 * Premium Empty state placeholder for lists with no data.
 */
const EmptyState = ({
  icon: Icon = Layers,
  title = 'No records found',
  description = '',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 bg-surface-100/30 rounded-[3rem] border border-surface-200/50 animate-slow-fade">
      <div className="relative group mb-10">
        <div className="absolute -inset-6 bg-brand-500/10 blur-2xl rounded-full group-hover:bg-brand-500/20 transition-all duration-700" />
        <div className="relative w-24 h-24 rounded-[2.5rem] bg-surface-100 border border-surface-200 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <Icon className="w-10 h-10 text-surface-500 opacity-50 group-hover:text-brand-500 group-hover:opacity-100 transition-all" />
        </div>
      </div>
      
      <div className="text-center space-y-4 max-w-sm">
        <h3 className="text-2xl font-black text-white tracking-tight uppercase">{title}</h3>
        {description && (
          <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest leading-relaxed opacity-60">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="mt-12">
          {React.isValidElement(action) ? (
            action
          ) : (
            <Button 
              onClick={action.onClick} 
              icon={action.icon}
              size="lg"
              className="shadow-2xl shadow-brand-500/40"
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
