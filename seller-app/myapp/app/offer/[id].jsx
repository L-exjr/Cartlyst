import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useOfferStore } from "../../store/offerStore";
import { useRouter } from "expo-router";
import CustomHeader from "../components/CustomHeader";

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams();
  const offer = useOfferStore((state) =>
    state.offers?.find((o) => o.id === parseInt(id)),
  );
  const router = useRouter();
  const deleteOffer = useOfferStore((state) => state.deleteOffer);

  if (!offer) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <CustomHeader showBack />
        <View style={styles.container}>
          <Text style={styles.error}>Offer not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader showBack />
      <View style={styles.container}>
        <Text style={styles.heading}>Offer Details</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{offer.title}</Text>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{offer.description}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push({ pathname: `/offer/${offer.id}/edit` })}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                "Delete Offer",
                "Are you sure you want to delete this offer?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      deleteOffer(offer.id);
                      Alert.alert("Deleted", "Offer deleted!", [
                        {
                          text: "OK",
                          onPress: () => router.replace("/offers"),
                        },
                      ]);
                    },
                  },
                ],
              );
            }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
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
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  editButton: {
    backgroundColor: "#f4c430",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#ff4d4f",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 8,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});
