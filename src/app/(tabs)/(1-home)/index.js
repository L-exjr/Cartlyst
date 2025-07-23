import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import SearchBarWithHistory from "../../../components/SearchBarWithHistory";
import ProductCard from "../../../components/ProductCard";
import CarouselCard from "../../../components/CarouselCard";
import CategoryCircles from "../../../components/CategoryCircles";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { API_BASE_URL } from "../../../utils/config";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
} from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";
import { useWishlistStore } from "../../../utils/wishlistStore";
import { useCartStore } from "../../../utils/cartStore";
import { useAuthStore } from "../../../utils/authStore";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from 'react-i18next';


const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualScroll, setManualScroll] = useState(false);
  const [dotOffset] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssistant, setShowAssistant] = useState(false);

  const insets = useSafeAreaInsets();
  const itemWidth = width;
  const itemGap = width * 0.025;
  const dotSize = 8;
  const dotMargin = 4;
  const visibleDots = 10;
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);

  // Move these hooks up before any return statements
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const userId = useAuthStore((state) => state.userId);

  const dotContainerWidth =
    (dotSize + dotMargin * 2) * Math.min(carouselItems.length, visibleDots);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchCategories(),
          fetchFeaturedProducts(),
          fetchCarouselItems(),
        ]);
      } catch (err) {
        setError("Failed to load data. Please check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      throw error;
    }
  };

  const fetchCarouselItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/carousel`);
      if (!response.ok) throw new Error("Failed to fetch carousel items");
      const data = await response.json();
      setCarouselItems(data);
    } catch (error) {
      throw error;
    }
  };

  // Add this handler for searching
  const handleSearch = (term, categoryId) => {
    // Defensive: find the category object if only name is passed
    let selectedCategory = null;
    if (typeof categoryId === 'number') {
      selectedCategory = categories.find(cat => cat.id === categoryId);
    } else if (typeof categoryId === 'string') {
      // Try to find by name (legacy)
      selectedCategory = categories.find(cat => cat.name === categoryId);
    }
    // Fallback to first category if not found
    if (!selectedCategory && categories.length > 0) {
      selectedCategory = categories[0];
    }
    const selectedCategoryId = selectedCategory ? selectedCategory.id : '';
    console.log('Home search term:', term, 'categoryId:', selectedCategoryId, 'categoryName:', selectedCategory?.name);
    if (term && term.trim() && selectedCategoryId) {
      router.push({
        pathname: '/(tabs)/(2-categories)/products/' + selectedCategoryId,
        params: { categoryId: selectedCategoryId, categoryName: selectedCategory?.name, search: term }
      });
    }
  };

  // Example: search by product ID (single)
  const handleProductIdSearch = (productId) => {
    console.log('Navigating to products screen with productId:', productId);
    router.push({
      pathname: '/(tabs)/(2-categories)/products/',
      params: { productId }
    });
  };

  // Update fetchFeaturedProducts to accept a search term
  const fetchFeaturedProducts = async (searchTerm = "") => {
    try {
      let url = `${API_BASE_URL}/products`;
      if (searchTerm) url += `?search=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      if (Array.isArray(data)) {
        setFeaturedProducts(data);
      } else {
        setFeaturedProducts([]);
        // Optionally show error: data.error
      }
    } catch (error) {
      setFeaturedProducts([]);
      // Optionally show error
    }
  };

  useEffect(() => {
    if (manualScroll || carouselItems.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % carouselItems.length;
      scrollToIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, manualScroll, carouselItems.length]);

  useEffect(() => {
    if (carouselItems.length === 0) return;
    const scrollTo =
      activeIndex >= visibleDots - 2
        ? Math.max(
            0,
            (activeIndex - (visibleDots - 2)) * (dotSize + dotMargin * 2),
          )
        : 0;
    Animated.spring(dotOffset, {
      toValue: -scrollTo,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, carouselItems.length]);

  const scrollToIndex = (index) => {
    if (!flatListRef.current || index >= carouselItems.length) return;
    flatListRef.current.scrollToOffset({
      offset: index * (itemWidth + itemGap),
      animated: true,
    });
    setActiveIndex(index);
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (itemWidth + itemGap));
    if (index !== activeIndex && index >= 0 && index < carouselItems.length) {
      setActiveIndex(index);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text={t('loading')} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('homeError', 'Failed to load data. Please check your internet connection.')}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            setError(null);
            fetchData();
          }}
        >
          <Text style={styles.retryText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isInCart = (productId) => cart.some((item) => item.id === productId);
  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

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
    <SafeAreaView>
      <View style={styles.fixedHeader}>
        <SearchBarWithHistory
          onSearch={handleSearch}
          suggestionsSource={featuredProducts.map(p => ({ title: p.title, category: typeof p.category === 'string' ? p.category : (p.category?.name || '') }))}
          categoryName={t('all')}
          placeholder={t('searchPlaceholder', 'Search products...')}
          onAssistantPress={() => router.push('/(tabs)/(1-home)/Cartlyst')}
        />
      </View>
      <ScrollView>
        {carouselItems.length > 0 && (
          <View style={styles.carouselWrapper}>
            <FlatList
              ref={flatListRef}
              data={carouselItems}
              horizontal
              snapToInterval={itemWidth + itemGap}
              snapToAlignment="start"
              decelerationRate="fast"
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ width: itemWidth, marginRight: itemGap }}>
                  <CarouselCard
                    source={item.source}
                    type={item.type}
                    title={item.title}
                  />
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onScrollBeginDrag={() => setManualScroll(true)}
              onMomentumScrollEnd={() => setManualScroll(false)}
              getItemLayout={(data, index) => ({
                length: itemWidth + itemGap,
                offset: (itemWidth + itemGap) * index,
                index,
              })}
            />
            <View style={styles.carouselBar}>
              {carouselItems[activeIndex]?.title && (
                <Text style={styles.carouselText}>
                  {carouselItems[activeIndex].title}
                </Text>
              )}
              <View
                style={[styles.dotsContainer, { width: dotContainerWidth }]}
              >
                <Animated.View
                  style={[
                    styles.dotsRow,
                    {
                      transform: [{ translateX: dotOffset }],
                    },
                  ]}
                >
                  {carouselItems.map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        setManualScroll(true);
                        scrollToIndex(i);
                        setTimeout(() => setManualScroll(false), 1000);
                      }}
                    >
                      <View
                        style={[
                          styles.dot,
                          {
                            backgroundColor:
                              i === activeIndex
                                ? COLORS.primary
                                : COLORS.surface,
                            width: dotSize,
                            height: dotSize,
                            marginHorizontal: dotMargin,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.paddedHorizontal}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('categories')}</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/(2-categories)")}>
              <Text style={styles.seeAllText}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <CategoryCircles
            categories={categories.slice(0, 5)}
            onPress={(category) => router.push({
              pathname: '/(tabs)/(2-categories)/products/' + category.id,
              params: { categoryId: category.id, categoryName: category.name }
            })}
          />

          <Text style={styles.sectionTitle}>{t('featuredProducts')}</Text>
          {featuredProducts.length > 0 ? (
            <FlatList
              data={featuredProducts}
              numColumns={2}
              columnWrapperStyle={styles.spaceBetween}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  title={item.title}
                  price={item.price} // original price from database
                  discount={item.discount}
                  rating={item.rating}
                  image={item.image}
                  onPress={() => router.push(`/product/${item.id}`)}
                  onPressHeart={() => {
                    console.log('onPressHeart', { userId, item });
                    if (!userId) Alert.alert(t('noUserIdTitle'), t('noUserIdMsg'));
                    if (isInWishlist(item.id)) {
                      removeFromWishlist(userId, item.id);
                    } else {
                      addToWishlist(userId, item);
                    }
                  }}
                  onAddToCart={() => {
                    console.log('onAddToCart', { userId, item });
                    if (!userId) Alert.alert(t('noUserIdTitle'), t('noUserIdMsg'));
                    addToCart(userId, item, 1);
                  }}
                  isFavorite={isInWishlist(item.id)}
                />
              )}
            />
          ) : (
            <Text style={styles.noProductsText}>
              {t('noFeaturedProducts')}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  carouselBar: {
    backgroundColor: COLORS.overlay,
    bottom: 0,
    flexDirection: "column",
    justifyContent: "center",
    left: 0,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    position: "absolute",
    right: 0,
  },
  carouselText: {
    color: COLORS.text.inverse,
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.xs,
  },
  carouselWrapper: {
    height: 170,
    marginBottom: SPACING.sm,
    position: "relative",
  },
  container: {
    ...commonStyles.container,
  },
  dot: {
    borderRadius: BORDER_RADIUS.sm,
  },
  dotsContainer: {
    alignSelf: "center",
    height: 20,
    overflow: "hidden",
  },
  dotsRow: { flexDirection: "row" },
  errorContainer: {
    ...commonStyles.centered,
    backgroundColor: COLORS.background,
    flex: 1,
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  fixedHeader: {
    zIndex: 10,
  },
  noProductsText: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    marginTop: SPACING.lg,
    textAlign: "center",
  },
  paddedHorizontal: { paddingHorizontal: SPACING.sm },
  retryButton: {
    ...commonStyles.button,
  },
  retryText: {
    ...commonStyles.buttonText,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  seeAllText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.caption,
    fontWeight: "bold",
  },
  spaceBetween: { justifyContent: "space-between" },
});
