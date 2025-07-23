import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./config";
import { Alert } from "react-native";

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
        console.log('addToWishlist called', { userId, product });
        if (!userId) {
          console.log('No userId!');
          Alert.alert('No userId in addToWishlist', 'userId is missing');
          return;
        }
        try {
          const response = await fetch(`${API_BASE_URL}/wishlist/add?userId=${userId}&productId=${product.id}`, {
            method: "POST",
          });
          const text = await response.text();
          console.log('addToWishlist response', response.status, text);
          if (response.ok) {
            get().fetchWishlist(userId);
          }
        } catch (e) {
          Alert.alert('Wishlist Error', e.message);
        }
      },
      removeFromWishlist: async (userId, productId) => {
        console.log('removeFromWishlist called', { userId, productId });
        if (!userId) {
          console.log('No userId!');
          Alert.alert('No userId in removeFromWishlist', 'userId is missing');
          return;
        }
        try {
          const response = await fetch(`${API_BASE_URL}/wishlist/remove?userId=${userId}&productId=${productId}`, {
            method: "DELETE",
          });
          const text = await response.text();
          console.log('removeFromWishlist response', response.status, text);
          if (response.ok) {
            get().fetchWishlist(userId);
          }
        } catch (e) {
          Alert.alert('Wishlist Error', e.message);
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
