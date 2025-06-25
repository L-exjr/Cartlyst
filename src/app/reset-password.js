import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../utils/authStore";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";

export default function ResetPasswordScreen() {
  const { setResettingPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [errorAnimation] = useState(new Animated.Value(0));

  const showError = (message) => {
    setError(message);
    Animated.sequence([
      Animated.timing(errorAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(errorAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setError(""));
  };

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleResetPassword = async () => {
    try {
      if (!email.trim()) {
        showError("Email is required");
        return;
      }

      if (!validateEmail(email)) {
        showError("Please enter a valid email");
        return;
      }

      // Here you would typically make an API call to your backend to handle the password reset
      // For now, we'll just simulate a successful reset
      setError("");
      setResettingPassword(false);
      router.replace("sign-in");
    } catch (error) {
      showError(
        error.message || "An error occurred while resetting your password",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setResettingPassword(false);
          router.replace("sign-in");
        }}
      >
        <FontAwesome6 name="arrow-left" size={24} color={COLORS.arrow} />
      </TouchableOpacity>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your email address and you&apos;ll receive instructions to
                reset your password.
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter you Email"
                style={[styles.input, error && styles.inputError]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.resetButtonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <Animated.View
              style={[
                styles.errorContainer,
                {
                  opacity: errorAnimation,
                  transform: [
                    {
                      translateY: errorAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    left: 25,
    padding: SPACING.sm,
    position: "absolute",
    top: 60,
    zIndex: 1,
  },
  container: {
    backgroundColor: COLORS.surface,
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingTop: 100,
  },
  errorContainer: {
    backgroundColor: COLORS.error,
    borderLeftColor: COLORS.error,
    borderLeftWidth: 4,
    borderRadius: BORDER_RADIUS.md,
    elevation: 5,
    left: SPACING.lg,
    padding: SPACING.sm,
    position: "absolute",
    right: SPACING.lg,
    shadowColor: COLORS.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    top: 120,
  },
  errorText: {
    color: COLORS.text.inverse,
    ...TYPOGRAPHY.caption,
    textAlign: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  input: {
    ...commonStyles.input,
    width: "100%",
  },
  inputContainer: {
    marginBottom: SPACING.lg,
    width: "100%",
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  label: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.caption,
    fontWeight: "300",
    marginBottom: SPACING.sm,
  },
  resetButton: {
    ...commonStyles.button,
    marginTop: SPACING.lg,
    width: "100%",
  },
  resetButtonText: {
    ...commonStyles.buttonText,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  subtitle: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: "center",
  },
});
