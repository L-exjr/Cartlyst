// AddAddress.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../../../utils/config";
import { useAuthStore } from "../../../../utils/authStore";
import { COLORS } from "../../../../utils/theme";

export default function AddAddress() {
  const router = useRouter();
  const { mode = "add", addressId } = useLocalSearchParams();
  const isEdit = mode === "edit";
  const userId = useAuthStore((state) => state.userId);

  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && addressId) {
      const fetchAddress = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/addresses/${addressId}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          setForm({
            name: data.name,
            street: data.street,
            city: data.city,
            phone: data.phone,
          });
        } catch {
          Alert.alert("Error", "Failed to load address");
          router.back();
        }
      };
      fetchAddress();
    }
  }, [addressId]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.street || !form.city || !form.phone) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${API_BASE_URL}/addresses/${addressId}`
        : `${API_BASE_URL}/addresses`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId }),
      });

      if (!res.ok) throw new Error();
      Alert.alert("Success", isEdit ? "Address updated" : "Address added");
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? "Edit" : "Add"} Address</Text>

      {["name", "street", "city", "phone"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChangeText={(text) => handleChange(field, text)}
        />
      ))}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.surface} />
        ) : (
          <Text style={styles.saveText}>
            {isEdit ? "Update" : "Add"} Address
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cancelBtn: {
    alignItems: "center",
    marginTop: 16,
  },
  cancelText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    backgroundColor: COLORS.surface,
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  input: {
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 16,
    padding: 12,
  },
  saveBtn: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 8,
    padding: 12,
  },
  saveText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});
