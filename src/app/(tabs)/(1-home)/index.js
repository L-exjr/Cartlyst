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
} from "react-native";
import { useRouter } from "expo-router";
import SearchBar from "../../../components/SearchBar";
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

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualScroll, setManualScroll] = useState(false);
  const [dotOffset] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemWidth = width;
  const itemGap = width * 0.025;
  const dotSize = 8;
  const dotMargin = 4;
  const visibleDots = 10;
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);

  const dotContainerWidth =
    (dotSize + dotMargin * 2) * Math.min(carouselItems.length, visibleDots);

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
        setError("Failed to load data. Please try again later.");
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

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setFeaturedProducts(data);
    } catch (error) {
      throw error;
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
    return <LoadingSpinner text="Loading home content..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            setError(null);
            fetchData();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <SearchBar />
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
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push("/categories")}>
              <Text style={styles.seeAllText}>SEE ALL</Text>
            </TouchableOpacity>
          </View>
          <CategoryCircles categories={categories.slice(0, 5)} />

          <Text style={styles.sectionTitle}>Featured Products</Text>
          {featuredProducts.length > 0 ? (
            <FlatList
              data={featuredProducts}
              numColumns={2}
              columnWrapperStyle={styles.spaceBetween}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <ProductCard
                  title={item.title}
                  price={item.price}
                  discount={item.discount}
                  rating={item.rating}
                  image={item.image}
                  onPress={() => router.push(`/product/${item.id}`)}
                  onPressHeart={() => {}}
                  onAddToCart={() => {}}
                />
              )}
            />
          ) : (
            <Text style={styles.noProductsText}>
              No featured products available
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
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
    color: COLORS.primary,
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
