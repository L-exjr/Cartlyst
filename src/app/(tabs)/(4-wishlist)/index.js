import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useWishlistStore } from "../../../utils/wishlistStore";
import { useCartStore } from "../../../utils/cartStore";
import  SignInPrompt  from "../../../components/SignInPrompt";
import { useAuthStore } from "../../../utils/authStore";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
} from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";

export default function WishlistScreen() {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist,
  );
  const addToCart = useCartStore((state) => state.addToCart);
  const { isGuest } = useAuthStore();
  const router = useRouter();
  
  // Show sign-in prompt for guest users
  if (isGuest) {
    return (
      <SignInPrompt
        title="Sign In to View Wishlist"
        message="Sign in to save your wishlist items and access your shopping history."
        iconName="heart-half-full"
      />
    );
  }

  if (wishlist.length === 0) {
    // Empty wishlist UI
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome6
          name="heart"
          size={64}
          color={COLORS.primary}
          style={styles.icon}
        />
        <Text style={styles.emptyText}>
          Your Wishlist is empty! Tap the heart-shaped icon on an item to add it
          to your wishlist. All your saved items will be displayed here.
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

  // Wishlist with items UI
  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: SPACING.sm,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  addToCartText: {
    color: COLORS.text.inverse,
    ...TYPOGRAPHY.caption,
    fontWeight: "bold",
  },
  button: {
    ...commonStyles.button,
    marginBottom: SPACING.lg,
  },
  buttonText: {
    ...commonStyles.buttonText,
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
  icon: {
    marginBottom: SPACING.lg,
  },
  image: {
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.lg,
    height: 80,
    marginRight: SPACING.md,
    width: 80,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  item: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: "row",
    marginBottom: SPACING.md,
    padding: SPACING.md,
    ...commonStyles.shadow,
  },
  price: {
    color: COLORS.primary,
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.xs,
  },
  remove: {
    color: COLORS.error,
    marginLeft: SPACING.md,
    ...TYPOGRAPHY.caption,
  },
  title: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
});
