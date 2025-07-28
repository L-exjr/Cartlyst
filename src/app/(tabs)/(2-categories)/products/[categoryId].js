import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  Keyboard,
  ScrollView,
  TextInput,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../utils/theme";
import { API_BASE_URL } from "../../../../utils/config";
import ProductCard from "../../../../components/ProductCard";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBarWithHistory from "../../../../components/SearchBarWithHistory";
import { useWishlistStore } from "../../../../utils/wishlistStore";
import { useCartStore } from "../../../../utils/cartStore";
import { useAuthStore } from "../../../../utils/authStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Price from "../../../../components/Price";

console.log("ProductsScreen.js loaded");

const NUM_COLUMNS = 2;
const SEARCH_HISTORY_KEY = "product_search_history";
const MAX_HISTORY = 8;

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

export default function CategoryProductsScreen() {
  let { categoryId, categoryName, search, productId } = useLocalSearchParams();
  const router = useRouter();
  // Defensive: ensure categoryId is a number if possible
  if (
    categoryId &&
    typeof categoryId === "string" &&
    !isNaN(Number(categoryId))
  ) {
    categoryId = Number(categoryId);
  }
  // If categoryId is not a number, try to find by name (optional: fetch categories if needed)
  // Add logging
  console.log("ProductsScreen params:", {
    categoryId,
    categoryName,
    search,
    productId,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("none");
  const [modalVisible, setModalVisible] = useState(false);

  // Filter states
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minDiscount, setMinDiscount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [sort, setSort] = useState("");

  // For slider dynamic bounds
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 1000 });
  const [priceInitialized, setPriceInitialized] = useState(false);

  const initializePriceBounds = (products) => {
    if (!products.length) {
      setPriceBounds({ min: 0, max: 1000 });
      setMinPrice(0);
      setMaxPrice(1000);
      setPriceInitialized(true);
      return;
    }
    const prices = products.map((p) => Number(p.price) || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceBounds({ min, max });
    setMinPrice(min);
    setMaxPrice(max);
    setPriceInitialized(true);
  };

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist,
  );
  const wishlist = useWishlistStore((state) => state.wishlist);
  const userId = useAuthStore((state) => state.userId);

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  const handlePressHeart = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(userId, product.id);
    } else {
      addToWishlist(userId, product);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(userId, product, 1);
  };

  // Fetch products with filters
  const fetchProducts = async (params = {}) => {
    setLoading(true);
    let queryParams = { ...params };
    // If productId is present, fetch only that product
    if (queryParams.productId) {
      const url = `${API_BASE_URL}/products/${queryParams.productId}`;
      console.log("[ProductsScreen] Fetching single product from:", url);
      try {
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data ? [data] : []);
        return data ? [data] : [];
      } catch (e) {
        setProducts([]);
        return [];
      } finally {
        setLoading(false);
      }
    }
    // If categoryId is not a number, skip it
    if (!queryParams.categoryId || isNaN(Number(queryParams.categoryId))) {
      delete queryParams.categoryId;
    }
    let query = Object.entries(queryParams)
      .filter(([_, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    let url;
    if (queryParams.categoryId && !isNaN(Number(queryParams.categoryId))) {
      url = `${API_BASE_URL}/products/by-category/${queryParams.categoryId}`;
    } else {
      url = `${API_BASE_URL}/products`;
    }
    if (query) url += `?${query}`;
    console.log(
      "[ProductsScreen] Fetching products from:",
      url,
      "with params:",
      queryParams,
    );
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
        return data;
      } else {
        setProducts([]);
        // Optionally show error: data.error
        return [];
      }
    } catch (e) {
      console.log("[ProductsScreen] Fetch error:", e);
      setProducts([]);
      return [];
    } finally {
      setLoading(false);
      console.log("[ProductsScreen] Loading finished");
    }
  };

  // When category changes, fetch products and initialize price bounds
  useEffect(() => {
    if (!categoryId && !search) {
      return;
    }
    fetchProducts({
      categoryId,
      search,
      categoryName,
      sort,
    }).then((fetchedProducts) => {
      if (!priceInitialized) {
        initializePriceBounds(fetchedProducts || []);
      }
    });
     
  }, [categoryId]);

  // Only apply filters when user clicks Apply
  const handleApplyFilters = () => {
    fetchProducts({
      categoryId,
      search,
      categoryName,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      minRating,
      maxRating,
      sort,
    });
    setModalVisible(false);
  };

  // Search submit handler for SearchBarWithHistory
  const handleSearch = (term, cat) => {
    fetchProducts({
      categoryId, // always include categoryId for category search
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

  // When user clicks Reset
  const handleResetFilters = () => {
    initializePriceBounds(products);
    setMinDiscount("");
    setMaxDiscount("");
    setMinRating("");
    setMaxRating("");
    setSort("");
    setFilter("none");
    setPriceInitialized(false);
    fetchProducts();
    setModalVisible(false);
  };

  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        {/* Remove old back button */}
        <View style={{ flex: 1 }}>
          <SearchBarWithHistory
            onSearch={handleSearch}
            suggestionsSource={products.map((p) => ({
              title: p.title,
              category:
                categoryName ||
                (typeof p.category === "string"
                  ? p.category
                  : p.category?.name || ""),
            }))}
            categoryName={categoryName}
            placeholder={t("searchProductsPlaceholder", "Search products...")}
            showBackButton={true}
            onBack={() => router.back()}
            onAssistantPress={() => router.push("/(tabs)/(1-home)/Cartlyst")}
          />
        </View>
      </View>

      {/* Category Title */}
      <View style={styles.categoryRow}>
        <Text style={styles.categoryTitle}>
          {categoryName || t("products")}
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ marginRight: 16 }}
        >
          <FontAwesome6 name="filter" size={20} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>{t("sortBy")}</Text>
        <TouchableOpacity
          onPress={() => {
            setSort("");
            setFilter("none");
            handleApplyFilters();
          }}
          style={[
            styles.filterBtn,
            (filter === "none" || !sort) && styles.filterBtnActive,
          ]}
        >
          <Text
            style={
              filter === "none" || !sort ? styles.filterBtnActiveText : null
            }
          >
            {t("default")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSort("priceAsc");
            setFilter("priceLowHigh");
            handleApplyFilters();
          }}
          style={[
            styles.filterBtn,
            filter === "priceLowHigh" && styles.filterBtnActive,
          ]}
        >
          <Text
            style={
              filter === "priceLowHigh" ? styles.filterBtnActiveText : null
            }
          >
            {t("priceLowHigh")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSort("priceDesc");
            setFilter("priceHighLow");
            handleApplyFilters();
          }}
          style={[
            styles.filterBtn,
            filter === "priceHighLow" && styles.filterBtnActive,
          ]}
        >
          <Text
            style={
              filter === "priceHighLow" ? styles.filterBtnActiveText : null
            }
          >
            {t("priceHighLow")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSort("discountDesc");
            setFilter("discount");
            handleApplyFilters();
          }}
          style={[
            styles.filterBtn,
            filter === "discount" && styles.filterBtnActive,
          ]}
        >
          <Text
            style={filter === "discount" ? styles.filterBtnActiveText : null}
          >
            {t("discount")}
          </Text>
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
            <Text style={styles.modalTitle}>{t("filterProducts")}</Text>
            <Text style={styles.modalLabel}>{t("priceRange")}</Text>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <MultiSlider
                values={[minPrice, maxPrice]}
                min={priceBounds.min}
                max={priceBounds.max}
                step={1}
                onValuesChange={([min, max]) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                  setPriceInitialized(true);
                }}
                selectedStyle={{ backgroundColor: COLORS.primary }}
                markerStyle={{ backgroundColor: COLORS.primary }}
                containerStyle={{ width: "90%" }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                }}
              >
                <Text>{minPrice}</Text>
                <Text>{maxPrice}</Text>
              </View>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder={t("minDiscount")}
              keyboardType="numeric"
              value={minDiscount}
              onChangeText={setMinDiscount}
            />
            <TextInput
              style={styles.modalInput}
              placeholder={t("maxDiscount")}
              keyboardType="numeric"
              value={maxDiscount}
              onChangeText={setMaxDiscount}
            />
            <TextInput
              style={styles.modalInput}
              placeholder={t("minRating")}
              keyboardType="numeric"
              value={minRating}
              onChangeText={setMinRating}
            />
            <TextInput
              style={styles.modalInput}
              placeholder={t("maxRating")}
              keyboardType="numeric"
              value={maxRating}
              onChangeText={setMaxRating}
            />
            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.modalButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.modalButtonText}>{t("apply")}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonReset]}
                onPress={handleResetFilters}
              >
                <Text style={styles.modalButtonText}>{t("reset")}</Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>{t("close")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Product Grid */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 32 }}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price} // original price from database
              discount={item.discount}
              rating={item.rating}
              image={item.image}
              onPress={() => router.push("/(tabs)/(1-home)/product/" + item.id)}
              onPressHeart={() => handlePressHeart(item)}
              onAddToCart={() => handleAddToCart(item)}
              isFavorite={isInWishlist(item.id)}
              userId={userId}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.paddedHorizontal}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 2,
            marginRight: 2,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 32 }}>
              {t("noProductsFound")}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categoryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  categoryTitle: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  filterBtn: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    marginHorizontal: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterBtnActiveText: {
    color: COLORS.text.inverse,
    fontWeight: "bold",
  },
  filterLabel: {
    color: COLORS.text.primary,
    fontWeight: "bold",
    marginRight: 8,
  },
  filterRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  grid: {
    // no horizontal padding
  },
  header: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    flexDirection: "row",
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.md,
  },
  modalButton: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
  },
  modalButtonReset: {
    backgroundColor: COLORS.gray[200],
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  modalButtonText: {
    color: COLORS.text.inverse,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalClose: {
    alignItems: "center",
    marginTop: 16,
  },
  modalCloseText: {
    color: COLORS.text.primary,
    fontSize: 16,
  },
  modalContent: {
    alignItems: "stretch",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    elevation: 8,
    padding: 24,
    width: "85%",
  },
  modalInput: {
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    color: COLORS.text.primary,
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalLabel: {
    color: COLORS.text.primary,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    flex: 1,
    justifyContent: "center",
  },
  modalTitle: {
    color: COLORS.text.primary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  paddedHorizontal: {
    paddingHorizontal: 12, // or SPACING.sm or SPACING.md as desired
  },
  searchInput: {
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    color: COLORS.text.primary,
    flex: 1,
    fontSize: 16,
    height: 36,
    marginHorizontal: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  suggestionDropdown: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    elevation: 4,
    left: 0,
    maxHeight: 180,
    position: "absolute",
    right: 0,
    top: 40,
    zIndex: 10,
  },
  suggestionItem: {
    borderBottomColor: COLORS.gray[100],
    borderBottomWidth: 1,
    padding: 12,
  },
});
