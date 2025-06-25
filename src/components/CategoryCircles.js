import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import PropTypes from "prop-types";
import { COLORS, SPACING, TYPOGRAPHY } from "../utils/theme";

const iconMap = {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
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
              <IconComponent
                name={category.icon}
                size={26}
                color={COLORS.text.primary}
              />
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
    marginBottom: SPACING.md,
    width: "20%",
  },
  categoryText: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.caption,
    fontWeight: "500",
    textAlign: "center",
  },
  circle: {
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: "50%",
    height: 45,
    justifyContent: "center",
    marginBottom: SPACING.sm,
    width: 45,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
});
