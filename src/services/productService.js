import axiosInstance from './axiosInstance';

const PRODUCT_API_BASE = (
  import.meta.env.VITE_PRODUCT_API_BASE ||
  'https://api-c.psicopatici.com/api/v1'
).replace(/\/$/, '');

const normalizeStatus = (status) => (status ? String(status).toLowerCase() : '');

const getProductKey = (product) => (
  product?.slug_id ??
  product?.slugId ??
  product?.slug ??
  product?.id ??
  product?.product_id ??
  null
);

const normalizeCatalogItem = (product) => {
  const slugId = getProductKey(product);
  const categoryValue =
    product?.category?.name ||
    product?.category_name ||
    product?.category ||
    product?.taxonomy ||
    '';

  return {
    ...product,
    id: slugId,
    slug_id: slugId,
    name: product?.name || product?.title || `Product ${slugId ?? ''}`.trim(),
    category: typeof categoryValue === 'string' ? categoryValue : '',
    status: normalizeStatus(product?.status || product?.published_status || product?.visibility),
  };
};

const normalizeCatalogPayload = (payload) => {
  const productsArray = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.products)
      ? payload.products
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return productsArray.map(normalizeCatalogItem).filter((product) => product.id !== null && product.id !== undefined);
};

const normalizeHomepagePayload = (payload) => {
  const products = Array.isArray(payload?.products)
    ? payload.products
    : Array.isArray(payload?.homepage?.products)
      ? payload.homepage.products
      : Array.isArray(payload)
        ? payload
        : [];

  return products
    .map((product, idx) => {
      const slugId = getProductKey(product);
      return {
        ...product,
        id: slugId,
        slug_id: slugId,
        order: Number.isFinite(Number(product?.order)) ? Number(product.order) : idx,
      };
    })
    .filter((product) => product.id !== null && product.id !== undefined)
    .sort((a, b) => a.order - b.order);
};

const saveHomepageProducts = async (totemId, products) => {
  const payload = products.map((product, index) => ({
    slug_id: getProductKey(product),
    order: Number.isFinite(Number(product?.order)) ? Number(product.order) : index,
  }));

  const response = await axiosInstance.post(`/${totemId}/homepage`, { products: payload });
  return response.data;
};

export const productService = {
  /** Product search from ecommerce API */
  getCatalog: async (filters = {}) => {
    const search = (filters.search || '').trim();
    const perPage = filters.per_page || 8;
    const page = filters.page || 1;

    const response = await axiosInstance.get(`${PRODUCT_API_BASE}/products/search`, {
      params: {
        q: search,
        per_page: perPage,
        page,
      },
    });

    let products = normalizeCatalogPayload(response.data);

    if (filters.category) {
      const normalizedCategory = String(filters.category).toLowerCase();
      products = products.filter((product) => String(product.category || '').toLowerCase() === normalizedCategory);
    }

    if (filters.status) {
      const normalizedFilterStatus = normalizeStatus(filters.status);
      products = products.filter((product) => normalizeStatus(product.status) === normalizedFilterStatus);
    }

    return {
      products,
      meta: response.data?.meta || null,
    };
  },

  /** Categories derived from catalog results (no dedicated categories endpoint in docs) */
  getCategories: async () => {
    const { products } = await productService.getCatalog({ search: '', per_page: 50, page: 1 });
    const uniqueCategories = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return uniqueCategories;
  },

  /** GET /api/totems/{id}/homepage */
  getTotemProducts: async (totemId) => {
    const response = await axiosInstance.get(`/${totemId}/homepage`);
    const products = normalizeHomepagePayload(response.data);
    return {
      ...(response.data && typeof response.data === 'object' && !Array.isArray(response.data) ? response.data : {}),
      products,
    };
  },

  /** Add a product slug to totem homepage and persist full ordered payload */
  addToTotem: async (totemId, productId) => {
    const current = await productService.getTotemProducts(totemId);
    const currentProducts = current.products || [];
    const exists = currentProducts.some((product) => String(getProductKey(product)) === String(productId));

    if (exists) {
      return { success: true, message: 'already_exists' };
    }

    const nextProducts = [
      ...currentProducts.map((product, idx) => ({ ...product, order: idx })),
      { slug_id: productId, order: currentProducts.length },
    ];

    return saveHomepageProducts(totemId, nextProducts);
  },

  /** Remove product slug from totem homepage and persist full ordered payload */
  removeFromTotem: async (totemId, productId) => {
    const current = await productService.getTotemProducts(totemId);
    const currentProducts = current.products || [];

    const nextProducts = currentProducts
      .filter((product) => String(getProductKey(product)) !== String(productId))
      .map((product, idx) => ({ ...product, order: idx }));

    return saveHomepageProducts(totemId, nextProducts);
  },

  /** Persist ordered slug list to backend */
  reorderTotemProducts: async (totemId, productIds = []) => {
    const orderedProducts = productIds.map((productId, index) => ({ slug_id: productId, order: index }));
    return saveHomepageProducts(totemId, orderedProducts);
  },

  reorder: async (totemId, productIds = []) => productService.reorderTotemProducts(totemId, productIds),
};
