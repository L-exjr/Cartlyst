import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import SimpleHeader from "./components/SimpleHeader";
import { useRouter } from "expo-router";
import { useOfferStore } from "../store/offerStore";
import DropDownPicker from "react-native-dropdown-picker";

const AddOfferScreen = () => {
  const router = useRouter();
  const addOffer = useOfferStore((state) => state.addOffer);

  const [title, setTitle] = useState("");
  const [labels, setLabels] = useState(["", "", "", "", ""]);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([
    { label: "Discount", value: "Discount" },
    { label: "Combo", value: "Combo" },
    { label: "Freebie", value: "Freebie" },
    { label: "Other", value: "Other" },
  ]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleLabelChange = (text, idx) => {
    const newLabels = [...labels];
    newLabels[idx] = text;
    setLabels(newLabels);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      return Alert.alert("Title is required");
    }
    if (!category) {
      return Alert.alert("Please select a category");
    }
    addOffer({ title, labels, image, category });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SimpleHeader title="Add Offer" />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={pickImage}
          accessibilityLabel="Select offer image"
          accessibilityRole="button"
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color="#444" />
              <Text style={styles.imageText}>Select offer image</Text>
            </View>
          )}
        </TouchableOpacity>
        {labels.map((val, idx) => (
          <TextInput
            key={idx}
            style={styles.input}
            placeholder={`Label ${idx + 1}`}
            value={val}
            onChangeText={(text) => handleLabelChange(text, idx)}
            placeholderTextColor="#888"
          />
        ))}
        <DropDownPicker
          open={open}
          value={category}
          items={items}
          setOpen={setOpen}
          setValue={setCategory}
          setItems={setItems}
          placeholder="Category"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={{ color: "#888" }}
          listItemLabelStyle={{ color: "#222" }}
          zIndex={1000}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Offer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
    marginTop: 24,
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#bbb",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 24,
    marginTop: 8,
    marginBottom: 18,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: "cover",
  },
  imageText: {
    color: "#666",
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 18,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  dropdownContainer: {
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 18,
  },
  button: {
    backgroundColor: "#E2C04B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 18,
    color: "#000",
  },
});

export default AddOfferScreen;
