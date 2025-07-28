import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOfferStore } from "../../../../sellerStore/offerStore";
import CustomHeader from "../../components/CustomHeader";

export default function EditOfferScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const offers = useOfferStore((state) => state.offers);
  const updateOffer = useOfferStore((state) => state.updateOffer);
  const offer = offers?.find((o) => o.id === parseInt(id));

  const [title, setTitle] = useState(offer?.title || "");
  const [description, setDescription] = useState(offer?.description || "");

  if (!offer) {
    return (
      <View style={styles.container}>
        <CustomHeader showBack />
        <Text style={styles.error}>Offer not found.</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!title) {
      return Alert.alert("Title is required");
    }
    updateOffer(offer.id, { title, description });
    Alert.alert("Success", "Offer updated!", [
      {
        text: "OK",
        onPress: () => router.replace({ pathname: `/offer/${offer.id}` }),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomHeader showBack />
      <Text style={styles.heading}>Edit Offer</Text>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
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
  label: {
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#f4c430",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
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
});
