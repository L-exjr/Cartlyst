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
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from 'react-i18next';
import Price from '../../../components/Price';

// Helper to get discounted price
function getDiscountedPrice(product) {
  if (!product) return 0;
  let discount = product.discount || 0;
  let price = product.price || 0;
  if (discount > 0 && discount < 1) {
    return price * (1 - discount);
  } else if (discount >= 1 && discount <= 100) {
    return price * (1 - discount / 100);
  } else {
    return price - discount;
  }
}

export default function CartScreen() {
  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const { isGuest, isLoggedIn, userId } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (isLoggedIn && userId) {
      fetchCart(userId);
    }
  }, [isLoggedIn, userId]);

  // Update subtotal calculation
  const subtotal = cart.reduce(
    (sum, item) => sum + getDiscountedPrice(item) * (item.quantity || 0),
    0,
  );

  // Show sign-in prompt for unauthenticated users
  if (!isLoggedIn || !userId) {
    return (
      <SignInPrompt
        title={t('signInToViewCart')}
        message={t('signInToSaveCart')}
        iconName="cart-outline"
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
          {t('cartEmpty')}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)/(1-home)")}
        >
          <Text style={styles.buttonText}>{t('continueShopping')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleRemoveFromCart = (productId) => {
    removeFromCart(userId, productId);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    updateQuantity(userId, productId, quantity);
  };

  const handleMoveToWishlist = (item) => {
    removeFromCart(userId, item.id);
    addToWishlist(userId, item);
  };

  // Cart with items UI
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{t('cartSummary')}</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SwipeableCartItem
            item={item}
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onMoveToWishlist={handleMoveToWishlist}
          />
        )}
        style={styles.list}
      />
      <View style={styles.summary}>
        <Price amount={subtotal} style={styles.subtotal} />
        <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/(tabs)/(3-cart)/CheckoutScreen')}>
          <Price amount={subtotal} style={styles.checkoutText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={() => clearCart(userId)}>
          <Text style={styles.clearText}>{t('clearCart')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    ...commonStyles.button,
    marginBottom: SPACING.lg,
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: COLORS.text.primary,
    fontWeight: 'bold',
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
    color: COLORS.text.primary,
    fontWeight: 'bold',
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
    color: COLORS.text.primary,
    fontWeight: 'bold',
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


