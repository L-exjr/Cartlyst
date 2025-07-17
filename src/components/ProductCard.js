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

export default function ProductCard({
  image,
  title,
  price = 0, // Default to 0 if undefined
  discount = 0, // Default to 0 if undefined
  rating = 0,
  onPress,
  onPressHeart,
  onAddToCart,
  isFavorite = false,
  userId,
  disabled = false,
}) {
  // Ensure price and discount are numbers
  const safePrice = Number(price) || 0;
  const safeDiscount = Number(discount) || 0;
  const discountedPrice = safePrice - (safePrice * safeDiscount) / 100;

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
          onPress={() => onPressHeart(userId)}
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
          <Text style={styles.discountedPrice}>
            ${discountedPrice.toFixed(2)}
          </Text>
          {safeDiscount > 0 && (
            <Text style={styles.originalPrice}>${safePrice.toFixed(2)}</Text>
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
            onPress={disabled ? undefined : () => onAddToCart(userId)}
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
