import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";

const { width } = Dimensions.get("window");

const COLORS = {
  gold: "#d4af37",
  white: "#fff",
  black: "#000",
  overlay: "rgba(0,0,0,0.3)",
  textShadow: "rgba(0,0,0,0.5)",
  gray: "#333",
};

export default function CarouselCard({ source, type, title }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: source }} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay}>
        <View style={styles.content}>
          {type && (
            <View style={styles.typeContainer}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          )}
          {title && (
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

CarouselCard.propTypes = {
  source: PropTypes.string.isRequired,
  type: PropTypes.string,
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    height: width * 0.5,
    overflow: "hidden",
    width: width,
  },
  content: {
    padding: 20,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: "flex-end",
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: COLORS.textShadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  typeContainer: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.gold,
    borderRadius: 20,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});
