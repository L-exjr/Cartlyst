import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  
} from 'react-native';
import SearchBar from '../../../components/SearchBar';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import CategoryCards from '../../../components/CategoryCards';

export default function CategoriesScreen({ navigation }) {

  const [categories, setCategories] = useState([]);
  const tabBarHeight=useBottomTabBarHeight();

useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const response = await fetch('http://192.168.227.168:8089/categories');
    const data = await response.json();
    setCategories(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

  
  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <SearchBar />
      </View>
          <ScrollView style={styles.container }>
  <CategoryCards
    categories={categories}
    onPress={(category) => {
      console.log('Selected category:', category.name);
    }}
  />
</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {  backgroundColor: '#f5f5f5', flex:1 },
  
  
  
  categoryItem: {
    alignItems: 'center',
    width: '20%',
    marginVertical: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 10,
    textAlign: 'center',
  },
});
