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
        name="modalContent"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
