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
import { router, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../utils/authStore";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../utils/config";

export const options = { headerShown: false };

export default function ResetPasswordScreen() {
  const { setResettingPassword } = useAuthStore();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [errorAnimation] = useState(new Animated.Value(0));
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const token = params.token;

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
    if (token) {
      // Handle actual password reset with token
      if (!newPassword || !confirmPassword) {
        showError("Please enter and confirm your new password");
        return;
      }
      if (newPassword.length < 8) {
        showError("Password must be at least 8 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        showError("Passwords do not match");
        return;
      }
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
          setSuccess("Your password has been reset. You can now sign in.");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          showError(
            data.error || "An error occurred while resetting your password",
          );
        }
      } catch (error) {
        setLoading(false);
        showError(
          error.message || "An error occurred while resetting your password",
        );
      }
      return;
    }
    // Handle email reset logic
    try {
      if (!email.trim()) {
        showError("Email is required");
        return;
      }
      if (!validateEmail(email)) {
        showError("Please enter a valid email");
        return;
      }
      setLoading(true);
      setError("");
      setSuccess("");
      // Compute the base URL for the reset link (remove /api or /api/auth if present)
      let resetBaseUrl = API_BASE_URL.replace(/\/api(\/auth)?$/, "");
      console.log(
        "Sending password reset request for:",
        email,
        "with resetBaseUrl:",
        resetBaseUrl,
      );
      // Call backend API
      const res = await fetch(
        `${API_BASE_URL}/api/auth/request-password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, resetBaseUrl }),
        },
      );
      const data = await res.json();
      console.log("Password reset response:", res.status, data);
      setLoading(false);
      if (res.ok) {
        setSuccess(
          "If your email is registered, you will receive a password reset link.",
        );
        setEmail("");
      } else {
        showError(
          data.error || "An error occurred while resetting your password",
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Password reset error:", error);
      showError(
        error.message || "An error occurred while resetting your password",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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
                {token ? (
                  <Text style={styles.subtitle}>
                    Enter your new password below.
                  </Text>
                ) : (
                  <Text style={styles.subtitle}>
                    Enter your email address and you'll receive instructions to
                    reset your password.
                  </Text>
                )}
              </View>
              {token ? (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                      placeholder="Enter new password"
                      style={[styles.input, error && styles.inputError]}
                      value={newPassword}
                      onChangeText={(text) => {
                        setNewPassword(text);
                        setError("");
                      }}
                      secureTextEntry
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                      placeholder="Confirm new password"
                      style={[styles.input, error && styles.inputError]}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        setError("");
                      }}
                      secureTextEntry
                    />
                  </View>
                </>
              ) : (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    placeholder="Enter your Email"
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
              )}
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.resetButtonText}>
                  {loading
                    ? "Sending..."
                    : token
                      ? "Set New Password"
                      : "Reset Password"}
                </Text>
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
            {success ? (
              <View
                style={[
                  styles.errorContainer,
                  {
                    backgroundColor: COLORS.success,
                    borderLeftColor: COLORS.success,
                  },
                ]}
              >
                <Text
                  style={[styles.errorText, { color: COLORS.text.primary }]}
                >
                  {success}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
