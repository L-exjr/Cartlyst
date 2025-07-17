import React from "react";
import { Stack } from "expo-router";

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
        name="product/[id]"
        options={{
          title: "Product Detail",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
