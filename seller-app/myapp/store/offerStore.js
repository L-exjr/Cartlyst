import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { persist } from "zustand/middleware";

export const useOfferStore = create(
  persist(
    (set) => ({
      offers: [],
      addOffer: (offer) =>
        set((state) => ({
          offers: [{ id: Date.now(), ...offer }, ...state.offers],
        })),
      updateOffer: (id, updates) =>
        set((state) => ({
          offers: state.offers.map((o) =>
            o.id === id ? { ...o, ...updates } : o,
          ),
        })),
      deleteOffer: (id) =>
        set((state) => ({
          offers: state.offers.filter((o) => o.id !== id),
        })),
    }),
    {
      name: "offers-storage",
      getStorage: () => SecureStoreStorage,
    },
  ),
);

// Custom wrapper for SecureStore
const SecureStoreStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};
