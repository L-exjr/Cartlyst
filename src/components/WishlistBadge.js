import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWishlistStore } from "../utils/wishlistStore";
import { useAuthStore } from "../utils/authStore";
import { COLORS, TYPOGRAPHY } from "../utils/theme";

export default function WishlistBadge() {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const { isGuest } = useAuthStore();

  if (isGuest || wishlist.length === 0) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {wishlist.length > 99 ? "99+" : wishlist.length.toString()}
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
