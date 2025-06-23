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

const { width } = Dimensions.get("window");

const iconMap = {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
};

const COLORS = {
  card: "#d9d9d9",
  card2: "#d2d0d0",
  overlay: "rgba(255,255,255,0.7)",
  gray: "#333",
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
                  <IconComponent name={category.icon} size={24} color="black" />
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
    borderRadius: 15,
    marginBottom: 16,
    overflow: "hidden",
    width: "48%",
  },
  cardImage: {
    backgroundColor: COLORS.card2,
    height: width * 0.4,
    width: "100%",
  },
  categoryText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: COLORS.overlay,
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
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  textContainer: {
    height: width * 0.1,
    justifyContent: "center",
    paddingLeft: 10,
  },
});
