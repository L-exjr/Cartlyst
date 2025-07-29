import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../../utils/authStore";
import { API_BASE_URL } from "../../../../utils/config";
import { COLORS } from "../../../../utils/theme";

export default function BuyAgainModal() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuyAgain = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/buy-again/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch Buy Again items");
      const data = await res.json();
      setItems(data);

      // Initialize quantities
      const initialQuantities = {};
      data.forEach((item) => {
        initialQuantities[item.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchBuyAgain();
  }, [userId]);

  const handleQuantityChange = (itemId, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[itemId] || 1) + delta);
      return { ...prev, [itemId]: newQty };
    });
  };

  const handleBuyAgain = async (itemId) => {
    try {
      await fetch(`${API_BASE_URL}/cart/${userId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: itemId,
          quantity: quantities[itemId] || 1,
        }),
      });
      Alert.alert("Success", "Item added to cart.");
    } catch {
      Alert.alert("Error", "Could not add to cart.");
    }
  };

  const handleViewProduct = (itemId) => {
    router.push(`/product/${itemId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Again</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <TouchableOpacity onPress={() => handleViewProduct(item.id)}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price}</Text>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => handleQuantityChange(item.id, -1)}
                  >
                    <Text style={styles.qtyText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNumber}>{quantities[item.id] || 1}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => handleQuantityChange(item.id, 1)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleBuyAgain(item.id)}
                >
                  <Text style={styles.buyText}>Buy Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>No past purchases yet.</Text>}
        />
      )}

      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buyButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buyText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 24,
    padding: 12,
  },
  closeText: { color: COLORS.surface, fontSize: 16, fontWeight: "bold" },
  container: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    flex: 1,
    padding: 24,
  },
  error: { color: COLORS.warning, marginBottom: 16 },
  image: {
    backgroundColor: COLORS.gray[300],
    height: 100,
    width: 100,
  },
  info: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  itemCard: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    flexDirection: "row",
    marginBottom: 16,
    overflow: "hidden",
    width: 320,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, marginTop: 4 },
  qtyButton: {
    backgroundColor: COLORS.gray[300],
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 12,
  },
  qtyRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
  },
  qtyText: { fontSize: 18, fontWeight: "bold" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
