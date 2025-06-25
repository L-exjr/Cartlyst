import { StyleSheet } from "react-native";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from "./theme";

export const commonStyles = StyleSheet.create({
  // Buttons
  button: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },
  buttonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.primary,
  },

  // Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },

  // Layout
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },

  // Inputs
  input: {
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    fontSize: TYPOGRAPHY.body.fontSize,
    height: 50,
    padding: SPACING.md,
  },
});
