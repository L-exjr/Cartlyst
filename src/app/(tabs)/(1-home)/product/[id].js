import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
} from "../../../../utils/theme";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../../../utils/config";
import { useCartStore } from "../../../../utils/cartStore";
import { useAuthStore } from "../../../../utils/authStore";
import { useTranslation } from "react-i18next";
import Price from "../../../../components/Price";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const userId = useAuthStore((state) => state.userId);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error(t("failedToFetchProduct"));
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(t("failedToLoadProductDetails"));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.infoSection,
            { flex: 1, justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.infoSection,
            { flex: 1, justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: COLORS.error }}>
            {error || t("productNotFound")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          {/* Product image fills the rounded area */}
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.fullImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.fullImage} />
          )}
          {/* Carousel dots (static for now) */}
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.row}>
            <Text style={styles.productName}>
              {product.title || product.name}
            </Text>
            <Price amount={getDiscountedPrice(product)} style={styles.price} />
          </View>
          {product.discount > 0 && (
            <Price
              amount={product.price}
              style={[
                styles.price,
                {
                  textDecorationLine: "line-through",
                  color: "#888",
                  marginLeft: 8,
                },
              ]}
            />
          )}
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.deliveryRow}>
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={18}
              color={COLORS.text.primary}
            />
            <Text style={styles.deliveryText}>{t("freeDelivery")}</Text>
          </View>
          <View style={styles.ratingRow}>
            <FontAwesome6 name="star" size={16} color={COLORS.primary} />
            <Text style={styles.ratingText}>{product.rating || 4.5}</Text>
            <Text style={styles.reviewsText}>{t("ratingAndReviews")}</Text>
          </View>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => addToCart(userId, product)}
          >
            <Text style={[styles.addToCartText, { fontWeight: "bold" }]}>
              {t("addToCart")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: COLORS.gray[400],
  },
  addToCartButton: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    marginTop: 16,
    paddingVertical: 12,
  },
  addToCartText: {
    color: COLORS.text.primary,
    fontWeight: "bold",
    ...TYPOGRAPHY.body,
  },
  buyNowText: {
    color: COLORS.text.primary,
    fontWeight: "bold",
    ...TYPOGRAPHY.body,
  },
  deliveryRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  deliveryText: {
    marginLeft: 6,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  dot: {
    backgroundColor: COLORS.gray[200],
    borderRadius: 5,
    height: 10,
    marginHorizontal: 4,
    width: 10,
  },
  dotsContainer: {
    alignItems: "center",
    bottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
  },
  fullImage: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: 260,
    overflow: "hidden",
    position: "relative",
  },
  infoSection: {
    backgroundColor: COLORS.background,
    flex: 1,
    padding: 16,
  },
  price: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    fontWeight: "bold",
  },
  productName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    fontWeight: "bold",
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 24,
  },
  ratingText: {
    marginLeft: 6,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: "bold",
  },
  reviewsText: {
    marginLeft: 8,
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
    marginTop: 0, // Removed headerHeight
  },
  scrollContent: {
    backgroundColor: COLORS.background,
    flexGrow: 1,
  },
});
