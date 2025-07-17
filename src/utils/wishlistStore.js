import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./config";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      fetchWishlist: async (userId) => {
        if (!userId) return;
        try {
          const response = await fetch(`${API_BASE_URL}/wishlist/${userId}`);
          if (response.ok) {
            const data = await response.json();
            console.log('fetchWishlist: data returned', data);
            set({ wishlist: data });
          }
        } catch (e) {}
      },
      addToWishlist: async (userId, product) => {
        if (!userId) return;
        try {
          const response = await fetch(`${API_BASE_URL}/wishlist/add?userId=${userId}&productId=${product.id}`, {
            method: "POST",
          });
          if (response.ok) {
            get().fetchWishlist(userId);
          }
        } catch (e) {}
      },
      removeFromWishlist: async (userId, productId) => {
        if (!userId) {
          console.log('removeFromWishlist: missing userId', { userId, productId });
          return;
        }
        console.log('removeFromWishlist: called', { userId, productId });
        try {
          const response = await fetch(`${API_BASE_URL}/wishlist/remove?userId=${userId}&productId=${productId}`, {
            method: "DELETE",
          });
          console.log('removeFromWishlist: response', response.status);
          if (response.ok) {
            console.log('removeFromWishlist: success, fetching updated wishlist');
            get().fetchWishlist(userId);
          } else {
            const errorText = await response.text();
            console.log('removeFromWishlist: error response', errorText);
          }
        } catch (e) {
          console.log('removeFromWishlist: fetch error', e);
        }
      },
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "wishlist-store",
      storage: createJSONStorage(() => ({
        setItem: SecureStore.setItemAsync,
        getItem: SecureStore.getItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
