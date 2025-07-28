import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { persist } from "zustand/middleware";

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [
        {
          id: 1,
          product: "Orange Juice",
          quantity: 2,
          total: 30,
          status: "Pending",
          date: "2025-07-18",
        },
        {
          id: 2,
          product: "Croissant",
          quantity: 5,
          total: 25,
          status: "Delivered",
          date: "2025-07-17",
        },
      ],
      updateStatus: async (id, newStatus) => {
        // Save previous status for rollback
        const prevOrder = get().orders.find((o) => o.id === id);
        const prevStatus = prevOrder ? prevOrder.status : null;
        // Optimistically update local state
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order,
          ),
        }));
        // Call backend API
        try {
          const response = await fetch(
            `https://your-api.com/orders/${id}/status`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: newStatus }),
            },
          );
          if (!response.ok) {
            throw new Error("Failed to update status");
          }
        } catch (err) {
          // Rollback local state if API fails
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === id ? { ...order, status: prevStatus } : order,
            ),
          }));
          alert("Failed to update status on server.");
        }
      },
    }),
    {
      name: "orders-storage",
      getStorage: () => SecureStoreStorage,
    },
  ),
);
