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
import { API_BASE_URL } from "../../../../utils/config";
import { useAuthStore } from "../../../../utils/authStore";
import { COLORS } from "../../../../utils/theme";

export default function RecentlyViewedModal() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentlyViewed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/recently-viewed/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch recently viewed items");
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchRecentlyViewed();
  }, [userId]);

  const handleClearAll = async () => {
    Alert.alert(
      "Clear All",
      "Are you sure you want to clear recently viewed items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(
                `${API_BASE_URL}/recently-viewed/${userId}`,
                {
                  method: "DELETE",
                },
              );
              if (!res.ok) throw new Error();
              setItems([]);
              Alert.alert("Success", "Recently viewed items cleared.");
            } catch {
              Alert.alert("Error", "Failed to clear items.");
            }
          },
        },
      ],
    );
  };

  const handleItemPress = (itemId) => {
    router.push(`/product/${itemId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Viewed</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemCard}
                onPress={() => handleItemPress(item.id)}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                  <Text style={styles.itemDate}>Viewed: {item.viewedAt}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No recently viewed items.</Text>}
          />

          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear Recently Viewed</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  clearBtn: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    marginTop: 16,
    padding: 12,
  },
  clearText: { color: COLORS.surface, fontSize: 16, fontWeight: "bold" },
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
    justifyContent: "center",
    padding: 24,
  },
  error: { color: COLORS.warning, marginBottom: 16 },
  image: {
    backgroundColor: COLORS.gray[200],
    height: 100,
    width: 100,
  },
  itemCard: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    flexDirection: "row",
    marginBottom: 16,
    overflow: "hidden",
    width: 320,
  },
  itemDate: { color: COLORS.gray[600], fontSize: 12, marginTop: 2 },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 14, marginTop: 4 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
