/**
 * db.js - Real Data Synchronized Database
 */

const KEYS = {
  TOTEMS: 'totemhub_db_totems',
  PRODUCTS: 'totemhub_db_products',
  VIDEOS: 'totemhub_db_videos',
  INITIALIZED: 'totemhub_v2_init' // Changed version to force re-init
};

// --- REAL DATA FROM YOUR BACKEND ---
const REAL_TOTEMS = [
  {
    "id": 6,
    "id_store": 87,
    "name": "Fierro",
    "user": { "first_name": "Franco", "last_name": "Fierro", "email": "info@francofierro.com", "business_type": "Partner Finanziario" }
  },
  {
    "id": 7,
    "id_store": 280,
    "name": "Test",
    "user": { "first_name": "test", "last_name": "test", "email": "scrapscercanegozio@gmail.com", "business_type": "Negozio" }
  },
  {
    "id": 10,
    "id_store": 257,
    "name": "Zupo Vito",
    "user": { "first_name": "Vito", "last_name": "Zupo", "email": "zuporappresentanze@live.it", "business_type": "Negozio" }
  },
  {
    "id": 11,
    "id_store": 420,
    "name": "75'' Gins Battipaglia",
    "user": { "first_name": "Paolo", "last_name": "D auria", "email": "gcouture1974@gmail.com", "business_type": "Negozio" }
  },
  {
    "id": 12,
    "id_store": 416,
    "name": "Eboli - InfoLudica",
    "user": { "first_name": "Madianna", "last_name": "De rosa", "email": "infoludicaboutique@gmail.com", "business_type": "Negozio" }
  },
  {
    "id": 13,
    "id_store": 420,
    "name": "65'' Gins Battipaglia",
    "user": { "first_name": "Paolo", "last_name": "D auria", "email": "gcouture1974@gmail.com", "business_type": "Negozio" }
  },
  {
    "id": 14,
    "id_store": 640,
    "name": "86'' Cacciapuoti Villaricca",
    "user": { "first_name": "Filippo", "last_name": "Cacciapuoti", "email": "boutiquecacciapuoti@gmail.com", "business_type": "Negozio" }
  },
  {
    "id": 15,
    "id_store": 656,
    "name": "86'' Riccione",
    "user": { "first_name": "Alina", "last_name": "Ciuprina", "email": "ac@miogroup.it", "business_type": "Negozio" }
  }
];

// --- DB ENGINE ---
export const db = {
  init: () => {
    if (!localStorage.getItem(KEYS.INITIALIZED)) {
      localStorage.setItem(KEYS.TOTEMS, JSON.stringify(REAL_TOTEMS));
      localStorage.setItem(KEYS.INITIALIZED, 'true');
    }
  },

  getTotems: () => JSON.parse(localStorage.getItem(KEYS.TOTEMS) || '[]'),
  getTotemById: (id) => db.getTotems().find(t => t.id == id),
  saveTotem: (totem) => {
    const totems = db.getTotems();
    const newTotem = { ...totem, id: Date.now(), videoCount: 0, productCount: 0 };
    localStorage.setItem(KEYS.TOTEMS, JSON.stringify([newTotem, ...totems]));
    return newTotem;
  },
  deleteTotem: (id) => {
    const totems = db.getTotems().filter(t => t.id != id);
    localStorage.setItem(KEYS.TOTEMS, JSON.stringify(totems));
  }
};

db.init();
