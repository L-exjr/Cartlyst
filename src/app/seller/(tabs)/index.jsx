// app/(tabs)/index.jsx
import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../components/CustomHeader";

const mockProducts = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  title: `Product ${i + 1}`,
}));

const SellerHomeScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader />
      <View style={styles.container}>
        <FlatList
          data={mockProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: `./product/${item.id}` })}
              style={styles.card}
            >
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Floating Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("./addProduct")}
          accessibilityLabel="Add Product"
          accessibilityRole="button"
          accessibilityHint="Navigates to the add product screen"
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SellerHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  grid: {
    padding: 12,
  },
  card: {
    flex: 1,
    height: 200,
    backgroundColor: "#ddd",
    borderRadius: 8,
    margin: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#f4c430",
    borderRadius: 30,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
