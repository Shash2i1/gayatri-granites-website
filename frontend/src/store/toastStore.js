import { create } from 'zustand';

let idCounter = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  showToast: (message, type = 'info') => {
    const id = ++idCounter;
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) });
    }, 3500);
  },
}));