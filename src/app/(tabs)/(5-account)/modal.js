import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING, TYPOGRAPHY } from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";

export default function Modal() {
  const router = useRouter();
  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Modal</Text>
      <Text style={styles.content}>This is a modal screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    padding: SPACING.sm,
    position: "absolute",
    right: SPACING.xl,
    top: 40,
    zIndex: 10,
  },
  closeText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.body,
    fontWeight: "bold",
  },
  content: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
  },
  modalContainer: {
    ...commonStyles.centered,
    backgroundColor: COLORS.surface,
    flex: 1,
    padding: SPACING.xl,
  },
  title: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.md,
  },
});
