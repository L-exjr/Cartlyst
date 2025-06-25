import React from "react";
import { Stack } from "expo-router";
import { COLORS, TYPOGRAPHY } from "../../../utils/theme";

export default function WishlistLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Wishlist",
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitleStyle: {
            ...TYPOGRAPHY.h2,
          },
        }}
      />
    </Stack>
  );
}
