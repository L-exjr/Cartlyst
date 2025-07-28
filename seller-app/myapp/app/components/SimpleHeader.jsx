import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SimpleHeader({ title }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.iconBtn}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightSpace} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#191919",
    paddingTop: 0,
    paddingBottom: 0,
    height: 56,
    paddingHorizontal: 0,
  },
  iconBtn: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  rightSpace: {
    width: 56,
    height: 56,
  },
});
