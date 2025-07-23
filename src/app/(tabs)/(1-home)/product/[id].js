import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../../../utils/theme";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../../../utils/config";
import { useCartStore } from "../../../../utils/cartStore";
import { useAuthStore } from "../../../../utils/authStore";
import { useTranslation } from 'react-i18next';
import Price from '../../../../components/Price';

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
        if (!response.ok) throw new Error(t('failedToFetchProduct'));
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(t('failedToLoadProductDetails'));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.infoSection, { flex: 1, justifyContent: "center", alignItems: "center" }]}> 
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.infoSection, { flex: 1, justifyContent: "center", alignItems: "center" }]}> 
          <Text style={{ color: COLORS.error }}>{error || t('productNotFound')}</Text>
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
            <Image source={{ uri: product.image }} style={styles.fullImage} resizeMode="cover" />
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
            <Text style={styles.productName}>{product.title || product.name}</Text>
            <Price amount={getDiscountedPrice(product)} style={styles.price} />
          </View>
          {product.discount > 0 && (
            <Price amount={product.price} style={[styles.price, { textDecorationLine: 'line-through', color: '#888', marginLeft: 8 }]} />
          )}
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.deliveryRow}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={18} color={COLORS.text.primary} />
            <Text style={styles.deliveryText}>{t('freeDelivery')}</Text>
          </View>
          <View style={styles.ratingRow}>
            <FontAwesome6 name="star" size={16} color={COLORS.primary} />
            <Text style={styles.ratingText}>{product.rating || 4.5}</Text>
            <Text style={styles.reviewsText}>{t('ratingAndReviews')}</Text>
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(userId, product)}>
            <Text style={[styles.addToCartText, {fontWeight: 'bold'}]}>{t('addToCart')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: 0, // Removed headerHeight
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
    height: 260,
    overflow: "hidden",
    position: "relative",
  },
  fullImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: COLORS.primary,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.gray[400],
  },
  infoSection: {
    padding: 16,
    backgroundColor: COLORS.background,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productName: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  price: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    fontWeight: "bold",
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  deliveryText: {
    marginLeft: 6,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
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
  addToCartButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  addToCartText: {
    color: COLORS.text.primary,
    fontWeight: 'bold',
    ...TYPOGRAPHY.body,
  },
  buyNowText: {
    color: COLORS.text.primary,
    fontWeight: 'bold',
    ...TYPOGRAPHY.body,
  },
});