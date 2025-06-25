import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import PropTypes from "prop-types";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from "../utils/theme";

const { width } = Dimensions.get("window");

const iconMap = {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
};

export default function CategoryCards({ categories, onPress }) {
  return (
    <View style={styles.container}>
      {categories.map((category, index) => {
        const IconComponent = iconMap[category.iconFamily];

        return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => onPress?.(category)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: category.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />

              {IconComponent && (
                <View style={styles.iconCircle}>
                  <IconComponent
                    name={category.icon}
                    size={24}
                    color={COLORS.text.primary}
                  />
                </View>
              )}
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

CategoryCards.propTypes = {
  categories: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: "hidden",
    width: "48%",
    ...SHADOWS.small,
  },
  cardImage: {
    backgroundColor: COLORS.gray[200],
    height: width * 0.4,
    width: "100%",
  },
  categoryText: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
    fontWeight: "bold",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.sm,
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: COLORS.overlayLight,
    borderRadius: 999,
    height: width * 0.1145,
    justifyContent: "center",
    position: "absolute",
    right: width * 0.01,
    top: width * 0.025,
    width: width * 0.1145,
    zIndex: 2,
  },
  imageContainer: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    position: "relative",
  },
  textContainer: {
    height: width * 0.1,
    justifyContent: "center",
    paddingLeft: SPACING.sm,
  },
});
