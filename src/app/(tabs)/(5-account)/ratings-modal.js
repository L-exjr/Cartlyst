import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../../utils/config';
import { useAuthStore } from '../../../utils/authStore';

export default function RatingsModal() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/ratings/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch ratings');
        const data = await res.json();
        setRatings(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchRatings();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ratings & Reviews</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#d4af37" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={ratings}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.ratingItem}>
              <Text style={styles.ratingText}>Product: {item.product}</Text>
              <Text style={styles.ratingText}>Rating: {item.rating} / 5</Text>
              <Text style={styles.ratingText}>Review: {item.review}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.ratingText}>No ratings found.</Text>}
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
  ratingItem: { marginBottom: 16, padding: 12, borderRadius: 8, backgroundColor: '#f1f1f1', width: 300 },
  ratingText: { fontSize: 16 },
  error: { color: 'red', marginBottom: 16 },
  closeButton: { marginTop: 24, padding: 12, backgroundColor: '#d4af37', borderRadius: 8 },
  closeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
 
 