// AddressBook.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../../../utils/config";
import { useAuthStore } from "../../../../utils/authStore";
import { COLORS } from "../../../../utils/theme";

export default function AddressBook() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/addresses?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch addresses");
        const data = await res.json();
        setAddresses(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAddresses();
  }, [userId]);

  const handleDelete = async (id) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${API_BASE_URL}/addresses/${id}`, { method: "DELETE" });
            setAddresses((prev) => prev.filter((addr) => addr.id !== id));
          } catch {
            Alert.alert("Error", "Failed to delete address");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Address Book</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(5-account)/modalContent/AddAddress",
                  params: { mode: "edit", addressId: item.id },
                })
              }
              onLongPress={() => handleDelete(item.id)}
            >
              <Text style={styles.cardText}>{item.name}</Text>
              <Text style={styles.cardText}>{item.street}</Text>
              <Text style={styles.cardText}>{item.city}</Text>
              <Text style={styles.cardText}>{item.phone}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No addresses found.</Text>}
        />
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/(5-account)/modalContent/AddAddress",
            params: { mode: "add" },
          })
        }
      >
        <Text style={styles.addText}>+ Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 24,
    padding: 12,
  },
  addText: { color: COLORS.surface, fontSize: 16, fontWeight: "bold" },
  card: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  cardText: { fontSize: 16 },
  container: { backgroundColor: COLORS.surface, flex: 1, padding: 24 },
  error: { color: COLORS.error, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
