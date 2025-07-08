import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search
          color={COLORS.text.secondary}
          size={20}
          strokeWidth={2}
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
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  input: {
    color: COLORS.text.primary,
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: "row",
    height: 48,
    paddingHorizontal: SPACING.md,
    shadowColor: COLORS.text.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
});
