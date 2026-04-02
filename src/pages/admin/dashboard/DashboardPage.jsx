import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Layers, Activity, Video, ShoppingBag } from 'lucide-react';
import { totemService } from '../../../services/totemService';
import { Button, Input, Spinner, EmptyState } from '../../../Components/ui';
import TotemCard from './component/TotemCard';
import DashboardStats from './sections/DashboardStats';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [totems, setTotems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTotems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await totemService.getAll();
      setTotems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load access');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTotems(); }, [fetchTotems]);

  const filteredTotems = totems.filter((t) =>
    (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.user?.email || t.partnerEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-surface-800">Dashboard</h1>
          <p className="mt-1 text-surface-500 font-medium">Manage and monitor all your digital signage totems</p>
        </div>
        <Button onClick={() => navigate('/totem/new')} icon={Plus} size="lg" className="shadow-lg shadow-brand-500/10">
          New Totem
        </Button>
      </div>

      <DashboardStats totems={totems} />

      {/* Actions & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-surface-200">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search totems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-surface-500 text-surface-800"
          />
        </div>
        <div className="text-sm font-medium text-surface-500 bg-surface-100 px-3 py-1.5 rounded-full border border-surface-200 uppercase tracking-wider scale-95">
          All Totems ({filteredTotems.length})
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : filteredTotems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTotems.map((totem) => (
            <TotemCard key={totem.id} totem={totem} onDeleted={fetchTotems} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchQuery ? 'No totems found' : 'No totems yet'}
          description={searchQuery ? `We couldn't find any totems matching "${searchQuery}"` : 'Create your first totem to start managing digital signage content.'}
          action={!searchQuery && { label: 'Create First Totem', onClick: () => navigate('/totem/new') }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
