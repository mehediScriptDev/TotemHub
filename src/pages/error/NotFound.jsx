import React from 'react';
import { useNavigate } from 'react-router';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '../../Components/ui';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        {/* Large 404 */}
        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[160px] font-black text-surface-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/15 border border-brand-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-brand-400" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-surface-100 mb-2">Page Not Found</h2>
        <p className="text-surface-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button icon={Home} onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
