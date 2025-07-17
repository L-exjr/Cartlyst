import React from "react";
import { Stack } from "expo-router";

export default function CategoriesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Categories",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
