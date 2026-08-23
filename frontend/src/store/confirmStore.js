import { create } from 'zustand';

export const useConfirmStore = create((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  variant: 'danger',
  resolver: null,

  confirm: ({ title, message, confirmLabel = 'Confirm', variant = 'danger' }) => {
    return new Promise((resolve) => {
      set({ isOpen: true, title, message, confirmLabel, variant, resolver: resolve });
    });
  },

  handleConfirm: () => {
    set((state) => {
      state.resolver?.(true);
      return { isOpen: false, resolver: null };
    });
  },

  handleCancel: () => {
    set((state) => {
      state.resolver?.(false);
      return { isOpen: false, resolver: null };
    });
  },
}));