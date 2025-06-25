import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { COLORS, SPACING, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";

const LoadingSpinner = ({
  size = "large",
  color = COLORS.primary,
  text = "Loading...",
  containerStyle = {},
  textStyle = {},
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.centered,
    backgroundColor: COLORS.background,
    flex: 1,
    padding: SPACING.lg,
  },
  text: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    marginTop: SPACING.md,
    textAlign: "center",
  },
});

LoadingSpinner.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  text: PropTypes.string,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
};

export default LoadingSpinner;
