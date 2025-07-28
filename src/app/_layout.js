import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../utils/authStore";
import ErrorBoundary from "../components/ErrorBoundary";
import { useEffect } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../utils/i18n";
import { useCurrencyStore } from "../utils/currencyStore";
import countries from "i18n-iso-countries";
import "i18n-iso-countries/langs/en.json";

const COUNTRY_TO_CURRENCY = {
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  FR: "EUR",
  DE: "EUR",
  ES: "EUR",
  IT: "EUR",
  NG: "NGN",
  KE: "KES",
  ZA: "ZAR",
  IN: "INR",
  CN: "CNY",
  JP: "JPY",
  KR: "KRW",
  RU: "RUB",
  BR: "BRL",
  MX: "MXN",
  EG: "EGP",
  SA: "SAR",
  AE: "AED", // ...add more as needed
};
const COUNTRY_TO_LANGUAGE = {
  US: "en",
  GB: "en",
  FR: "fr",
  DE: "de",
  ES: "es",
  IT: "it",
  NG: "en",
  KE: "sw",
  ZA: "en",
  IN: "hi",
  CN: "zh",
  JP: "ja",
  KR: "ko",
  RU: "ru",
  BR: "pt",
  MX: "es",
  EG: "ar",
  SA: "ar",
  AE: "ar", // ...add more as needed
};

export default function RootLayout() {
  const {
    isLoggedIn,
    shouldCreateAccount,
    isGuest,
    isResettingPassword,
    isVerifying,
    verificationType,
  } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem("selectedCurrency");
        const storedLanguage = await AsyncStorage.getItem("selectedLanguage");
        if (!storedCurrency || !storedLanguage) {
          let countryCode = "US";
          let currency = "USD";
          let language = "en";
          // Get location permissions and country
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({});
            const geo = await Location.reverseGeocodeAsync(loc.coords);
            if (geo && geo[0] && geo[0].isoCountryCode) {
              countryCode = geo[0].isoCountryCode;
            }
          }
          // Map country to currency/language
          currency = COUNTRY_TO_CURRENCY[countryCode] || "USD";
          language = COUNTRY_TO_LANGUAGE[countryCode] || "en";
          // Set and persist
          useCurrencyStore.getState().setCurrency(currency);
          i18n.changeLanguage(language);
          await AsyncStorage.setItem("selectedCurrency", currency);
          await AsyncStorage.setItem("selectedLanguage", language);
        } else {
          useCurrencyStore.getState().setCurrency(storedCurrency);
          i18n.changeLanguage(storedLanguage);
        }
      } catch (e) {
        console.error("Error setting default currency/language:", e);
      }
    })();
  }, []);

  return (
    <ErrorBoundary>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="seller" />
      </Stack>
    </ErrorBoundary>
  );
}
