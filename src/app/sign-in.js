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
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../utils/authStore";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../utils/config";
import { useTranslation } from "react-i18next";

export const options = { headerShown: false };

export default function SignInScreen() {
  const { logIn, setGuestMode, setshouldCreateAccount, setResettingPassword } =
    useAuthStore();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorAnimation] = useState(new Animated.Value(0));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      showError(t("emailOrPhoneRequired"));
      return false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.email,
      ) &&
      !/^\+?[1-9]\d{1,14}$/.test(formData.email)
    ) {
      showError(t("invalidEmailOrPhone"));
      return false;
    }

    // Password validation
    if (!formData.password) {
      showError(t("passwordRequired"));
      return false;
    } else if (formData.password.length < 8) {
      showError(t("passwordMinLength"));
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    try {
      if (!validateForm()) return;
      setIsLoading(true);
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        logIn(data.id); // Store user id
        router.replace("/(tabs)");
      } else {
        showError(data.error || t("invalidCredentials"));
      }
    } catch (error) {
      showError(error.message || t("signInError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              <Text style={styles.skipText}>{t("skip")}</Text>
            </TouchableOpacity>

            <View style={styles.contentContainer}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>{t("signIn")}</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("emailOrPhone")}</Text>
                <TextInput
                  placeholder={t("emailOrPhone")}
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
                <Text style={styles.label}>{t("password")}</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder={t("password")}
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
                <Text style={styles.forgotPassword}>{t("forgotPassword")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signInText}>{t("signIn")}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUp}>
                  {t("noAccount")}{" "}
                  <Text
                    style={styles.signUpLink}
                    onPress={() => {
                      setshouldCreateAccount(true);
                      router.replace("sign-up");
                    }}
                  >
                    {t("signUp")}
                  </Text>
                </Text>
              </View>

              <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>{t("or")}</Text>
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
                  <FontAwesome6
                    name="apple"
                    size={40}
                    color={COLORS.text.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.footerContainer}>
                <Text style={styles.footer}>{t("agreeToTerms")}</Text>
                <Text style={styles.footerLink}>{t("termsAndConditions")}</Text>
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
                <Text style={styles.errorText}>{t(error)}</Text>
              </Animated.View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
    gap: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
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
  eyeIcon: {
    position: "absolute",
    right: SPACING.sm,
  },
  footer: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  footerContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  footerLink: {
    color: COLORS.primary,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  forgotPassword: {
    color: COLORS.text.tertiary,
  },
  forgotPasswordTouchable: {
    alignSelf: "flex-end",
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
  label: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.caption,
    fontWeight: "300",
    marginBottom: SPACING.sm,
  },
  line: {
    backgroundColor: COLORS.gray[200],
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
    marginBottom: SPACING.lg,
    width: "100%",
  },
  orText: {
    color: COLORS.text.secondary,
    marginHorizontal: SPACING.sm,
  },
  passwordContainer: {
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    flexDirection: "row",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  signInButton: {
    ...commonStyles.button,
    marginBottom: SPACING.lg,
    width: "100%",
  },
  signInText: {
    ...commonStyles.buttonText,
    color: COLORS.text.primary,
  },
  signUp: {
    color: COLORS.text.primary,
    textAlign: "center",
  },
  signUpContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  signUpLink: {
    color: COLORS.secondary,
  },
  skipButton: {
    position: "absolute",
    right: 25,
    zIndex: 1,
  },
  skipText: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.h3,
    fontWeight: "500",
  },
  socialButton: {
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
    borderRadius: 30,
    elevation: 5,
    height: 60,
    justifyContent: "center",
    shadowColor: COLORS.text.primary,
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
    marginBottom: SPACING.sm,
  },
  socialIcon: {
    height: 80,
    resizeMode: "contain",
    width: 80,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
});
