import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Monitor, Search } from 'lucide-react';
import { Button, Spinner, EmptyState, ConfirmDialog } from '../../../Components/ui';
import { totemService } from '../../../services/totemService';
import DashboardStats from './sections/DashboardStats';
import TotemCard from './component/TotemCard';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [totems, setTotems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTotems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await totemService.getAll();
      setTotems(data?.totems || data || []);
    } catch (err) {
      toast.error('Failed to load totems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTotems();
  }, [fetchTotems]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await totemService.delete(deleteTarget.id);
      setTotems((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.name}" deleted successfully`);
    } catch (err) {
      toast.error('Failed to delete totem');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredTotems = totems.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.partnerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute stats
  const stats = {
    totalTotems: totems.length,
    activeDevices: totems.length,
    totalVideos: totems.reduce((acc, t) => acc + (t.videoCount || 0), 0),
    totalProducts: totems.reduce((acc, t) => acc + (t.productCount || 0), 0),
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-100">
            Dashboard
          </h1>
          <p className="text-sm text-surface-400 mt-1">
            Manage and monitor all your digital signage totems
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => navigate('/totem/new')}
          size="md"
        >
          New Totem
        </Button>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Totem List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <h2 className="text-lg font-semibold text-surface-200">
          All Totems
          <span className="ml-2 text-sm font-normal text-surface-500">
            ({filteredTotems.length})
          </span>
        </h2>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search totems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800/80 border border-surface-700
                       text-sm text-surface-100 placeholder:text-surface-500
                       focus:border-brand-500 focus-ring transition-all duration-200"
          />
        </div>
      </div>

      {/* Totem Grid */}
      {loading ? (
        <Spinner text="Loading totems..." />
      ) : filteredTotems.length === 0 ? (
        <EmptyState
          icon={Monitor}
          title={searchQuery ? 'No totems found' : 'No totems yet'}
          description={
            searchQuery
              ? `No totems match "${searchQuery}". Try a different search term.`
              : 'Create your first totem to start managing digital signage content.'
          }
          action={
            !searchQuery && (
              <Button icon={Plus} onClick={() => navigate('/totem/new')}>
                Create First Totem
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTotems.map((totem, i) => (
            <TotemCard
              key={totem.id}
              totem={totem}
              index={i}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Totem?"
        message={`This will permanently delete "${deleteTarget?.name}" and all its associated videos and products. This action cannot be undone.`}
        confirmText="Delete Totem"
      />
    </div>
  );
};

export default DashboardPage;
