import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SPACING, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function SignInPrompt({ title, message, iconName = "user" }) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={iconName}
        size={100}
        color={COLORS.primary}
        style={styles.icon}
      />
      <Text style={styles.title}>{t(title)}</Text>
      <Text style={styles.message}>{t(message)}</Text>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInText}>{t("signIn")}</Text>
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
