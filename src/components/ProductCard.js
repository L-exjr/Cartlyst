import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { FontAwesome, Feather, Entypo } from "@expo/vector-icons";
import PropTypes from "prop-types";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../utils/theme";
import Price from "./Price";

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

export default function ProductCard({
  product,
  image,
  title,
  price = 0, // original price from database
  discount = 0,
  rating = 0,
  onPress,
  onPressHeart,
  onAddToCart,
  isFavorite = false,
  disabled = false,
}) {
  // Ensure price and discount are numbers
  const safePrice = Number(price) || 0;
  const safeDiscount = Number(discount) || 0;
  // Always use discounted price for display
  let discountedPrice = safePrice;
  // In ProductCard, calculate original price for strikethrough if discount is present
  let originalPrice = null;
  if (typeof product?.discount === "number" && product.discount > 0) {
    // If discount is a percentage (0-1 or 0-100)
    let discount = product.discount;
    if (discount > 0 && discount < 1) {
      originalPrice = safePrice / (1 - discount);
    } else if (discount >= 1 && discount <= 100) {
      originalPrice = safePrice / (1 - discount / 100);
    }
  }
  const showOriginal = originalPrice && originalPrice > discountedPrice;

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: COLORS.gray[100] }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />

        {safeDiscount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{safeDiscount}%</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.heartIcon}
          onPress={onPressHeart}
          activeOpacity={0.7}
        >
          <Feather
            name="heart"
            color={isFavorite ? COLORS.error : COLORS.text.inverse}
            size={20}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>

        <View style={styles.priceContainer}>
          <Price
            amount={discountedPrice}
            style={styles.discountedPrice}
            from={product?.currency || "USD"}
          />
          {showOriginal && (
            <Price
              amount={originalPrice}
              style={styles.originalPrice}
              from={product?.currency || "USD"}
            />
          )}
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <FontAwesome
                key={index}
                name="star"
                size={14}
                color={index < rating ? COLORS.primary : COLORS.text.tertiary}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={disabled ? undefined : onAddToCart}
            style={[styles.cartIconWrapper, disabled && { opacity: 0.2 }]}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
          >
            <Feather
              name="shopping-cart"
              size={20}
              color={COLORS.text.primary}
            />
            <Entypo
              name="plus"
              size={12}
              color={COLORS.text.primary}
              style={styles.plusOverlay}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  discount: PropTypes.number,
  rating: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  onPressHeart: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool,
  userId: PropTypes.string,
  disabled: PropTypes.bool,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: "hidden",
    width: "48%",
    ...SHADOWS.small,
  },
  cartIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  detailsContainer: {
    padding: SPACING.sm,
  },
  discountBadge: {
    backgroundColor: COLORS.overlayLight,
    bottom: "2%",
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    position: "absolute",
    right: "2%",
  },
  discountText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.caption,
    fontWeight: "bold",
  },
  discountedPrice: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
    fontWeight: "500",
  },
  heartIcon: {
    alignItems: "center",
    backgroundColor: COLORS.overlay,
    borderRadius: 50,
    height: 45,
    justifyContent: "center",
    padding: SPACING.xs,
    position: "absolute",
    right: "1%",
    top: "2.5%",
    width: 45,
    zIndex: 1,
  },
  image: {
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.lg,
    height: 169,
    width: "100%",
  },

  imageContainer: {
    position: "relative",
  },
  originalPrice: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.caption,
    textDecorationLine: "line-through",
  },
  plusOverlay: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: SPACING.xs,
    position: "absolute",
    right: "-1.5%",
    top: 0,
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  title: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.h3,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
});
