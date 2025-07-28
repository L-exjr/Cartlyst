import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../../../utils/config';
import { useAuthStore } from '../../../../utils/authStore';

export default function OrdersModal() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchOrders();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#d4af37" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderText}>Order #{item.id}</Text>
              <Text style={styles.orderText}>Date: {item.date}</Text>
              <Text style={styles.orderText}>Total: ${item.total?.toFixed(2)}</Text>
              <Text style={styles.orderText}>Status: {item.status}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.orderText}>No orders found.</Text>}
        />
      )}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  orderItem: { marginBottom: 16, padding: 12, borderRadius: 8, backgroundColor: '#f1f1f1', width: 300 },
  orderText: { fontSize: 16 },
  error: { color: 'red', marginBottom: 16 },
  closeButton: { marginTop: 24, padding: 12, backgroundColor: '#d4af37', borderRadius: 8 },
  closeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
 
 