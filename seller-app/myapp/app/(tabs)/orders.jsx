import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOrderStore } from '../../store/orderStore';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

const OrdersScreen = () => {
  const { orders } = useOrderStore();
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: `/order/${item.id}` })}
      style={styles.card}
    >
      <View style={styles.row}>
        <Text style={styles.product}>{item.product}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <Text style={styles.meta}>Qty: {item.quantity} | ₵{item.total}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader />
      <View style={styles.container}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  product: {
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    color: '#f4c430',
    fontWeight: '500',
  },
  meta: {
    fontSize: 13,
    color: '#555',
  },
  date: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
});
