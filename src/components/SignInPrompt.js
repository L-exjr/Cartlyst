import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";
import PropTypes from "prop-types";

export default function SignInPrompt({ title, message, iconName = "user" }) {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <View style={styles.container}>
      <FontAwesome6
        name={iconName}
        size={80}
        color={COLORS.primary}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.push("/sign-up")}
      >
        <Text style={styles.signUpText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.centered,
    backgroundColor: COLORS.background,
    flex: 1,
    padding: SPACING.xl,
  },
  icon: {
    marginBottom: SPACING.lg,
  },
  message: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    lineHeight: 24,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  signInButton: {
    ...commonStyles.button,
    marginBottom: SPACING.md,
    width: "100%",
  },
  signInText: {
    ...commonStyles.buttonText,
  },
  signUpButton: {
    alignItems: "center",
    backgroundColor: COLORS.overlay,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    padding: SPACING.md,
    width: "100%",
  },
  signUpText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.body,
    fontWeight: "bold",
  },
  title: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.h2,
    fontWeight: "bold",
    marginBottom: SPACING.md,
    textAlign: "center",
  },
});

SignInPrompt.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  iconName: PropTypes.string,
};
