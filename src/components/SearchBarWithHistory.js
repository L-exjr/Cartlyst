import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  Image,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";

const SEARCH_HISTORY_KEY = "global_product_search_history";
const MAX_HISTORY = 8;

export default function SearchBarWithHistory({
  onSearch,
  suggestionsSource = [], // [{title, category}]
  categoryName = "",
  placeholder = "Search products...",
  showBackButton = false,
  onBack = () => {},
  onAssistantPress, // <-- new prop
}) {
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef();

  // Load history on mount
  useEffect(() => {
    AsyncStorage.getItem(SEARCH_HISTORY_KEY).then((val) => {
      if (val) setSearchHistory(JSON.parse(val));
    });
  }, []);

  // Suggestions: update as user types
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    const lower = search.toLowerCase();
    const matches = suggestionsSource
      .filter(
        (p) =>
          (p.title &&
            typeof p.title === "string" &&
            p.title.toLowerCase().includes(lower)) ||
          (p.category &&
            typeof p.category === "string" &&
            p.category.toLowerCase().includes(lower)),
      )
      .map((p) => ({
        title: p.title,
        category: p.category,
      }))
      .filter(
        (v, i, arr) =>
          arr.findIndex(
            (x) => x.title === v.title && x.category === v.category,
          ) === i,
      )
      .slice(0, 8);
    setSuggestions(matches);
  }, [search, suggestionsSource]);

  // Add to search history
  const addToSearchHistory = async (term, category) => {
    if (!term) return;
    const entry = { term, category };
    let newHistory = [
      entry,
      ...searchHistory.filter(
        (t) => t.term !== term || t.category !== category,
      ),
    ];
    if (newHistory.length > MAX_HISTORY)
      newHistory = newHistory.slice(0, MAX_HISTORY);
    setSearchHistory(newHistory);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  // Search submit handler
  const handleSearchSubmit = () => {
    addToSearchHistory(search, categoryName);
    onSearch && onSearch(search, categoryName);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  // Show history when search bar is focused and empty
  const handleSearchFocus = () => {
    if (!search) setShowSuggestions(true);
  };
  const handleSearchChange = (text) => {
    setSearch(text);
    setShowSuggestions(true);
  };

  // Tap on suggestion or history
  const handleSuggestionTap = (term, cat) => {
    setSearch(term);
    setShowSuggestions(false);
    addToSearchHistory(term, cat);
    onSearch && onSearch(term, cat);
    Keyboard.dismiss();
  };

  // Helper: should show category name in HomeScreen (not 'All'), or just category in CategoriesScreen
  const showCategoryOnly =
    placeholder && placeholder.toLowerCase().includes("categories");

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          onPress={onBack}
          style={{
            marginRight: 8,
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: 40,
          }}
        >
          <FontAwesome6
            name="arrow-left"
            size={20}
            color={COLORS.text.primary}
          />
        </TouchableOpacity>
      )}
      <View style={styles.searchContainer}>
        <FontAwesome6
          name="magnifying-glass"
          size={20}
          color={COLORS.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          ref={searchInputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.secondary}
          value={search}
          onChangeText={handleSearchChange}
          onFocus={handleSearchFocus}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearch("");
              setShowSuggestions(false);
            }}
            style={{
              marginLeft: 8,
              justifyContent: "center",
              alignItems: "center",
              height: 40,
              width: 32,
            }}
          >
            <FontAwesome6
              name="xmark"
              size={18}
              color={COLORS.text.secondary}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onAssistantPress}
          style={styles.assistantIconContainer}
        >
          <Image
            source={require("../../assets/aicon.png")}
            style={styles.assistantIcon}
          />
        </TouchableOpacity>
      </View>
      {showSuggestions &&
        (search.length > 0
          ? suggestions.length > 0
          : searchHistory.length > 0) && (
          <ScrollView
            style={styles.suggestionDropdown}
            keyboardShouldPersistTaps="handled"
          >
            {search.length > 0 &&
              suggestions.map((s, i) => (
                <TouchableOpacity
                  key={s.title + s.category + i}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionTap(s.title, s.category)}
                >
                  {showCategoryOnly ? (
                    <Text style={styles.categoryText}>{s.title}</Text>
                  ) : (
                    <Text>
                      <Text style={styles.productText}>{s.title}</Text>
                      {s.category && (
                        <Text>
                          {" "}
                          in{" "}
                          <Text style={styles.categoryText}>{s.category}</Text>
                        </Text>
                      )}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            {search.length === 0 &&
              searchHistory.map((h, i) => (
                <TouchableOpacity
                  key={h.term + h.category + i}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionTap(h.term, h.category)}
                >
                  {showCategoryOnly ? (
                    <Text style={styles.categoryText}>{h.term}</Text>
                  ) : (
                    <Text>
                      <Text style={styles.productText}>{h.term}</Text>
                      {h.category && (
                        <Text>
                          {" "}
                          in{" "}
                          <Text style={styles.categoryText}>{h.category}</Text>
                        </Text>
                      )}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  assistantIcon: {
    height: 28,
    resizeMode: "contain",
    width: 28,
  },
  assistantIconContainer: {
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginLeft: 4,
    padding: 4,
    width: 40,
  },
  categoryText: {
    color: COLORS.error,
    fontWeight: "bold",
  },
  container: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    padding: SPACING.sm,
    position: "relative",
  },
  input: {
    color: COLORS.text.primary,
    flex: 1,
    ...TYPOGRAPHY.body,
  },
  productText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: "row",
    flex: 1,
    height: 40,
    paddingHorizontal: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  suggestionDropdown: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    elevation: 4,
    left: 0,
    maxHeight: 180,
    position: "absolute",
    right: 0,
    top: 48,
    zIndex: 10,
  },
  suggestionItem: {
    borderBottomColor: COLORS.gray[100],
    borderBottomWidth: 1,
    padding: 12,
  },
});
