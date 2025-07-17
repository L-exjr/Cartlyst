import React from "react";
import { Stack } from "expo-router";
import { COLORS, TYPOGRAPHY } from "../../../utils/theme";

export default function CartLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Cart",
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
        name="CheckoutScreen"
        options={{
          title: "Checkout",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
