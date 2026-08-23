import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function sameLine(item, productId, variantId) {
  return item.productId === productId && item.variantId === variantId;
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const existing = get().items.find((i) => sameLine(i, newItem.productId, newItem.variantId));
        if (existing) {
          set({
            items: get().items.map((i) =>
              sameLine(i, newItem.productId, newItem.variantId)
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, newItem] });
        }
      },

      updateQuantity: (productId, variantId, quantity) => {
        set({
          items:
            quantity <= 0
              ? get().items.filter((i) => !sameLine(i, productId, variantId))
              : get().items.map((i) =>
                  sameLine(i, productId, variantId) ? { ...i, quantity } : i
                ),
        });
      },

      removeItem: (productId, variantId) => {
        set({ items: get().items.filter((i) => !sameLine(i, productId, variantId)) });
      },

      clearCart: () => set({ items: [] }),

      get previewSubtotal() {
        return get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      },

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: 'gayatri_granites_cart' }
  )
);