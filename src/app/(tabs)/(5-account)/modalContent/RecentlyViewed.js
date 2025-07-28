import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from '../../../../utils/theme'

export default function RecentlyViewedModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Viewed</Text>
      <Text>This is the Recently Viewed modal screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: COLORS.success,
    flex: 1,
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
