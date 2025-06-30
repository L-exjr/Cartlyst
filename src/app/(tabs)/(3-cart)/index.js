import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useCartStore } from "../../../utils/cartStore";
import { useWishlistStore } from "../../../utils/wishlistStore";
import { useAuthStore } from "../../../utils/authStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
} from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";
import SignInPrompt from "../../../components/SignInPrompt";
import SwipeableCartItem from "../../../components/SwipeableCartItem";

export default function CartScreen() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const { isGuest } = useAuthStore();
  const router = useRouter();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Show sign-in prompt for guest users
  if (isGuest) {
    return (
      <SignInPrompt
        title="Sign In to View Cart"
        message="Create an account or sign in to save your cart items and access your shopping history."
        iconName="cart-shopping"
      />
    );
  }

  if (cart.length === 0) {
    // Empty cart UI
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="cart-outline"
          size={64}
          color={COLORS.primary}
          style={styles.icon}
        />
        <Text style={styles.emptyText}>
          Your cart is empty! Start shopping to add items to your cart.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)/(1-home)")}
        >
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleMoveToWishlist = (item) => {
    removeFromCart(item.id);
    addToWishlist(item);
  };

  // Cart with items UI
  return (
    <View style={styles.container}>
      <Text style={styles.header}>CART SUMMARY</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SwipeableCartItem
            item={item}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onMoveToWishlist={handleMoveToWishlist}
          />
        )}
        style={styles.list}
      />
      <View style={styles.summary}>
        <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>
            Checkout (${subtotal.toFixed(2)})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    ...commonStyles.button,
    marginBottom: SPACING.lg,
  },
  buttonText: {
    ...commonStyles.buttonText,
  },
  checkoutButton: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    width: "100%",
  },
  checkoutText: {
    color: COLORS.text.inverse,
    fontWeight: "bold",
    ...TYPOGRAPHY.body,
  },
  clearButton: {
    alignItems: "center",
    backgroundColor: COLORS.transparent,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    width: "100%",
  },
  clearText: {
    color: COLORS.error,
    fontWeight: "bold",
    ...TYPOGRAPHY.body,
  },
  container: {
    ...commonStyles.container,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    ...commonStyles.centered,
    backgroundColor: COLORS.background,
    flex: 1,
    padding: SPACING.lg,
  },
  emptyText: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  header: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  icon: {
    marginBottom: SPACING.lg,
  },
  list: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  subtotal: {
    fontWeight: "bold",
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.sm,
  },
  summary: {
    alignItems: "center",
    borderColor: COLORS.gray[200],
    borderTopWidth: 1,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
});
