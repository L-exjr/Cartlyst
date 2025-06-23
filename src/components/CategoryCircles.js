import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import PropTypes from "prop-types";

const iconMap = {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
};

const COLORS = {
  circle: "#d9d9d9",
  gray: "#333",
};

export default function CategoryCircles({ categories = [], onPress }) {
  return (
    <View style={styles.container}>
      {categories.map((category, index) => {
        const IconComponent = iconMap[category.iconFamily];
        if (!IconComponent) return null;

        return (
          <TouchableOpacity
            key={index}
            style={styles.categoryItem}
            onPress={() => onPress?.(category)}
          >
            <View style={styles.circle}>
              <IconComponent name={category.icon} size={26} color="black" />
            </View>
            <Text style={styles.categoryText} numberOfLines={2}>
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

CategoryCircles.propTypes = {
  categories: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: "center",
    marginBottom: 15,
    width: "20%",
  },
  categoryText: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  circle: {
    alignItems: "center",
    backgroundColor: COLORS.circle,
    borderRadius: "50%",
    height: 45,
    justifyContent: "center",
    marginBottom: 8,
    width: 45,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
