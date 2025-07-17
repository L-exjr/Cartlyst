import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../utils/authStore";
import ErrorBoundary from "../components/ErrorBoundary";

export default function RootLayout() {
  const {
    isLoggedIn,
    shouldCreateAccount,
    isGuest,
    isResettingPassword,
    isVerifying,
    verificationType,
  } = useAuthStore();

  return (
    <ErrorBoundary>
      <React.Fragment>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Protected guard={isLoggedIn || isGuest}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Protected guard={shouldCreateAccount}>
              <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={isResettingPassword}>
              <Stack.Screen
                name="reset-password"
                options={{ headerShown: false }}
              />
            </Stack.Protected>
            <Stack.Protected guard={isVerifying}>
              <Stack.Screen
                name="verification"
                options={{
                  headerShown: false,
                  presentation: "modal",
                }}
                initialParams={{ type: verificationType }}
              />
            </Stack.Protected>
          </Stack.Protected>
        </Stack>
      </React.Fragment>
    </ErrorBoundary>
  );
}
