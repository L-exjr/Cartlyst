import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../../../utils/config';
import { useAuthStore } from '../../../../utils/authStore';

export default function InterestsModal() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/interests/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch interests');
        const data = await res.json();
        setInterests(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchInterests();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#d4af37" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={interests}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.interestItem}>
              <Text style={styles.interestText}>{item.interest}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.interestText}>No interests found.</Text>}
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
  interestItem: { marginBottom: 16, padding: 12, borderRadius: 8, backgroundColor: '#f1f1f1', width: 300 },
  interestText: { fontSize: 16 },
  error: { color: 'red', marginBottom: 16 },
  closeButton: { marginTop: 24, padding: 12, backgroundColor: '#d4af37', borderRadius: 8 },
  closeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 
 
 