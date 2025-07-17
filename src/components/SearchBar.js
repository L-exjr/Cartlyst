import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome6
          name="magnifying-glass"
          size={20}
          color={COLORS.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          placeholderTextColor={COLORS.text.secondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
  },
  input: {
    color: COLORS.text.primary,
    flex: 1,
    ...TYPOGRAPHY.body,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: "row",
    height: 40,
    paddingHorizontal: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
});
