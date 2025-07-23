import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { persist } from 'zustand/middleware';

export const useProductStore = create(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({
          products: [{ id: Date.now(), ...product }, ...state.products],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'products-storage',
      getStorage: () => SecureStoreStorage,
    }
  )
);

// Custom wrapper for SecureStore
const SecureStoreStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};
