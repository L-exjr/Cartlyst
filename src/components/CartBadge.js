import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCartStore } from "../utils/cartStore";
import { useAuthStore } from "../utils/authStore";
import { COLORS, TYPOGRAPHY } from "../utils/theme";

export default function CartBadge() {
  const cart = useCartStore((state) => state.cart);
  const { isGuest } = useAuthStore();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (isGuest || cartItemCount === 0) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {cartItemCount > 99 ? "99+" : cartItemCount.toString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    backgroundColor: COLORS.error,
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    position: "absolute",
    right: -5,
    top: -5,
    zIndex: 1,
  },
  badgeText: {
    color: COLORS.text.inverse,
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: "bold",
  },
});
