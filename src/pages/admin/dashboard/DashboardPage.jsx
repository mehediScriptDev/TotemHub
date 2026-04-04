import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Grid3x3, List, ShoppingBag, Trash2 } from 'lucide-react';
import { totemService } from '../../../services/totemService';
import { Button, Spinner, EmptyState } from '../../../Components/ui';
import TotemCard from './component/TotemCard';
import DashboardStats from './sections/DashboardStats';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [totems, setTotems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('totemViewMode') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('totemViewMode', mode);
    } catch {
      console.error('Failed to persist view mode');
    }
  };

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

  const totalPages = Math.max(1, Math.ceil(filteredTotems.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedTotems = filteredTotems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper to normalize owner info from different API/local shapes
  const getOwner = (t) => {
    const user = t.user || null;
    const nameFromUser = user ? (user.first_name ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : (user.name || '')) : '';
    const ownerName = nameFromUser || t.partnerEmail || '';
    const ownerEmail = (user && (user.email || user.email_address)) || t.partnerEmail || '';
    const ownerInitial = (
      (user && (user.first_name?.charAt(0) || user.name?.charAt(0))) ||
      (ownerName && ownerName.charAt(0)) ||
      (t.name && t.name.charAt(0)) ||
      'P'
    ).toUpperCase();

    return { ownerName, ownerEmail, ownerInitial };
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-6 space-y-4 xl:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-surface-900">Dashboard</h1>
          <p className="mt-1 text-surface-600 font-medium">Manage and monitor all your digital signage totems</p>
        </div>
        <Button
          onClick={() => navigate('/totem/new')}
          icon={Plus}
          className="h-10 px-4 rounded-lg text-sm font-semibold shadow-md shadow-brand-500/20"
        >
          New Totem
        </Button>
      </div>

      <DashboardStats totems={totems} />

      {/* Actions & View Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-100 p-3 rounded-xl border border-surface-200">
        <div className="relative w-full sm:flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search totems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-9 bg-white border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-surface-500 text-surface-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="hidden sm:block text-xs font-semibold text-surface-500">
            {filteredTotems.length} totems
          </div>

          <div className="inline-flex items-center gap-1 bg-white border border-surface-200 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
              }`}
              title="Grid view"
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
              }`}
              title="List view"
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : filteredTotems.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 xl:gap-4">
              {paginatedTotems.map((totem) => (
                <TotemCard key={totem.id} totem={totem} onDeleted={fetchTotems} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed">
                  <thead className="bg-surface-50">
                    <tr className="text-left text-xs font-semibold text-surface-500 uppercase">
                      <th className="px-6 py-3">Totem</th>
                      <th className="px-6 py-3">Videos</th>
                      <th className="px-6 py-3">Products</th>
                      <th className="px-6 py-3">Owner</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {paginatedTotems.map((totem) => (
                      <tr key={totem.id} className="hover:bg-surface-50">
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-surface-50 flex items-center justify-center shadow-sm">
                              <ShoppingBag className="w-6 h-6 text-brand-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-surface-900">{totem.name || 'Unnamed Totem'}</div>
                              <div className="text-xs text-surface-500">Store ID: {totem.id_store}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm font-semibold text-surface-800">{totem.videoCount ?? '—'}</div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm font-semibold text-surface-800">{totem.productCount ?? '—'}</div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          {(() => {
                            const { ownerName, ownerEmail, ownerInitial } = getOwner(totem);
                            return (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-[10px] font-bold text-surface-600 uppercase">
                                  {ownerInitial}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-surface-800 truncate">{ownerName || '—'}</div>
                                  <div className="text-xs text-surface-500 truncate">{ownerEmail || '—'}</div>
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 align-top text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" className="bg-brand-600 text-white" onClick={() => navigate(`/totem/${totem.id}`)}>Manage</Button>
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Permanently remove "${totem.name}"? This action is irreversible.`)) return;
                                try {
                                  await totemService.delete(totem.id);
                                  toast.success('Totem deleted');
                                  fetchTotems();
                                } catch (err) {
                                  toast.error('Failed to delete');
                                  console.error(err);
                                }
                              }}
                              className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Totem"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredTotems.length > itemsPerPage && (
            <div className="mt-4">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
                <div className="text-sm text-surface-500">
                  Showing {Math.min(filteredTotems.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filteredTotems.length, currentPage * itemsPerPage)} of {filteredTotems.length}
                </div>

                <div className="flex items-center gap-2">
                  {/* Compact mobile controls */}
                  <div className="flex items-center gap-2 sm:hidden">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50'}`}
                    >
                      Prev
                    </button>
                    <div className="px-3 py-1 rounded-md border bg-white text-surface-700 text-sm">
                      {currentPage}/{totalPages}
                    </div>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50'}`}
                    >
                      Next
                    </button>
                  </div>

                  {/* Full controls for larger screens */}
                  <div className="hidden sm:inline-flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50'}`}
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 rounded-md border ${p === currentPage ? 'bg-brand-600 text-white' : 'bg-white text-surface-700 hover:bg-surface-50'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
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
