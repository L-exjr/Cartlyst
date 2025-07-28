import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../../../utils/config";
import { useAuthStore } from "../../../../utils/authStore";
import { COLORS } from "../../../../utils/theme";

export default function VouchersModal() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/vouchers/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch vouchers");
        const data = await res.json();
        setVouchers(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchVouchers();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vouchers</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#d4af37" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={vouchers}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.voucherItem}>
              <Text style={styles.voucherText}>Code: {item.code}</Text>
              <Text style={styles.voucherText}>Discount: {item.discount}</Text>
              <Text style={styles.voucherText}>Expiry: {item.expiry}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.voucherText}>No vouchers found.</Text>
          }
        />
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  voucherItem: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    width: 300,
  },
  voucherText: { fontSize: 16 },
});
