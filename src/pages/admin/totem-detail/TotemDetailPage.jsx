import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Monitor, ShoppingBag, Video, Mail } from 'lucide-react';
import { Spinner } from '../../../Components/ui';
import { totemService } from '../../../services/totemService';
import ProductSection from './sections/ProductSection';
import VideoSection from './sections/VideoSection';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'videos', label: 'Videos', icon: Video },
];

const TotemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [totem, setTotem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  const fetchTotem = useCallback(async () => {
    try {
      setLoading(true);
      const data = await totemService.getById(id);
      setTotem(data?.totem || data);
    } catch (err) {
      toast.error('Failed to load totem details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTotem();
  }, [fetchTotem]);

  if (loading) {
    return <Spinner text="Loading totem details..." />;
  }

  if (!totem) return null;

  return (
    <div className="max-w-screen-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-surface-600 hover:text-surface-900
                   transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* Totem Header */}
      <div className="bg-white border border-surface-200 rounded-2xl p-5 lg:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-500/20 to-brand-700/10 border border-brand-500/20 flex items-center justify-center shrink-0">
              <Monitor className="w-7 h-7 text-brand-600" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-surface-900">
                {totem.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-surface-500" />
                <span className="text-sm text-surface-600">{totem.partnerEmail || totem.user?.email || 'No email'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse-dot" />
            <span className="text-sm text-surface-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-surface-100 border border-surface-200 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200 cursor-pointer
              ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-white'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'products' && <ProductSection totemId={id} />}
        {activeTab === 'videos' && <VideoSection totemId={id} />}
      </div>
    </div>
  );
};

export default TotemDetailPage;
