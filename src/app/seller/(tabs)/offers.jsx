import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOfferStore } from "../../../sellerStore/offerStore";
import CustomHeader from "../../../components/CustomHeader";

const OffersScreen = () => {
  const router = useRouter();
  const { offers } = useOfferStore();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: `/offer/${item.id}` })}
      style={styles.card}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader />
      <View style={styles.container}>
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("../addOffer")}
          accessibilityLabel="Add Offer"
          accessibilityRole="button"
          accessibilityHint="Navigates to the add offer screen"
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OffersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: "#666",
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
