import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Trash2, ChevronUp, ChevronDown,
  ShoppingBag, Package, Filter, LayoutGrid, List as ListIcon,
  Sparkles, ExternalLink, Zap
} from 'lucide-react';
import { Button, Spinner, EmptyState, Select, ConfirmDialog, Modal } from '../../../../Components/ui';
import { productService } from '../../../../services/productService';
import toast from 'react-hot-toast';

const getProductId = (product) => product?.slug_id ?? product?.id ?? product?.slug;

const ProductSection = ({ totemId, isActive = true }) => {
  const [homepageProducts, setHomepageProducts] = useState([]);
  const [loadingHomepage, setLoadingHomepage] = useState(true);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: '', status: '', search: '' });
  const [catalogPage, setCatalogPage] = useState(1);
  const catalogPageSize = 20;

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHomepageProducts = useCallback(async () => {
    try {
      setLoadingHomepage(true);
      const data = await productService.getTotemProducts(totemId);
      const products = (data?.products || data || []).map((product, index) => {
        const productId = getProductId(product);
        return {
          ...product,
          id: productId,
          slug_id: productId,
          order: Number.isFinite(Number(product?.order)) ? Number(product.order) : index,
        };
      });
      setHomepageProducts(products);
    } catch {
      toast.error('CATALOG SYNC FAILURE');
    } finally {
      setLoadingHomepage(false);
    }
  }, [totemId]);

  useEffect(() => {
    if (isActive) fetchHomepageProducts();
  }, [fetchHomepageProducts, isActive]);

  useEffect(() => {
    if (categories.length === 0) {
      productService.getCategories().then((catData) => {
        setCategories(
          (catData?.categories || catData || []).map((c) => ({
            value: typeof c === 'string' ? c : c.id || c.value,
            label: typeof c === 'string' ? c : c.name || c.label,
          }))
        );
      }).catch(() => console.error('Archive query failure'));
    }
  }, [categories.length]);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoadingCatalog(true);
      const productsData = await productService.getCatalog(filters);
      setCatalogProducts(productsData?.products || productsData || []);
    } catch {
      toast.error('ARCHIVE FETCH FAILURE');
    } finally {
      setLoadingCatalog(false);
    }
  }, [filters]);

  useEffect(() => {
    if (catalogOpen) fetchCatalog();
  }, [catalogOpen, fetchCatalog]);

  const handleAddProduct = async (product) => {
    const productId = getProductId(product);
    if (!productId) return;
    if (homepageProducts.some((p) => String(getProductId(p)) === String(productId))) {
      toast.error('ASSET DUPLICATION DETECTED');
      return;
    }
    try {
      await productService.addToTotem(totemId, productId);
      setHomepageProducts((prev) => [...prev, { ...product, id: productId, slug_id: productId }]);
      toast.success('ASSET DEPLOYED TO CLOUD');
    } catch {
      toast.error('PROVISIONING ERROR');
    }
  };

  const handleRemoveProduct = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const targetId = getProductId(deleteTarget);
      await productService.removeFromTotem(totemId, targetId);
      setHomepageProducts((prev) => prev.filter((p) => String(getProductId(p)) !== String(targetId)));
      toast.success('ASSET DECOMMISSIONED');
    } catch {
      toast.error('DECOMMISSION FAILED');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const moveProduct = async (index, direction) => {
    const newList = [...homepageProducts];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setHomepageProducts(newList);
    try {
      await productService.reorderTotemProducts(totemId, newList.map((p) => getProductId(p)));
    } catch {
      toast.error('PROTOCOL REORDER SYNC FAILURE');
      fetchHomepageProducts();
    }
  };

  const isOnHomepage = (productId) => homepageProducts.some((p) => String(getProductId(p)) === String(productId));
  const filteredCatalog = catalogProducts.filter(p => !filters.search || p.name?.toLowerCase().includes(filters.search.toLowerCase()));

  useEffect(() => { setCatalogPage(1); }, [filters]);
  const totalPages = Math.ceil(filteredCatalog.length / catalogPageSize);
  const paginatedCatalog = filteredCatalog.slice((catalogPage - 1) * catalogPageSize, catalogPage * catalogPageSize);

  return (
    <div className="space-y-12">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 pb-10 border-b border-slate-100">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Fleet Inventory</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Configure Active Catalog Nodes</p>
        </div>
        <button 
          onClick={() => setCatalogOpen(true)}
          className="group relative px-10 py-5 rounded-[2rem] bg-slate-900 overflow-hidden shadow-2xl shadow-slate-900/10 hover:shadow-brand-500/30 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center gap-4 text-white">
            <Plus className="w-5 h-5 font-black" />
            <span className="text-[11px] font-black uppercase tracking-widest">Open Archive Vault</span>
          </div>
        </button>
      </div>

      {/* Asset List Studio View */}
      {loadingHomepage ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-slow-fade">
          <div className="w-16 h-16 rounded-full border-4 border-slate-50 border-t-brand-500 animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Active Fleet...</p>
        </div>
      ) : homepageProducts.length === 0 ? (
        <div className="py-32 flex flex-col items-center text-center space-y-10 animate-slow-fade">
          <div className="w-24 h-24 rounded-[3rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xl">
            <ShoppingBag className="w-10 h-10 text-slate-200" />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-slate-400 uppercase tracking-tighter">Terminal Empty</h3>
            <p className="max-w-xs mx-auto text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Initial asset deployment required to activate display interface.</p>
          </div>
          <button onClick={() => setCatalogOpen(true)} className="px-10 py-4 rounded-2xl border-2 border-brand-500 text-brand-500 text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all shadow-xl shadow-brand-500/5">Provision First Node</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {homepageProducts.map((product, index) => (
            <div
              key={getProductId(product)}
              className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 flex items-center gap-8 hover:shadow-premium hover:border-brand-100 transition-all duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Index/Priority */}
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
                <span className="text-xs font-black">{index + 1}</span>
              </div>

              {/* Asset Visual */}
              <div className="relative shrink-0">
                <div className="absolute -inset-2 bg-gradient-premium rounded-3xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                {product.image || product.thumbnail ? (
                  <img src={product.image || product.thumbnail} alt="" className="relative w-20 h-20 rounded-[1.5rem] object-cover border border-slate-100 shadow-xl group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="relative w-20 h-20 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Package className="w-8 h-8 text-slate-200" />
                  </div>
                )}
              </div>

              {/* Info Block */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-black text-slate-900 truncate uppercase tracking-tight">{product.name || 'Unknown Item'}</h4>
                  <Zap className="w-3.5 h-3.5 text-success-500" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-lg bg-slate-50 text-[9px] font-black text-slate-400 border border-slate-100 uppercase tracking-widest">{product.category || 'legacy'}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-sm font-black text-brand-500 uppercase tracking-tighter">€{Number(product.price || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Console Controls */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <button
                  onClickCapture={(e) => { e.stopPropagation(); moveProduct(index, -1); }}
                  disabled={index === 0}
                  className="p-3.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg hover:border border-slate-100 disabled:opacity-10 transition-all"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClickCapture={(e) => { e.stopPropagation(); moveProduct(index, 1); }}
                  disabled={index === homepageProducts.length - 1}
                  className="p-3.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg hover:border border-slate-100 disabled:opacity-10 transition-all"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-slate-100 mx-2" />
                <button
                  onClickCapture={(e) => { e.stopPropagation(); setDeleteTarget(product); }}
                  className="p-3.5 rounded-xl bg-danger-50 text-danger-500 hover:bg-danger-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archive Modal Studio Edition */}
      <Modal isOpen={catalogOpen} onClose={() => setCatalogOpen(false)} title="STUDIO ARCHIVE VAULT" size="2xl">
        <div className="space-y-10 py-4">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors font-black" />
              <input
                type="text"
                placeholder="SEARCH ASSET ARCHIVES..."
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.75rem] text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-brand-500/30 focus:shadow-xl outline-none text-slate-900 placeholder:text-slate-300"
              />
            </div>
            <Select
               placeholder="CATEGORY FILTER"
               options={categories}
               value={filters.category}
               onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
               className="sm:w-64 h-[72px]!"
            />
          </div>

          <div className="max-h-[550px] overflow-y-auto space-y-3 pr-4 custom-scrollbar">
            {loadingCatalog ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-8 animate-slow-fade">
                <Spinner size="lg" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Establishing Database Link...</p>
              </div>
            ) : filteredCatalog.length === 0 ? (
              <div className="py-32 text-center">
                 <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] underline decoration-brand-500 decoration-4 underline-offset-8">No records matching signature</p>
              </div>
            ) : (
              paginatedCatalog.map((product) => {
                const productId = getProductId(product);
                const alreadyAdded = isOnHomepage(productId);
                return (
                  <div key={productId} className={`group flex items-center gap-6 p-5 rounded-[2rem] border transition-all duration-500 ${alreadyAdded ? 'bg-brand-50 border-brand-100' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg'}`}>
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                      {product.image || product.thumbnail ? (
                        <img src={product.image || product.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50"><Package className="w-6 h-6 text-slate-200" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{product.name}</p>
                      <div className="flex items-center gap-3">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category || 'legacy'}</p>
                         <div className="w-1 h-1 rounded-full bg-slate-200" />
                         <p className="text-[10px] font-black text-brand-500">€{Number(product.price || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => !alreadyAdded && handleAddProduct(product)}
                      disabled={alreadyAdded}
                      className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-xl ${alreadyAdded ? 'bg-white text-emerald-600 border border-emerald-100' : 'bg-slate-900 hover:bg-brand-600 text-white shadow-slate-900/10 hover:shadow-brand-500/20'}`}
                    >
                      {alreadyAdded ? 'Provisioned' : 'Deploy'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleRemoveProduct}
        loading={deleting}
        title="DECOMMISSION ASSET?"
        message={`This protocol will remove "${deleteTarget?.name}" from the active terminal cluster. This sequence is reversible.`}
        confirmText="Confirm Decommission"
      />
    </div>
  );
};

export default ProductSection;
