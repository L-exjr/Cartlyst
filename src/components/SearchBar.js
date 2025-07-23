import React from "react";
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Text, Image } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";

export default function SearchBar({ onSearch, suggestions = [], onAssistantPress }) {
  const [value, setValue] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()) && value.trim());
  const highlightMatch = (suggestion, term) => {
    if (!term) return <Text style={styles.suggestionText}>{suggestion}</Text>;
    const idx = suggestion.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) return <Text style={styles.suggestionText}>{suggestion}</Text>;
    return (
      <Text style={styles.suggestionText}>
        {suggestion.substring(0, idx)}
        <Text style={styles.suggestionHighlight}>{suggestion.substring(idx, idx + term.length)}</Text>
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
          onChangeText={text => {
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
        <TouchableOpacity onPress={onAssistantPress} style={styles.assistantIconContainer}>
          <Image source={require("../assets/aicon.png")} style={styles.assistantIcon} />
        </TouchableOpacity>
      </View>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          <FlatList
            data={filteredSuggestions}
            keyExtractor={item => item}
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

const styles = StyleSheet.create({
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
  suggestionsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginTop: 2,
    maxHeight: 150,
    zIndex: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  suggestionItem: {
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  suggestionText: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
  },
  suggestionHighlight: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  assistantIconContainer: {
    marginLeft: SPACING.sm,
    padding: 4,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});
