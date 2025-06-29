import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useCartStore } from "../../../utils/cartStore";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons"

export default function CartScreen() {
  const router = useRouter()
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    // Empty cart UI
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome6 name="cart-shopping" size={64} color="#bfa100" style={styles.icon} />
        <Text style={styles.emptyText}>
          Explore our categories to find the best deals we have to offer.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace("/(tabs)/(1-home)")}>
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
        {/* Add recommended/Recently Viewed sections here if you want */}
      </View>
    );
  }

  // Cart with items UI
  return (
    <View style={styles.container}>
      <Text style={styles.header}>CART SUMMARY</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                  <Text style={styles.qtyButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Text style={styles.qtyButton}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.summary}>
        <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout (${subtotal.toFixed(2)})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Add your own styles or copy from your Figma design
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
  cartItem: { flexDirection: "row", marginBottom: 16, backgroundColor: "#f9f9f9", borderRadius: 8, padding: 8 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 16 },
  price: { color: "#bfa100", marginVertical: 4 },
  quantityRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  qtyButton: { fontSize: 20, paddingHorizontal: 8 },
  quantity: { marginHorizontal: 8, fontSize: 16 },
  remove: { color: "red", marginTop: 4 },
  summary: { borderTopWidth: 1, borderColor: "#eee", paddingTop: 12, alignItems: "center" },
  subtotal: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  checkoutButton: { backgroundColor: "#bfa100", padding: 12, borderRadius: 8, width: "100%", alignItems: "center" },
  checkoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  icon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: "#888", textAlign: "center", marginBottom: 24 },
  button: { backgroundColor: "#bfa100", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});