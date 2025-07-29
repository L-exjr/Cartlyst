import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../../utils/authStore";
import { API_BASE_URL } from "../../../../utils/config";
import { COLORS } from "../../../../utils/theme";

export default function RecentlySearchedModal() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/recently-searched/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch recently searched terms.");
      const data = await res.json();
      setTerms(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchTerms();
  }, [userId]);

  const handleClear = async () => {
    Alert.alert("Clear Search History", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `${API_BASE_URL}/recently-searched/${userId}`,
              {
                method: "DELETE",
              },
            );
            if (!res.ok) throw new Error();
            setTerms([]);
            Alert.alert("Success", "Search history cleared.");
          } catch {
            Alert.alert("Error", "Could not clear history.");
          }
        },
      },
    ]);
  };

  const handleTermPress = (term) => {
    router.push({ pathname: "/search", params: { query: term } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Searched</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={terms}
            keyExtractor={(item, index) => `${item.term}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.termCard}
                onPress={() => handleTermPress(item.term)}
              >
                <Text style={styles.termText}>{item.term}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No recent searches.</Text>}
          />

          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearText}>Clear Search History</Text>
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
    padding: 24,
  },
  error: { color: COLORS.warning, marginBottom: 16 },
  termCard: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    width: 300,
  },
  termText: { fontSize: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
