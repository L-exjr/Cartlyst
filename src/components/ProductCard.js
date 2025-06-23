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

const COLORS = {
  card: "#d9d9d9",
  card2: "#d2d0d0",
  overlay: "rgba(0,0,0,0.05)",
  overlay2: "rgba(255, 255, 255, 0.4)",
  gold: "#ffd700",
  white: "#fff",
  gray: "#333",
  gray2: "#222",
  gray3: "#555",
};

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
      android_ripple={{ color: "#f1f1f1" }}
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
          <Feather
            name="heart"
            color={isFavorite ? "#ff4444" : "#fff"}
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
          {discount > 0 && (
            <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
          )}
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <FontAwesome
                key={index}
                name="star"
                size={14}
                color={index < rating ? "#ffd700" : "#808080"}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={onAddToCart}
            style={styles.cartIconWrapper}
          >
            <Feather name="shopping-cart" size={20} color="#000" />
            <Entypo
              name="plus"
              size={12}
              color="#000"
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
    borderRadius: 15,
    marginBottom: 16,
    overflow: "hidden",
    width: "48%",
  },
  cartIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  detailsContainer: {
    padding: 12,
  },
  discountBadge: {
    backgroundColor: COLORS.overlay2,
    bottom: "2%",
    paddingHorizontal: 6,
    paddingVertical: 6,
    position: "absolute",
    right: "2%",
  },
  discountText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: "bold",
  },
  discountedPrice: {
    color: COLORS.gray2,
    fontSize: 15,
    fontWeight: "500",
  },
  heartIcon: {
    alignItems: "center",
    backgroundColor: COLORS.overlay,
    borderRadius: 50,
    height: 45,
    justifyContent: "center",
    padding: 6,
    position: "absolute",
    right: "1%",
    top: "2.5%",
    width: 45,
    zIndex: 1,
  },
  image: {
    backgroundColor: COLORS.card2,
    borderRadius: 15,
    height: 169,
    width: "100%",
  },

  imageContainer: {
    position: "relative",
  },
  originalPrice: {
    color: COLORS.gray3,
    fontSize: 13,
    textDecorationLine: "line-through",
  },
  plusOverlay: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 1,
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
    color: COLORS.gray,
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 18,
    marginBottom: 4,
  },
});
