import { create } from 'zustand';

export const useAnalyticsStore = create((set) => ({
  earningsData: {
    weekly: [
      { label: 'Mon', earnings: 100 },
      { label: 'Tue', earnings: 120 },
      { label: 'Wed', earnings: 90 },
      { label: 'Thu', earnings: 140 },
      { label: 'Fri', earnings: 200 },
      { label: 'Sat', earnings: 80 },
      { label: 'Sun', earnings: 150 },
    ],
    monthly: [
      { label: 'Jan', earnings: 500 },
      { label: 'Feb', earnings: 700 },
      { label: 'Mar', earnings: 650 },
      { label: 'Apr', earnings: 800 },
      { label: 'May', earnings: 900 },
      { label: 'Jun', earnings: 720 },
    ],
    yearly: [
      { label: '2022', earnings: 7000 },
      { label: '2023', earnings: 8200 },
      { label: '2024', earnings: 9600 },
    ],
  },
}));
