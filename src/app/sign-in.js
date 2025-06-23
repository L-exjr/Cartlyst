import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Image,
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
  blue: "#2196f3",
  errorBg: "#FFE5E5",
  errorBorder: "#FF3B30",
  errorShadow: "#000",
  FF3B30: "#FF3B30",
  E0E0E0: "#E0E0E0",
  f1f1f1: "#f1f1f1",
  d4af37: "#d4af37",
  gray2: "#666",
  gray3: "#333",
  gray5: "#999",
  black: "#000",
};

export default function SignInScreen() {
  const { logIn, setGuestMode, setshouldCreateAccount, setResettingPassword } =
    useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorAnimation] = useState(new Animated.Value(0));
  const [error, setError] = useState("");

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

  const validateForm = () => {
    const errors = {};

    // Email Validation
    if (!formData.email) {
      showError("Email/Phone is required");
      return false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.email,
      ) &&
      !/^\+?[1-9]\d{1,14}$/.test(formData.email)
    ) {
      showError("Please enter a valid email or phone number");
      return false;
    }

    // Password validation
    if (!formData.password) {
      showError("Password is required");
      return false;
    } else if (formData.password.length < 8) {
      showError("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    try {
      if (!validateForm()) return;

      logIn();
      router.replace("/(tabs)");
    } catch (error) {
      showError(error.message || "An error occurred while signing in");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.skipButton}
            onPress={async () => {
              await setGuestMode();
              router.replace("/(tabs)");
            }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Sign In</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email/Phone</Text>
              <TextInput
                placeholder="Email/Phone"
                style={styles.input}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome6
                    name={showPassword ? "eye-slash" : "eye"}
                    size={20}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordTouchable}
              onPress={() => {
                setResettingPassword(true);
                router.push("reset-password");
              }}
            >
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUp}>
                Don&apos;t have an account?{" "}
                <Text
                  style={styles.signUpLink}
                  onPress={() => {
                    setshouldCreateAccount(true);
                    router.replace("sign-up");
                  }}
                >
                  Sign Up
                </Text>
              </Text>
            </View>

            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../assets/Google.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome6 name="apple" size={40} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
              <Text style={styles.footer}>
                By continuing you agree to SwiftMart&apos;s
              </Text>
              <Text style={styles.footerLink}>Terms and Conditions</Text>
            </View>
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
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
    gap: 1,
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
    color: COLORS.FF3B30,
    fontSize: 14,
    textAlign: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
  },
  footer: {
    color: COLORS.gray2,
    marginBottom: 4,
    textAlign: "center",
  },
  footerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerLink: {
    color: COLORS.d4af37,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  forgotPassword: {
    color: COLORS.gray5,
  },
  forgotPasswordTouchable: {
    alignSelf: "flex-end",
    marginBottom: 20,
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
  label: {
    color: COLORS.gray3,
    fontSize: 14,
    fontWeight: "300",
    marginBottom: 8,
  },
  line: {
    backgroundColor: COLORS.E0E0E0,
    flex: 1,
    height: 1,
  },
  logo: {
    height: 350,
    marginBottom: -90,
    marginTop: -110,
    resizeMode: "contain",
    width: 350,
  },
  orContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
  },
  orText: {
    color: COLORS.gray2,
    marginHorizontal: 10,
  },
  passwordContainer: {
    alignItems: "center",
    backgroundColor: COLORS.gray4,
    borderRadius: 10,
    flexDirection: "row",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  signInButton: {
    alignItems: "center",
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  signInText: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: "bold",
  },
  signUp: {
    color: COLORS.gray3,
    textAlign: "center",
  },
  signUpContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  signUpLink: {
    color: COLORS.blue,
  },
  skipButton: {
    position: "absolute",
    right: 25,
    top: 60,
    zIndex: 1,
  },
  skipText: {
    color: COLORS.gray,
    fontSize: 20,
    fontWeight: "500",
  },
  socialButton: {
    alignItems: "center",
    backgroundColor: COLORS.f1f1f1,
    borderRadius: 30,
    elevation: 5,
    height: 60,
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    width: 60,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    gap: 50,
    justifyContent: "center",
    marginBottom: 10,
  },
  socialIcon: {
    height: 80,
    resizeMode: "contain",
    width: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
