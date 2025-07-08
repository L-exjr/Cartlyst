import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../src/utils/authStore';
import ErrorBoundary from '../src/components/ErrorBoundary';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const {
    isLoggedIn,
    shouldCreateAccount,
    isGuest,
    isResettingPassword,
    isVerifying,
    verificationType,
  } = useAuthStore();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          {isLoggedIn || isGuest ? (
            <Stack.Screen name="(tabs)" />
          ) : (
            <>
              <Stack.Screen name="sign-in" />
              {shouldCreateAccount && <Stack.Screen name="sign-up" />}
              {isResettingPassword && <Stack.Screen name="reset-password" />}
              {isVerifying && (
                <Stack.Screen
                  name="verification"
                  options={{
                    presentation: 'modal',
                  }}
                  initialParams={{ type: verificationType }}
                />
              )}
            </>
          )}
        </Stack>
      </>
    </ErrorBoundary>
  );
}