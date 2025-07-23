import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import SimpleHeader from './components/SimpleHeader';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import { useProductStore } from '../store/productStore';

const AddProductScreen = () => {
  const router = useRouter();
  const addProduct = useProductStore((state) => state.addProduct);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([
    { label: 'Bread', value: 'Bread' },
    { label: 'Pastry', value: 'Pastry' },
    { label: 'Drink', value: 'Drink' },
    { label: 'Other', value: 'Other' },
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

  const handleSubmit = () => {
    if (!name || !price || !quantity || !category) {
      return Alert.alert('Fill in all fields');
    }
    addProduct({ name, description, price: parseFloat(price), quantity: parseInt(quantity), image, category });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SimpleHeader title="Add Product" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} accessibilityLabel="Select product image" accessibilityRole="button">
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={48} color="#444" />
              <Text style={styles.imageText}>Select product image</Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#888"
          multiline
          placeholderStyle={{ fontWeight: '700' }}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          placeholderTextColor="#888"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          placeholderTextColor="#888"
          keyboardType="numeric"
        />
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
          placeholderStyle={{ color: '#888' }}
          listItemLabelStyle={{ color: '#222' }}
          zIndex={1000}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bbb',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    marginVertical: 8,
    marginBottom: 18,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: 110,
    height: 110,
    borderRadius: 16,
    marginBottom: 6,
  },
  imageText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#f4c430',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 18,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  dropdownContainer: {
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 18,
  },
});

export default AddProductScreen;
