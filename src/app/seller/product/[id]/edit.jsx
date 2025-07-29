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
import { useProductStore } from "../../../../sellerStore/productStore";
import CustomHeader from "../../../../components/CustomHeader";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const products = useProductStore((state) => state.products);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const product = products?.find((p) => p.id === parseInt(id));

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");

  if (!product) {
    return (
      <View style={styles.container}>
        <CustomHeader showBack />
        <Text style={styles.error}>Product not found.</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!name || !price) {
      return Alert.alert("Fill in all fields");
    }
    updateProduct(product.id, { name, price: parseFloat(price) });
    Alert.alert("Success", "Product updated!", [
      {
        text: "OK",
        onPress: () => router.replace({ pathname: `/product/${product.id}` }),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomHeader showBack />
      <Text style={styles.heading}>Edit Product</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Price (GHS)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
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
