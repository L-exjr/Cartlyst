import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./config";
import { Alert } from "react-native";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      fetchCart: async (userId) => {
        if (!userId) return;
        try {
          const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
          if (response.ok) {
            const data = await response.json();
            // Map cartQuantity to quantity for frontend compatibility
            const mapped = data.map((item) => ({
              ...item,
              quantity: item.cartQuantity ?? item.quantity,
            }));
            console.log("fetchCart: data returned", mapped);
            set({ cart: mapped });
          }
        } catch (e) {
          // Optionally handle error
        }
      },
      addToCart: async (userId, product, quantity = 1) => {
        console.log("addToCart called", { userId, product, quantity });
        if (!userId) {
          console.log("No userId!");
          Alert.alert("No userId in addToCart", "userId is missing");
          return;
        }
        try {
          const response = await fetch(
            `${API_BASE_URL}/cart/add?userId=${userId}&productId=${product.id}&quantity=${quantity}`,
            {
              method: "POST",
            },
          );
          const text = await response.text();
          console.log("addToCart response", response.status, text);
          if (response.ok) {
            get().fetchCart(userId);
          }
        } catch (e) {
          Alert.alert("Cart Error", e.message);
        }
      },
      removeFromCart: async (userId, productId) => {
        if (!userId) return;
        try {
          const response = await fetch(
            `${API_BASE_URL}/cart/remove?userId=${userId}&productId=${productId}`,
            {
              method: "DELETE",
            },
          );
          if (response.ok) {
            get().fetchCart(userId);
          }
        } catch (e) {}
      },
      updateQuantity: async (userId, productId, quantity) => {
        if (!userId) return;
        // Remove if quantity is 0
        if (quantity <= 0) {
          get().removeFromCart(userId, productId);
          return;
        }
        // Remove then add with new quantity (since no update endpoint)
        await get().removeFromCart(userId, productId);
        await get().addToCart(userId, { id: productId }, quantity);
      },
      clearCart: async (userId) => {
        if (!userId) return;
        try {
          await fetch(`${API_BASE_URL}/cart/clear?userId=${userId}`, {
            method: "DELETE",
          });
        } catch (e) {}
        set({ cart: [] });
      },
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => ({
        setItem: SecureStore.setItemAsync,
        getItem: SecureStore.getItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
