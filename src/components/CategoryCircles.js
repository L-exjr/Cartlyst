import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import Animated, { FadeInRight } from 'react-native-reanimated';
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
          <Animated.View
            key={index}
            entering={FadeInRight.delay(index * 100)}
          >
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => onPress?.(category)}
              activeOpacity={0.7}
            >
              <View style={styles.circle}>
                <IconComponent
                  name={category.icon}
                  size={24}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.categoryText} numberOfLines={2}>
                {category.name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  circle: {
    alignItems: "center",
    backgroundColor: COLORS.primary + '15',
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
});
