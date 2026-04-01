// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: 30000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "totem_auth_token",
  USER: "totem_auth_user",
};

// Video Categories
export const VIDEO_CATEGORIES = {
  IDLE: "idle",
  ROTATING: "rotating",
};

// Product Statuses
export const PRODUCT_STATUS = {
  ACTIVE: "active",
  DRAFT: "draft",
  ARCHIVED: "archived",
};
