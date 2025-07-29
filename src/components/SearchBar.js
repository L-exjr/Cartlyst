import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../utils/theme";
import PropTypes from "prop-types";

export default function SearchBar({
  onSearch,
  suggestions = [],
  onAssistantPress,
}) {
  const [value, setValue] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(value.toLowerCase()) && value.trim(),
  );
  const highlightMatch = (suggestion, term) => {
    if (!term) return <Text style={styles.suggestionText}>{suggestion}</Text>;
    const idx = suggestion.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1)
      return <Text style={styles.suggestionText}>{suggestion}</Text>;
    return (
      <Text style={styles.suggestionText}>
        {suggestion.substring(0, idx)}
        <Text style={styles.suggestionHighlight}>
          {suggestion.substring(idx, idx + term.length)}
        </Text>
        {suggestion.substring(idx + term.length)}
      </Text>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome6
          name="magnifying-glass"
          size={20}
          color={COLORS.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          placeholderTextColor={COLORS.text.secondary}
          value={value}
          onChangeText={(text) => {
            setValue(text);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          onSubmitEditing={() => {
            if (onSearch && value.trim()) onSearch(value.trim());
            setShowSuggestions(false);
          }}
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={onAssistantPress}
          style={styles.assistantIconContainer}
        >
          <Image
            source={require("../assets/aicon.png")}
            style={styles.assistantIcon}
          />
        </TouchableOpacity>
      </View>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setValue(item);
                  setShowSuggestions(false);
                  if (onSearch) onSearch(item);
                }}
              >
                {highlightMatch(item, value)}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  onAssistantPress: PropTypes.func,
};

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
    justifyContent: "center",
    marginLeft: SPACING.sm,
    padding: 4,
  },
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
  },
  input: {
    color: COLORS.text.primary,
    flex: 1,
    ...TYPOGRAPHY.body,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: "row",
    height: 40,
    paddingHorizontal: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  suggestionHighlight: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  suggestionItem: {
    borderBottomColor: COLORS.gray[200],
    borderBottomWidth: 1,
    padding: SPACING.sm,
  },
  suggestionText: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
  },
  suggestionsBox: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    elevation: 2,
    left: 0,
    marginTop: 2,
    maxHeight: 150,
    position: "absolute",
    right: 0,
    ...SHADOWS.medium,
    top: 48,
    zIndex: 10,
  },
});
