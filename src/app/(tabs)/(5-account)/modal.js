import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const COLORS = {
  white: "#fff",
  gold: "#d4af37",
  gray: "#222",
  gray2: "#555",
};

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
    padding: 8,
    position: "absolute",
    right: 24,
    top: 40,
    zIndex: 10,
  },
  closeText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    color: COLORS.gray2,
    fontSize: 18,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: COLORS.gray,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
