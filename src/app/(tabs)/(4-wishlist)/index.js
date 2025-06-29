import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useWishlistStore } from "../../../utils/wishlistStore";
import { useCartStore } from "../../../utils/cartStore";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

export default function WishlistScreen() {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  if (wishlist.length === 0) {
    // Empty wishlist UI
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome6 name="heart" size={64} color="#bfa100" style={styles.icon} />
        <Text style={styles.emptyText}>
          Your Wishlist is empty! Tap the heart-shaped icon on an item to add it to your wishlist. All your saved items will be displayed here.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)/(1-home)")}
        >
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Wishlist with items UI
  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.wishlistItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  wishlistItem: { flexDirection: "row", marginBottom: 16, backgroundColor: "#f9f9f9", borderRadius: 8, padding: 8 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 16 },
  price: { color: "#bfa100", marginVertical: 4 },
  actions: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  addToCartButton: { backgroundColor: "#bfa100", padding: 8, borderRadius: 6, marginRight: 12 },
  addToCartText: { color: "#fff", fontWeight: "bold" },
  remove: { color: "red", marginLeft: 8 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  icon: { marginBottom: 16 },
  emptyText: { fontSize: 16, color: "#888", textAlign: "center", marginBottom: 24 },
  button: { backgroundColor: "#bfa100", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});