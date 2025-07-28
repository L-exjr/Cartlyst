import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRecent } from "../../../../utils/recentContext";
import { COLORS } from "../../../../utils/theme";

const RecentlySearchedModal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    isLoading,
    error,
  } = useRecent();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm);
      setSearchTerm("");
    }
  };

  // Show loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Error loading recent searches</Text>
        <Button title="Retry" onPress={() => clearRecentSearches()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search..."
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Button
          title="Search"
          onPress={handleSearch}
          disabled={!searchTerm.trim()}
        />
      </View>

      <Text style={styles.sectionTitle}>Recent Searches:</Text>

      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <Text
            style={styles.recentItem}
            onPress={() => {
              setSearchTerm(item.itemId);
              // Optional: Auto-trigger search when tapping recent item
              // handleSearch();
            }}
          >
            {item.itemId}
          </Text>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recent searches found</Text>
        }
        contentContainerStyle={recentSearches.length === 0 && styles.emptyList}
      />

      {recentSearches.length > 0 && (
        <Button
          title="Clear History"
          onPress={clearRecentSearches}
          color="#ff4444"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: COLORS.surface,
    flex: 1,
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    color: COLORS.gray[300],
    marginTop: 16,
    textAlign: "center",
  },
  errorText: {
    color: COLORS.warning,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderColor: COLORS.gray[400],
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
    padding: 8,
  },
  recentItem: {
    borderBottomColor: COLORS.gray[200],
    borderBottomWidth: 1,
    padding: 12,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default RecentlySearchedModal;