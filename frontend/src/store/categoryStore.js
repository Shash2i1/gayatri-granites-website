import { create } from 'zustand';
import * as categoriesApi from '../api/categories';

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await categoriesApi.fetchCategories();
      set({ categories: data, loading: false });
    } catch (err) {
      set({ error: 'Could not load categories.', loading: false });
    }
  },

  createCategory: async (payload) => {
    const created = await categoriesApi.createCategory(payload);
    set({ categories: [...get().categories, created] });
  },

  updateCategory: async (id, payload) => {
    const updated = await categoriesApi.updateCategory(id, payload);
    set({
      categories: get().categories.map((c) => (c.id === id ? updated : c)),
    });
  },

  deleteCategory: async (id) => {
    await categoriesApi.deleteCategory(id);
    set({ categories: get().categories.filter((c) => c.id !== id) });
  },
}));