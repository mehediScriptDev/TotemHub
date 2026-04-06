import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Trash2, ChevronUp, ChevronDown,
  ShoppingBag, Package,
} from 'lucide-react';
import { Button, Spinner, EmptyState, Select, ConfirmDialog, Modal } from '../../../../Components/ui';
import { productService } from '../../../../services/productService';
import toast from 'react-hot-toast';

const getProductId = (product) => product?.slug_id ?? product?.id ?? product?.slug;

const ProductSection = ({ totemId, isActive = true }) => {
  // ── Homepage Products State ──
  const [homepageProducts, setHomepageProducts] = useState([]);
  const [loadingHomepage, setLoadingHomepage] = useState(true);

  // ── Catalog State ──
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: '', status: '', search: '' });
  const [catalogPage, setCatalogPage] = useState(1);
  const catalogPageSize = 20;

  // ── Delete State ──
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch homepage products ──
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
      toast.error('Failed to load homepage products');
    } finally {
      setLoadingHomepage(false);
    }
  }, [totemId]);

  useEffect(() => {
    if (isActive) {
      fetchHomepageProducts();
    }
  }, [fetchHomepageProducts, isActive]);

  // ── Fetch categories once ──
  useEffect(() => {
    if (categories.length === 0) {
      productService.getCategories().then((catData) => {
        setCategories(
          (catData?.categories || catData || []).map((c) => ({
            value: typeof c === 'string' ? c : c.id || c.value,
            label: typeof c === 'string' ? c : c.name || c.label,
          }))
        );
      }).catch(() => console.error('Failed to load categories'));
    }
  }, [categories.length]);

  // ── Fetch catalog when modal opens ──
  const fetchCatalog = useCallback(async () => {
    try {
      setLoadingCatalog(true);
      const productsData = await productService.getCatalog(filters);
      setCatalogProducts(productsData?.products || productsData || []);
    } catch {
      toast.error('Failed to load product catalog');
    } finally {
      setLoadingCatalog(false);
    }
  }, [filters]);

  useEffect(() => {
    if (catalogOpen) fetchCatalog();
  }, [catalogOpen, fetchCatalog]);

  // ── Add Product to Homepage ──
  const handleAddProduct = async (product) => {
    const productId = getProductId(product);

    if (productId === null || productId === undefined) {
      toast.error('Invalid product id');
      return;
    }

    // Prevent duplicates
    if (homepageProducts.some((p) => String(getProductId(p)) === String(productId))) {
      toast.error('Product already on homepage');
      return;
    }
    try {
      await productService.addToTotem(totemId, productId);
      setHomepageProducts((prev) => [...prev, { ...product, id: productId, slug_id: productId }]);
      toast.success(`"${product.name}" added to homepage`);
    } catch {
      toast.error('Failed to add product');
    }
  };

  // ── Remove Product from Homepage ──
  const handleRemoveProduct = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const targetId = getProductId(deleteTarget);
      await productService.removeFromTotem(totemId, targetId);
      setHomepageProducts((prev) => prev.filter((p) => String(getProductId(p)) !== String(targetId)));
      toast.success('Product removed');
    } catch {
      toast.error('Failed to remove product');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── Reorder Products ──
  const moveProduct = async (index, direction) => {
    const newList = [...homepageProducts];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newList.length) return;

    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setHomepageProducts(newList);

    try {
      await productService.reorderTotemProducts(
        totemId,
        newList.map((p) => getProductId(p))
      );
    } catch {
      toast.error('Failed to save order');
      fetchHomepageProducts(); // rollback
    }
  };

  // ── Check if product is already on homepage ──
  const isOnHomepage = (productId) => homepageProducts.some((p) => String(getProductId(p)) === String(productId));

  // ── Filter catalog by search ──
  const filteredCatalog = catalogProducts.filter(
    (p) =>
      !filters.search ||
      p.name?.toLowerCase().includes(filters.search.toLowerCase())
  );

  // ── Reset page when filters change ──
  useEffect(() => {
    setCatalogPage(1);
  }, [filters]);

  // ── Paginate filtered catalog ──
  const totalPages = Math.ceil(filteredCatalog.length / catalogPageSize);
  const paginatedCatalog = filteredCatalog.slice(
    (catalogPage - 1) * catalogPageSize,
    catalogPage * catalogPageSize
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-surface-900">Homepage Products</h2>
          <p className="text-sm md:text-base text-surface-600 mt-0.5">
            Select and order products for this totem's display
          </p>
        </div>
        <Button icon={Plus} onClick={() => setCatalogOpen(true)} size="md">
          Browse Catalog
        </Button>
      </div>

      {/* Homepage Products List */}
      {loadingHomepage ? (
        <Spinner text="Loading products..." />
      ) : homepageProducts.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products assigned"
          description="Browse the catalog to add products to this totem's homepage display."
          action={
            <Button icon={Plus} onClick={() => setCatalogOpen(true)}>
              Browse Catalog
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {homepageProducts.map((product, index) => (
            <div
              key={getProductId(product)}
              className="bg-white border border-surface-200 rounded-xl p-4 flex items-center gap-4 group animate-fade-in shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Order Number */}
              <div className="w-8 h-8 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-surface-700">{index + 1}</span>
              </div>

              {/* Product Image */}
              {product.image || product.thumbnail ? (
                <img
                  src={product.image || product.thumbnail}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover border border-surface-200 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-surface-500" />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-surface-800 truncate">
                  {product.name || `Product #${getProductId(product)}`}
                </h4>
                {product.category && (
                  <span className="text-xs text-surface-500">{product.category}</span>
                )}
              </div>

              {/* Price */}
              {product.price !== undefined && (
                <span className="text-sm font-semibold text-brand-600 shrink-0">
                  €{Number(product.price).toFixed(2)}
                </span>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => moveProduct(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500
                             hover:text-surface-800 disabled:opacity-30 disabled:cursor-not-allowed
                             transition-colors cursor-pointer"
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveProduct(index, 1)}
                  disabled={index === homepageProducts.length - 1}
                  className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500
                             hover:text-surface-800 disabled:opacity-30 disabled:cursor-not-allowed
                             transition-colors cursor-pointer"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(product)}
                  className="p-1.5 rounded-lg hover:bg-danger-600/15 text-surface-500
                             hover:text-danger-400 transition-colors cursor-pointer"
                  title="Remove from homepage"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Catalog Modal ── */}
      <Modal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        title="Product Catalog"
        size="2xl"
        tone="light"
      >
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-surface-300
                         text-sm text-surface-800 placeholder:text-surface-500
                         focus:border-brand-500 focus-ring transition-all"
            />
          </div>
          <Select
            placeholder="All Categories"
            options={categories}
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            tone="light"
            className="sm:w-44"
          />
          <Select
            placeholder="All Statuses"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' },
            ]}
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            tone="light"
            className="sm:w-36"
          />
        </div>

        {/* Catalog List */}
        <div className="max-h-100 overflow-y-auto space-y-2 pr-1">
          {loadingCatalog ? (
            <Spinner text="Loading catalog..." />
          ) : filteredCatalog.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products found"
              description="Try adjusting your filters."
            />
          ) : (
            paginatedCatalog.map((product) => {
              const productId = getProductId(product);
              const alreadyAdded = isOnHomepage(productId);
              return (
                <div
                  key={productId}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    alreadyAdded
                      ? 'bg-brand-50 border-brand-100'
                      : 'bg-white border-surface-200 hover:border-surface-300'
                  }`}
                >
                  {product.image || product.thumbnail ? (
                    <img
                      src={product.image || product.thumbnail}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-surface-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-surface-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800 truncate">
                      {product.name || `Product #${productId}`}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {product.category && (
                        <span className="text-xs text-surface-500">{product.category}</span>
                      )}
                      {product.price !== undefined && (
                        <span className="text-xs font-medium text-brand-600">
                          €{Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={alreadyAdded ? 'secondary' : 'primary'}
                    disabled={alreadyAdded}
                    onClick={() => handleAddProduct(product)}
                    icon={alreadyAdded ? null : Plus}
                    className={alreadyAdded ? 'bg-surface-100! text-surface-500! border-surface-200! shadow-none! hover:bg-surface-100! hover:border-surface-200!' : ''}
                  >
                    {alreadyAdded ? 'Added' : 'Add'}
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {filteredCatalog.length > catalogPageSize && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-200">
            <span className="text-xs text-surface-600">
              Showing {(catalogPage - 1) * catalogPageSize + 1}-{Math.min(
                catalogPage * catalogPageSize,
                filteredCatalog.length
              )} of {filteredCatalog.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCatalogPage((p) => Math.max(1, p - 1))}
                disabled={catalogPage === 1}
                className="px-3 py-1.5 rounded-lg border border-surface-300 text-surface-600
                           disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-50
                           transition-colors text-sm font-medium"
              >
                Previous
              </button>
              <div className="text-xs text-surface-600 font-medium px-2">
                Page {catalogPage} / {totalPages}
              </div>
              <button
                onClick={() => setCatalogPage((p) => Math.min(totalPages, p + 1))}
                disabled={catalogPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-surface-300 text-surface-600
                           disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-50
                           transition-colors text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleRemoveProduct}
        loading={deleting}
        title="Remove Product?"
        message={`Remove "${deleteTarget?.name || `Product #${getProductId(deleteTarget)}`}" from this totem's homepage?`}
        confirmText="Remove"
      />
    </div>
  );
};

export default ProductSection;
