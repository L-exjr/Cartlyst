import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";

const { width } = Dimensions.get("window");

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
    borderRadius: BORDER_RADIUS.lg,
    height: width * 0.5,
    overflow: "hidden",
    width: width,
  },
  content: {
    padding: SPACING.lg,
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
    color: COLORS.text.inverse,
    ...TYPOGRAPHY.h2,
    textShadowColor: COLORS.text.primary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  typeContainer: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  typeText: {
    color: COLORS.text.inverse,
    ...TYPOGRAPHY.caption,
    fontWeight: "bold",
  },
});
