import { create } from 'zustand';
import * as productsApi from '../api/products';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await productsApi.fetchProducts();
      set({ products: data, loading: false });
    } catch {
      set({ error: 'Could not load products.', loading: false });
    }
  },

  createProduct: async (payload) => {
    const created = await productsApi.createProduct(payload);
    set({ products: [...get().products, created] });
    return created;
  },

  updateProduct: async (id, payload) => {
    const updated = await productsApi.updateProduct(id, payload);
    set({ products: get().products.map((p) => (p.id === id ? updated : p)) });
    return updated;
  },

  deactivateProduct: async (id) => {
    await productsApi.deactivateProduct(id);
    set({
      products: get().products.map((p) => (p.id === id ? { ...p, active: false } : p)),
    });
  },
}));