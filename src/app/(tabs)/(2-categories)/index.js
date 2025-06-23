import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SearchBar from "../../../components/SearchBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CategoryCards from "../../../components/CategoryCards";

const COLORS = { background: "#f5f5f5", circle: "#ddd" };

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://192.168.227.168:8089/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.fixedHeader}>
        <SearchBar />
      </View>
      <ScrollView style={styles.container}>
        <CategoryCards
          categories={categories}
          onPress={(category) => {
            console.log("Selected category:", category.name);
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  fixedHeader: {
    zIndex: 10,
  },
});
