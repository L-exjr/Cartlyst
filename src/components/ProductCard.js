import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Star, Heart, ShoppingCart, Plus } from "lucide-react-native";
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
  price,
  discount = 0,
  rating = 0,
  onPress,
  onPressHeart,
  onAddToCart,
  isFavorite = false,
}) {
  const discountedPrice = price - (price * discount) / 100;

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

        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.heartIcon}
          onPress={onPressHeart}
          activeOpacity={0.7}
        >
          <Heart
            color={isFavorite ? COLORS.error : COLORS.text.inverse}
            size={20}
            strokeWidth={2}
            fill={isFavorite ? COLORS.error : 'transparent'}
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
          {discount > 0 && (
            <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
          )}
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={14}
                color={index < rating ? COLORS.primary : COLORS.text.tertiary}
                strokeWidth={1.5}
                fill={index < rating ? COLORS.primary : 'transparent'}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={onAddToCart}
            style={styles.cartIconWrapper}
          >
            <ShoppingCart
              size={20}
              color={COLORS.text.primary}
              strokeWidth={2}
            />
            <Plus
              size={12}
              color={COLORS.text.primary}
              strokeWidth={2}
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
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  cartIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  detailsContainer: {
    padding: SPACING.md,
  },
  discountBadge: {
    backgroundColor: COLORS.error,
    bottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    position: "absolute",
    right: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  discountText: {
    color: COLORS.text.inverse,
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    fontWeight: "bold",
  },
  discountedPrice: {
    color: COLORS.text.primary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: "500",
  },
  heartIcon: {
    alignItems: "center",
    backgroundColor: COLORS.overlayLight,
    borderRadius: 50,
    height: 36,
    justifyContent: "center",
    padding: SPACING.xs,
    position: "absolute",
    right: SPACING.sm,
    top: SPACING.sm,
    width: 36,
    zIndex: 1,
  },
  image: {
    backgroundColor: COLORS.gray[200],
    height: 160,
    width: "100%",
  },

  imageContainer: {
    position: "relative",
  },
  originalPrice: {
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textDecorationLine: "line-through",
    marginLeft: SPACING.xs,
  },
  plusOverlay: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: SPACING.xs,
    position: "absolute",
    right: -2,
    top: 0,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
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
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
});
