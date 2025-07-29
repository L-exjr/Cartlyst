import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../../../utils/theme";

export default function AddressModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Address Book</Text>
      <Text>This is the Address Book modal screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    flex: 1,
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
