import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const COLORS = {
  white: "#fff",
  background: "#f5f5f5",
  gray: "#333",
};

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome6
          name="magnifying-glass"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          placeholderTextColor="#666"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 10,
  },
  input: {
    color: COLORS.gray,
    flex: 1,
    fontSize: 16,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    flexDirection: "row",
    height: 40,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
});
