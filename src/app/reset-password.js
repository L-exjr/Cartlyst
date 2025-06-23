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

const COLORS = {
  white: "#fff",
  gold: "#d4af37",
  gray: "gray",
  gray2: "#666",
  gray3: "#333",
  gray4: "#f1f1f1",
  red: "red",
  errorBg: "#FFE5E5",
  errorBorder: "#FF3B30",
  errorShadow: "#000",
  arrow: "#333",
  black: "#000",
};

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
    padding: 8,
    position: "absolute",
    top: 60,
    zIndex: 1,
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  errorContainer: {
    backgroundColor: COLORS.errorBg,
    borderLeftColor: COLORS.errorBorder,
    borderLeftWidth: 4,
    borderRadius: 8,
    elevation: 5,
    left: 20,
    padding: 12,
    position: "absolute",
    right: 20,
    shadowColor: COLORS.errorShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    top: 120,
  },
  errorText: {
    color: COLORS.errorBorder,
    fontSize: 14,
    textAlign: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  input: {
    backgroundColor: COLORS.gray4,
    borderRadius: 10,
    height: 50,
    padding: 12,
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  inputError: {
    borderColor: COLORS.red,
    borderWidth: 1,
  },
  label: {
    color: COLORS.gray3,
    fontSize: 14,
    fontWeight: "300",
    marginBottom: 8,
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  resetButtonText: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  subtitle: {
    color: COLORS.gray2,
    fontSize: 16,
    marginBottom: 30,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
