import React from "react";
import { Stack } from "expo-router";
import { COLORS } from "../../../utils/theme";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Cartlyst"
        options={({ route }) => ({
          title: route?.params?.sessionName || 'Cartlyst',
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.primary },
          tabBarStyle: { display: 'none' },
        })}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          title: "Product Detail",
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      />
    </Stack>
  );
}
