import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.centered,
    ...commonStyles.container,
  },
  title: {
    ...TYPOGRAPHY.h3,
  },
});
