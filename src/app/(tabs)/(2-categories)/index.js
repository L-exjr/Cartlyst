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
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import CategoryCards from "../../../components/CategoryCards";
import { COLORS, SPACING, TYPOGRAPHY } from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";
import { API_BASE_URL } from "../../../utils/config";
import { useRouter } from "expo-router";
import SearchBarWithHistory from "../../../components/SearchBarWithHistory";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const handleSearch = (term, category) => {
    router.push({
      pathname: "/(2-categories)/ProductsScreen",
      params: { search: term, categoryName: category }
    });
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(
        "Failed to load categories. Please check your internet connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading categories..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.fixedHeader}>
        <SearchBarWithHistory
          onSearch={handleSearch}
          suggestionsSource={categories.map(c => ({ title: c.name, category: "All" }))}
          categoryName={"All"}
          placeholder="Search categories..."
        />
      </View>
      <ScrollView>
        <CategoryCards
          categories={filteredCategories}
          onPress={(category) => {
            router.push({
              pathname: "/(2-categories)/ProductsScreen",
              params: { categoryId: category.id, categoryName: category.name },
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  errorContainer: {
    ...commonStyles.centered,
    backgroundColor: COLORS.background,
    flex: 1,
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  fixedHeader: {
    zIndex: 10,
  },
  retryButton: {
    ...commonStyles.button,
  },
  retryText: {
    ...commonStyles.buttonText,
  },
});
