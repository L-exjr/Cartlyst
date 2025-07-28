import { create } from "zustand";
import { API_BASE_URL } from "./config";

const API_URL = `${API_BASE_URL}/api/exchange/rates`;

export const useCurrencyStore = create((set, get) => ({
  selectedCurrency: "USD",
  rates: { USD: 1 },
  lastUpdated: null,
  setCurrency: (currency) => set({ selectedCurrency: currency }),
  fetchRates: async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      console.log("Fetched rates from backend:", data); // Debug log
      if (data) {
        set({ rates: data, lastUpdated: new Date() });
      }
    } catch (e) {
      console.error("Error fetching rates:", e);
    }
  },
  convert: (amount, from = "USD", to = get().selectedCurrency) => {
    const rates = get().rates;
    if (from === to) return amount;
    if (!rates[from] || !rates[to]) return amount; // fallback
    return (amount / rates[from]) * rates[to];
  },
}));

// Fetch rates on store init
useCurrencyStore.getState().fetchRates();
