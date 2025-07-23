import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useProductStore } from '../../../sellerStore/productStore';
import { useRouter } from 'expo-router';
import CustomHeader from '../components/CustomHeader';
import Price from '../../../components/Price';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const product = useProductStore((state) =>
    state.products?.find((p) => p.id === parseInt(id))
  );
  const router = useRouter();
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <CustomHeader showBack />
        <View style={styles.container}>
          <Text style={styles.error}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Helper to get discounted price
  function getDiscountedPrice(product) {
    if (!product) return 0;
    let discount = product.discount || 0;
    let price = product.price || 0;
    if (discount > 0 && discount < 1) {
      return price * (1 - discount);
    } else if (discount >= 1 && discount <= 100) {
      return price * (1 - discount / 100);
    } else {
      return price - discount;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader showBack />
      <View style={styles.container}>
        <Text style={styles.heading}>Product Details</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{product.name}</Text>
          <Text style={styles.label}>Price:</Text>
          <Price amount={getDiscountedPrice(product)} style={styles.value} />
          {product.discount > 0 && (
            <Price amount={product.price} style={[styles.value, { textDecorationLine: 'line-through', color: '#888', marginLeft: 8 }]} />
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={() => router.push({ pathname: `/product/${product.id}/edit` })}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => {
            Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => {
                deleteProduct(product.id);
                Alert.alert('Deleted', 'Product deleted!', [
                  { text: 'OK', onPress: () => router.replace('/index') }
                ]);
              } },
            ]);
          }}>
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
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#f4c430',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});