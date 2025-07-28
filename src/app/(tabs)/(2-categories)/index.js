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
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import CategoryCards from "../../../components/CategoryCards";
import { COLORS, SPACING, TYPOGRAPHY } from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";
import { API_BASE_URL } from "../../../utils/config";
import { useRouter } from "expo-router";
import SearchBarWithHistory from "../../../components/SearchBarWithHistory";
import { useTranslation } from "react-i18next";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  // Add effect to filter categories as user types
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredCategories(
        categories.filter((c) => c.name.toLowerCase().includes(lower)),
      );
    }
  }, [searchTerm, categories]);

  // Update handleSearch to handle category search by name
  const handleSearch = (term, categoryName) => {
    // Find the category by name
    const foundCategory = categories.find(
      (c) => c.name.toLowerCase() === (categoryName || term).toLowerCase(),
    );
    if (foundCategory) {
      router.push({
        pathname: `/products/${foundCategory.id}`,
        params: { categoryName: foundCategory.name },
      });
    } else {
      // If not found, just filter the list
      setSearchTerm(term);
    }
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
    return (
      <LoadingSpinner text={t("loadingCategories", "Loading categories...")} />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {t(
            "categoriesError",
            "Failed to load categories. Please check your internet connection.",
          )}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
          <Text style={styles.retryText}>{t("retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.fixedHeader}>
        <SearchBarWithHistory
          onSearch={handleSearch}
          suggestionsSource={categories.map((c) => ({
            title: c.name,
            category: t("all"),
          }))}
          categoryName={t("all")}
          placeholder={t("searchCategoriesPlaceholder", "Search categories...")}
          onAssistantPress={() => router.push("/(tabs)/(1-home)/Cartlyst")}
        />
      </View>
      {filteredCategories.length === 0 && (
        <Text
          style={{ textAlign: "center", color: COLORS.error, marginTop: 16 }}
        >
          {t("noCategoriesFound", "No categories found.")}
        </Text>
      )}
      <ScrollView>
        <CategoryCards
          categories={filteredCategories}
          onPress={(category) => {
            router.push({
              pathname: `/products/${category.id}`,
              params: { categoryName: category.name },
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
