import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Modal, Pressable, Keyboard, ScrollView, TextInput } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, SPACING, BORDER_RADIUS } from "../../utils/theme";
import { API_BASE_URL } from "../../utils/config";
import ProductCard from "../../components/ProductCard";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBarWithHistory from "../../components/SearchBarWithHistory";
import { useWishlistStore } from "../../utils/wishlistStore";
import { useCartStore } from "../../utils/cartStore";
import { useAuthStore } from "../../utils/authStore";

console.log("ProductsScreen.js loaded");

const NUM_COLUMNS = 2;
const SEARCH_HISTORY_KEY = 'product_search_history';
const MAX_HISTORY = 8;

export default function ProductsScreen() {
  const { categoryId, categoryName, search } = useLocalSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("none");
  const [modalVisible, setModalVisible] = useState(false);

  // Filter states
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minDiscount, setMinDiscount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [sort, setSort] = useState("");

  // For slider dynamic bounds
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 1000 });

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const userId = useAuthStore((state) => state.userId);

  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);

  const handlePressHeart = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(userId, product.id);
    } else {
      addToWishlist(userId, product);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(userId, product);
  };

  // Fetch products with filters
  const fetchProducts = async (params = {}) => {
    setLoading(true);
    let query = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    let url = `${API_BASE_URL}/products/by-category/${categoryId}`;
    if (query) url += `?${query}`;
    console.log("[ProductsScreen] Fetching products from:", url, "with params:", params);
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("[ProductsScreen] Fetched products count:", Array.isArray(data) ? data.length : data);
      setProducts(data);
    } catch (e) {
      console.log("[ProductsScreen] Fetch error:", e);
      setProducts([]);
    } finally {
      setLoading(false);
      console.log("[ProductsScreen] Loading finished");
    }
  };

  useEffect(() => {
    console.log("[ProductsScreen] useEffect triggered", { categoryId, categoryName, search });
    if (!categoryId) {
      console.log("[ProductsScreen] No categoryId, skipping fetchProducts");
      return;
    }
    // If search param is present, use it
    fetchProducts({ search, categoryName });
  }, [categoryId, search, categoryName]);

  // Update price bounds when products change
  useEffect(() => {
    if (!products.length) {
      setPriceBounds({ min: 0, max: 1000 });
      setMinPrice(0);
      setMaxPrice(1000);
      return;
    }
    const prices = products.map((p) => Number(p.price) || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceBounds({ min, max });
    setMinPrice(min);
    setMaxPrice(max);
  }, [products]);

  // Modal apply handler
  const handleApplyFilters = () => {
    fetchProducts({
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      minRating,
      maxRating,
      search: search,
      sort,
    });
    setModalVisible(false);
  };

  // Search submit handler for SearchBarWithHistory
  const handleSearch = (term, cat) => {
    fetchProducts({
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      minRating,
      maxRating,
      search: term,
      sort,
    });
  };

  // Modal reset handler
  const handleResetFilters = () => {
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
    setMinDiscount("");
    setMaxDiscount("");
    setMinRating("");
    setMaxRating("");
    setSort("");
    setFilter("none");
    fetchProducts();
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome6 name="arrow-left" size={20} color={COLORS.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <SearchBarWithHistory
            onSearch={handleSearch}
            suggestionsSource={products.map(p => ({ title: p.title, category: categoryName }))}
            categoryName={categoryName}
            placeholder="Search products..."
          />
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <FontAwesome6 name="filter" size={20} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Title */}
      <View style={styles.categoryRow}>
        <Text style={styles.categoryTitle}>{categoryName || "Products"}</Text>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <TouchableOpacity onPress={() => { setSort(""); setFilter("none"); handleApplyFilters(); }} style={[styles.filterBtn, (filter === "none" || !sort) && styles.filterBtnActive]}>
          <Text style={(filter === "none" || !sort) ? styles.filterBtnActiveText : null}>Default</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSort("priceAsc"); setFilter("priceLowHigh"); handleApplyFilters(); }} style={[styles.filterBtn, filter === "priceLowHigh" && styles.filterBtnActive]}>
          <Text style={filter === "priceLowHigh" ? styles.filterBtnActiveText : null}>Price ↑</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSort("priceDesc"); setFilter("priceHighLow"); handleApplyFilters(); }} style={[styles.filterBtn, filter === "priceHighLow" && styles.filterBtnActive]}>
          <Text style={filter === "priceHighLow" ? styles.filterBtnActiveText : null}>Price ↓</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSort("discountDesc"); setFilter("discount"); handleApplyFilters(); }} style={[styles.filterBtn, filter === "discount" && styles.filterBtnActive]}>
          <Text style={filter === "discount" ? styles.filterBtnActiveText : null}>Discount</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Products</Text>
            <Text style={styles.modalLabel}>Price Range</Text>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <MultiSlider
                values={[minPrice, maxPrice]}
                min={priceBounds.min}
                max={priceBounds.max}
                step={1}
                onValuesChange={([min, max]) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
                selectedStyle={{ backgroundColor: COLORS.primary }}
                markerStyle={{ backgroundColor: COLORS.primary }}
                containerStyle={{ width: "90%" }}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%" }}>
                <Text>{minPrice}</Text>
                <Text>{maxPrice}</Text>
              </View>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Min Discount (%)"
              keyboardType="numeric"
              value={minDiscount}
              onChangeText={setMinDiscount}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Max Discount (%)"
              keyboardType="numeric"
              value={maxDiscount}
              onChangeText={setMaxDiscount}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Min Rating"
              keyboardType="numeric"
              value={minRating}
              onChangeText={setMinRating}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Max Rating"
              keyboardType="numeric"
              value={maxRating}
              onChangeText={setMaxRating}
            />
            <View style={styles.modalButtonRow}>
              <Pressable style={styles.modalButton} onPress={handleApplyFilters}>
                <Text style={styles.modalButtonText}>Apply</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.modalButtonReset]} onPress={handleResetFilters}>
                <Text style={styles.modalButtonText}>Reset</Text>
              </Pressable>
            </View>
            <Pressable style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Product Grid */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price}
              discount={item.discount}
              rating={item.rating}
              image={item.image}
              onPress={() => router.push('/(tabs)/(1-home)/product/' + item.id)}
              onPressHeart={() => handlePressHeart(item)}
              onAddToCart={() => handleAddToCart(item)}
              isFavorite={isInWishlist(item.id)}
              userId={userId}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 32 }}>No products found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 36,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  suggestionDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    zIndex: 10,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    elevation: 4,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  filterLabel: {
    marginRight: 8,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
    marginHorizontal: 2,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterBtnActiveText: {
    color: COLORS.text.inverse,
    fontWeight: "bold",
  },
  grid: {
    paddingHorizontal: SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: 24,
    width: '85%',
    alignItems: 'stretch',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: 10,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButtonReset: {
    backgroundColor: COLORS.gray[200],
  },
  modalButtonText: {
    color: COLORS.text.inverse,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalClose: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    color: COLORS.text.primary,
    fontSize: 16,
  },
}); 