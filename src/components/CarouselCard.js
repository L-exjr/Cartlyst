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
    height: 200,
    overflow: "hidden",
    marginHorizontal: SPACING.md,
    shadowColor: COLORS.text.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: "flex-end",
  },
  title: {
    color: COLORS.text.inverse,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    textShadowColor: COLORS.text.primary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  typeContainer: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  typeText: {
    color: COLORS.text.inverse,
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    fontWeight: "bold",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
