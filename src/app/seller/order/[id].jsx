import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrderStore } from "../../../sellerStore/orderStore";
import SimpleHeader from "../../../components/SimpleHeader";
import { Ionicons } from "@expo/vector-icons";

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const order = useOrderStore((state) =>
    state.orders.find((o) => o.id === parseInt(id)),
  );

  if (!order) {
    return (
      <View style={styles.container}>
        <SimpleHeader title="Order Details" />
        <Text style={styles.error}>Order not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SimpleHeader title="Order Details" />
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>View order details</Text>
          <View style={styles.card}>
            <Text style={styles.detailText}>Order date: {order.date}</Text>
            <Text style={styles.detailText}>Order number: {order.id}</Text>
            <Text style={styles.detailText}>
              Order total: <Text style={styles.boldValue}>₵{order.total}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipment details</Text>
          <View style={styles.card}>
            <Text style={styles.detailText}>Standard Delivery</Text>
            <Text style={styles.statusText}>In Process</Text>
          </View>
          <TouchableOpacity
            style={styles.updateRow}
            onPress={() =>
              router.push({ pathname: `/order/${order.id}/status` })
            }
          >
            <Text style={styles.updateLink}>Update shipment</Text>
            <Ionicons name="chevron-forward" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipment details</Text>
          <View style={styles.card}>
            <Text style={styles.detailText}>Payment method: Card</Text>
            <Text style={styles.detailText}>Billing Address: 123 Main St</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipment address</Text>
          <View style={styles.card}>
            <Text style={styles.detailText}>123 Main St, Accra</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: "#555",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#f4c430",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  detailText: {
    fontSize: 14,
    color: "#222",
    marginBottom: 2,
  },
  statusText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#222",
    marginTop: 6,
  },
  updateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  updateLink: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 15,
    marginRight: 4,
  },
  boldValue: {
    fontWeight: "700",
    color: "#222",
  },
});
