import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Search, ChevronRight, Sparkles, TrendingUp } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SearchBar from '../../src/components/SearchBar';
import ProductCard from '../../src/components/ProductCard';
import CarouselCard from '../../src/components/CarouselCard';
import CategoryCircles from '../../src/components/CategoryCircles';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import { API_BASE_URL } from '../../src/utils/config';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../src/utils/theme';
import { commonStyles } from '../../src/utils/styles';
import { useWishlistStore } from '../../src/utils/wishlistStore';
import { useCartStore } from '../../src/utils/cartStore';

const { width } = Dimensions.get('window');

// Mock data for development
const mockCarouselItems = [
  {
    id: 1,
    source: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    type: 'Sale',
    title: 'Summer Collection 2024',
  },
  {
    id: 2,
    source: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800',
    type: 'New',
    title: 'Premium Electronics',
  },
  {
    id: 3,
    source: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
    type: 'Featured',
    title: 'Home & Garden',
  },
];

const mockCategories = [
  { id: 1, name: 'Electronics', icon: 'smartphone', iconFamily: 'MaterialIcons' },
  { id: 2, name: 'Fashion', icon: 'tshirt-crew', iconFamily: 'MaterialCommunityIcons' },
  { id: 3, name: 'Home', icon: 'home', iconFamily: 'MaterialIcons' },
  { id: 4, name: 'Sports', icon: 'football', iconFamily: 'FontAwesome5' },
  { id: 5, name: 'Books', icon: 'book', iconFamily: 'MaterialIcons' },
];

const mockProducts = [
  {
    id: 1,
    title: 'Wireless Bluetooth Headphones',
    price: 89.99,
    discount: 15,
    rating: 4,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    title: 'Smart Fitness Watch',
    price: 199.99,
    discount: 20,
    rating: 5,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    title: 'Premium Coffee Maker',
    price: 149.99,
    discount: 0,
    rating: 4,
    image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 4,
    title: 'Organic Cotton T-Shirt',
    price: 29.99,
    discount: 10,
    rating: 4,
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollX = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  const [featuredProducts, setFeaturedProducts] = useState(mockProducts);
  const [categories, setCategories] = useState(mockCategories);
  const [carouselItems, setCarouselItems] = useState(mockCarouselItems);

  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);

  const isInWishlist = (productId: number) =>
    wishlist.some((item) => item.id === productId);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % carouselItems.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, carouselItems.length]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    if (index !== activeIndex && index >= 0 && index < carouselItems.length) {
      setActiveIndex(index);
    }
    scrollX.value = contentOffset;
  };

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(activeIndex * 20),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(headerOpacity.value, { duration: 300 }),
      transform: [
        {
          translateY: withTiming(headerOpacity.value === 1 ? 0 : -20, { duration: 300 }),
        },
      ],
    };
  });

  const renderCarouselItem = ({ item }: { item: any }) => (
    <View style={{ width }}>
      <CarouselCard
        source={item.source}
        type={item.type}
        title={item.title}
      />
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading amazing deals..." />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          headerOpacity.value = offsetY > 50 ? 0.8 : 1;
        }}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerAnimatedStyle]} entering={FadeInDown.delay(100)}>
          <View>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.subtitle}>Find your perfect products</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationDot} />
            <Sparkles color={COLORS.primary} size={24} strokeWidth={2} />
          </TouchableOpacity>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <SearchBar />
        </Animated.View>

        {/* Carousel */}
        <Animated.View style={styles.carouselContainer} entering={FadeInUp.delay(300)}>
          <FlatList
            ref={flatListRef}
            data={carouselItems}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCarouselItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
          
          {/* Carousel Indicators */}
          <View style={styles.indicatorContainer}>
            <View style={styles.indicatorTrack}>
              <Animated.View style={[styles.activeIndicator, animatedDotStyle]} />
            </View>
            {carouselItems.map((_, index) => (
              <View key={index} style={styles.indicator} />
            ))}
          </View>
        </Animated.View>

        <View style={styles.content}>
          {/* Categories Section */}
          <Animated.View entering={SlideInRight.delay(400)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.trendingBadge}>
                  <TrendingUp color={COLORS.primary} size={16} strokeWidth={2} />
                  <Text style={styles.trendingText}>Trending</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/categories')}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight color={COLORS.primary} size={16} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <CategoryCircles categories={categories.slice(0, 5)} />
          </Animated.View>

          {/* Featured Products Section */}
          <Animated.View entering={SlideInRight.delay(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight color={COLORS.primary} size={16} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            {featuredProducts.length > 0 ? (
              <View style={styles.productsGrid}>
                {featuredProducts.map((item, index) => (
                  <Animated.View 
                    key={item.id} 
                    entering={FadeInUp.delay(600 + index * 100)}
                    style={styles.productCardContainer}
                  >
                    <ProductCard
                      title={item.title}
                      price={item.price}
                      discount={item.discount}
                      rating={item.rating}
                      image={item.image}
                      onPress={() => router.push(`/product/${item.id}`)}
                      onPressHeart={() =>
                        isInWishlist(item.id)
                          ? removeFromWishlist(item.id)
                          : addToWishlist(item)
                      }
                      onAddToCart={() => addToCart(item)}
                      isFavorite={isInWishlist(item.id)}
                    />
                  </Animated.View>
                ))}
              </View>
            ) : (
              <Text style={styles.noProductsText}>
                No featured products available
              </Text>
            )}
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    shadowColor: COLORS.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  notificationButton: {
    position: 'relative',
    padding: SPACING.sm,
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.lg,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: COLORS.error,
    borderRadius: 4,
    zIndex: 1,
  },
  carouselContainer: {
    marginVertical: SPACING.md,
    position: 'relative',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  indicatorTrack: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.overlayLight,
    marginHorizontal: 6,
  },
  activeIndicator: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    position: 'absolute',
  },
  content: {
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.text.primary,
    marginRight: SPACING.sm,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  trendingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 4,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  seeAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 4,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardContainer: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  noProductsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});