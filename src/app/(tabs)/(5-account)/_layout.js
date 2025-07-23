import React from "react";
import { Stack } from "expo-router";
import { COLORS, TYPOGRAPHY } from "../../../utils/theme";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Account",
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitleStyle: {
            ...TYPOGRAPHY.h2,
          },
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen name="orders-modal" options={{ presentation: "modal", headerShown: true, title: "Orders" }} />
      <Stack.Screen name="vouchers-modal" options={{ presentation: "modal", headerShown: true, title: "Vouchers" }} />
      <Stack.Screen name="ratings-modal" options={{ presentation: "modal", headerShown: true, title: "Ratings & Reviews" }} />
      <Stack.Screen name="interests-modal" options={{ presentation: "modal", headerShown: true, title: "Interests" }} />
      <Stack.Screen name="recently-viewed-modal" options={{ presentation: "modal", headerShown: true, title: "Recently Viewed" }} />
      <Stack.Screen name="recently-searched-modal" options={{ presentation: "modal", headerShown: true, title: "Recently Searched" }} />
      <Stack.Screen name="buy-again-modal" options={{ presentation: "modal", headerShown: true, title: "Buy Again" }} />
      <Stack.Screen name="lists-modal" options={{ presentation: "modal", headerShown: true, title: "Lists and Registries" }} />
      <Stack.Screen name="currency-modal" options={{ presentation: "modal", headerShown: true, title: "Currency" }} />
      <Stack.Screen name="payment-modal" options={{ presentation: "modal", headerShown: true, title: "Payment Settings" }} />
      <Stack.Screen name="address-modal" options={{ presentation: "modal", headerShown: true, title: "Address Book" }} />
      <Stack.Screen name="legal-modal" options={{ presentation: "modal", headerShown: true, title: "Legal & About" }} />
      <Stack.Screen name="rate-modal" options={{ presentation: "modal", headerShown: true, title: "Rate Our App" }} />
      <Stack.Screen name="language-modal" options={{ presentation: "modal", headerShown: true, title: "Language" }} />
    </Stack>
  );
}
