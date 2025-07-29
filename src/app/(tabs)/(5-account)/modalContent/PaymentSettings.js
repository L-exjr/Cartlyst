import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../../utils/theme";

export default function PaymentModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Settings</Text>
      <Text>This is the Payment Settings modal screen.</Text>
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
