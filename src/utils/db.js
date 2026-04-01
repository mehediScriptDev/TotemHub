/**
 * db.js - A LocalStorage-based Temporary Database
 * This manages persistent demo data for Totems, Products, and Videos.
 */

const KEYS = {
  TOTEMS: 'totemhub_db_totems',
  PRODUCTS: 'totemhub_db_products',
  VIDEOS: 'totemhub_db_videos',
  INITIALIZED: 'totemhub_db_initialized'
};

// --- INITIAL MOCK DATA ---
const INITIAL_TOTEMS = [
  { id: 't1', name: 'Main Entrance Kiosk', partnerEmail: 'partner@example.com', videoCount: 3, productCount: 4 },
  { id: 't2', name: 'Food Court Totem', partnerEmail: 'vendor@mall.com', videoCount: 1, productCount: 2 },
  { id: 't3', name: 'Parking Level 1', partnerEmail: 'info@parking.com', videoCount: 0, productCount: 0 },
];

const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Premium Headphones', category: 'Electronics', price: 199.99, status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
  { id: 'p2', name: 'Smart Watch', category: 'Electronics', price: 149.50, status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
  { id: 'p3', name: 'Leather Wallet', category: 'Accessories', price: 45.00, status: 'active', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop' },
  { id: 'p4', name: 'Water Bottle', category: 'Lifestyle', price: 25.00, status: 'active', image: 'https://images.unsplash.com/photo-1602143399827-bd9aa9673bc3?w=200&h=200&fit=crop' },
];

const INITIAL_VIDEOS = [
  { id: 'v1', totemId: 't1', filename: 'Welcome_Loop.mp4', category: 'rotating', size: 45000000, thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&h=150&fit=crop' },
  { id: 'v2', totemId: 't1', filename: 'Product_Showcase.mp4', category: 'rotating', size: 120000000, thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=150&fit=crop' },
  { id: 'v3', totemId: 't1', filename: 'Idle_Screen_Saver.mp4', category: 'idle', size: 85000000, thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&h=150&fit=crop' },
];

// --- DB ENGINE ---
export const db = {
  init: () => {
    if (!localStorage.getItem(KEYS.INITIALIZED)) {
      localStorage.setItem(KEYS.TOTEMS, JSON.stringify(INITIAL_TOTEMS));
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
      localStorage.setItem(KEYS.INITIALIZED, 'true');
    }
  },

  // TOTEMS
  getTotems: () => JSON.parse(localStorage.getItem(KEYS.TOTEMS) || '[]'),
  getTotemById: (id) => db.getTotems().find(t => t.id === id),
  saveTotem: (totem) => {
    const totems = db.getTotems();
    const newTotem = { ...totem, id: totem.id || 't_' + Date.now(), videoCount: 0, productCount: 0 };
    localStorage.setItem(KEYS.TOTEMS, JSON.stringify([newTotem, ...totems]));
    return newTotem;
  },
  deleteTotem: (id) => {
    const totems = db.getTotems().filter(t => t.id !== id);
    localStorage.setItem(KEYS.TOTEMS, JSON.stringify(totems));
  },

  // PRODUCTS
  getCatalog: () => JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]'),
  getTotemProducts: (totemId) => {
    // For demo, we'll store mapping in a separate key if needed, or just return first 2
    return db.getCatalog().slice(0, 3);
  },

  // VIDEOS
  getVideos: (totemId) => {
    const all = JSON.parse(localStorage.getItem(KEYS.VIDEOS) || '[]');
    return all.filter(v => v.totemId === totemId || !v.totemId);
  },
  saveVideo: (video) => {
    const all = JSON.parse(localStorage.getItem(KEYS.VIDEOS) || '[]');
    const newVideo = { ...video, id: 'v_' + Date.now() };
    localStorage.setItem(KEYS.VIDEOS, JSON.stringify([newVideo, ...all]));
    return newVideo;
  },
  deleteVideo: (id) => {
    const all = JSON.parse(localStorage.getItem(KEYS.VIDEOS) || '[]').filter(v => v.id !== id);
    localStorage.setItem(KEYS.VIDEOS, JSON.stringify(all));
  }
};

// Initialize on load
db.init();
