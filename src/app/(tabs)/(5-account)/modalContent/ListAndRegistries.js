import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../../../utils/theme";
import { API_BASE_URL } from "../../../../utils/config";
import { useAuthStore } from "../../../../utils/authStore";
import { FlashList } from "@shopify/flash-list";

export default function ListsModal() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/lists/${userId}`);
      const data = await res.json();
      setLists(data);
    } catch (err) {
      console.error("Fetch lists error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    if (!newListName.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/lists/${userId}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName }),
      });
      const newList = await res.json();
      setLists((prev) => [...prev, newList]);
      setNewListName("");
    } catch (err) {
      Alert.alert("Error", "Failed to create list.");
    }
  };

  const editListName = async (id, newName) => {
    try {
      await fetch(`${API_BASE_URL}/lists/${userId}/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      setLists((prev) =>
        prev.map((list) =>
          list.id === id ? { ...list, name: newName } : list,
        ),
      );
      setEditingId(null);
    } catch {
      Alert.alert("Error", "Failed to update list name.");
    }
  };

  const deleteList = async (id) => {
    Alert.alert("Confirm", "Delete this list?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${API_BASE_URL}/lists/${userId}/${id}`, {
              method: "DELETE",
            });
            setLists((prev) => prev.filter((list) => list.id !== id));
          } catch {
            Alert.alert("Error", "Failed to delete list.");
          }
        },
      },
    ]);
  };

  const handleListPress = (id) => {
    router.push(`/lists/${id}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => handleListPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageRow}>
        {item.products?.slice(0, 3).map((product) => (
          <Image
            key={product.id}
            source={{ uri: product.imageUrl }}
            style={styles.thumbnail}
          />
        ))}
      </View>

      {editingId === item.id ? (
        <TextInput
          value={item.name}
          onChangeText={(text) =>
            setLists((prev) =>
              prev.map((l) => (l.id === item.id ? { ...l, name: text } : l)),
            )
          }
          onSubmitEditing={() => editListName(item.id, item.name)}
          style={styles.input}
        />
      ) : (
        <Text style={styles.listName}>{item.name}</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setEditingId(item.id)}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteList(item.id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lists and Registries</Text>

      <TextInput
        style={styles.input}
        value={newListName}
        onChangeText={setNewListName}
        placeholder="New list name"
        onSubmitEditing={createList}
      />

      <TouchableOpacity style={styles.createButton} onPress={createList}>
        <Text style={styles.createText}>Create New List</Text>
      </TouchableOpacity>

      {/* Fix for FlashList sizing */}
      <View style={{ flex: 1, width: "100%" }}>
        <FlashList
          data={lists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          estimatedItemSize={120}
          contentContainerStyle={{ paddingVertical: 16 }}
          ListEmptyComponent={
            !loading && <Text style={styles.emptyText}>No lists found.</Text>
          }
        />
      </View>

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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 20,
    padding: 12,
  },
  closeText: { color: COLORS.surface, fontSize: 16, fontWeight: "bold" },
  container: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    flex: 1,
    padding: 24,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createText: { color: COLORS.surface, fontSize: 16, fontWeight: "bold" },
  delete: { color: COLORS.warning, fontWeight: "600" },
  edit: { color: COLORS.info, fontWeight: "600" },
  emptyText: {
    color: COLORS.gray[500],
    fontSize: 16,
    marginTop: 32,
    textAlign: "center",
  },
  imageRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  input: {
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    width: "100%",
  },
  listCard: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    width: "100%",
  },
  listName: { fontSize: 18, fontWeight: "600", marginTop: 8 },
  thumbnail: {
    backgroundColor: COLORS.gray[300],
    borderRadius: 4,
    height: 40,
    width: 40,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
});
