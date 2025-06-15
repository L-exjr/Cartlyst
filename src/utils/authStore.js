import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      shouldCreateAccount: false,
      isGuest: false,
      isResettingPassword: false,
      isVerifying: false,
      verificationType: null, // 'email' or 'phone'
      signUpData: null, // Store sign-up form data during verification
      setGuestMode: () => set({ isGuest: true }),
      setshouldCreateAccount: (value) => set({ shouldCreateAccount: value }),
      setResettingPassword: (value) => set({ isResettingPassword: value }),
      setVerification: (type, data = null) => set({ 
        isVerifying: true, 
        verificationType: type,
        signUpData: data
      }),
      clearVerification: () => set({ 
        isVerifying: false, 
        verificationType: null,
        signUpData: null
      }),
      logIn: () => {
        set((state) => ({
          ...state,
          isLoggedIn: true,
          isVerifying: false,
          verificationType: null,
          signUpData: null,
        }));
      },
      logOut: () => {
        set((state) => ({
          ...state,
          isLoggedIn: false,
          isGuest: false,
          isVerifying: false,
          verificationType: null,
          signUpData: null,
        }));
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => ({
        setItem: SecureStore.setItemAsync,
        getItem: SecureStore.getItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    }
  )
);
