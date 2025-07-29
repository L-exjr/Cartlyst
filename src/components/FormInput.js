import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  ...props
}) {
  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...props}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

FormInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
};

FormInput.defaultProps = {
  label: null,
  placeholder: "",
  error: null,
  secureTextEntry: false,
  keyboardType: "default",
  multiline: false,
  numberOfLines: 1,
};

const styles = StyleSheet.create({
  error: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginTop: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.inputBackground || COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body.fontSize,
    padding: SPACING.sm,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
