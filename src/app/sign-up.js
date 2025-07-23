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
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../utils/authStore";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../utils/config";
import { useTranslation } from 'react-i18next';

export const options = { headerShown: false };

export default function SignUpScreen() {
  const { t } = useTranslation();
  const { setVerification, setGuestMode, setshouldCreateAccount } =
    useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorAnimation] = useState(new Animated.Value(0));
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const showError = (message) => {
    try {
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
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (e) {
      showError("Failed to pick image. Please try again.");
    }
  };

  const validateForm = () => {
    try {
      // Full Name Validation
      if (!formData.fullName?.trim()) {
        showError("Full name is required");
        return false;
      } else if (formData.fullName.length < 3) {
        showError("Full name must be at least 3 characters");
        return false;
      }
      // Email Validation
      if (!formData.email?.trim()) {
        showError("Email is required");
        return false;
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
      ) {
        showError("Please enter a valid email");
        return false;
      }

      // Phone Number Validation
      if (!formData.phoneNumber?.trim()) {
        showError("Phone number is required");
        return false;
      } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
        showError("Please enter a valid phone number");
        return false;
      }

      // Password Validation
      if (!formData.password) {
        showError("Password is required");
        return false;
      } else if (formData.password.length < 8) {
        showError("Password must be at least 8 characters");
        return false;
      }

      // Confirm Password Validation
      if (!formData.confirmPassword) {
        showError("Confirm password is required");
        return false;
      } else if (formData.confirmPassword !== formData.password) {
        showError("Passwords do not match");
        return false;
      }

      return true;
    } catch (error) {
      showError("An unexpected error occurred. Please try again.");
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
      if (!validateForm()) return;
      setIsLoading(true);
      let profileImageUrl = null;
      // If a photo is selected, upload it first
      if (photo) {
        try {
          const formData = new FormData();
          formData.append('file', {
            uri: photo,
            type: 'image/jpeg',
            name: `profile-signup-${Date.now()}.jpg`
          });
          // Try Supabase upload first
          let uploadResponse = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          let uploadResult;
          if (!uploadResponse.ok) {
            // Try local upload as fallback
            uploadResponse = await fetch(`${API_BASE_URL}/files/upload-local`, {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (!uploadResponse.ok) {
              throw new Error('Both Supabase and local upload failed');
            }
            uploadResult = await uploadResponse.json();
          } else {
            uploadResult = await uploadResponse.json();
          }
          profileImageUrl = uploadResult.downloadUrl;
        } catch (e) {
          showError('Image upload failed: ' + e.message);
          setIsLoading(false);
          return;
        }
      }
      // Call backend API for signup
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          profileImageUrl: profileImageUrl,
        }),
      });
      const data = await response.json();
      console.log("Signup response status:", response.status, "data:", data);
      if (response.ok) {
        setVerification("email", { ...formData, id: data.id }); // Store user id for verification
        router.push("/verification");
      } else {
        showError(data.error || data.message || "Sign up failed");
      }
    } catch (error) {
      showError(error.message || "An error occurred while signing up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={async () => {
                  await setGuestMode();
                  router.replace("/(tabs)");
                }}
              >
                <Text style={styles.skipText}>{t('skip')}</Text>
              </TouchableOpacity>
              <Text style={styles.title}>{t('signUp')}</Text>
              <Text style={styles.subtitle}>{t('createAccount')}</Text>

              <View style={styles.imageContainer}>
                <View>
                  <Image
                    style={styles.image}
                    source={
                      photo
                        ? { uri: photo }
                        : require("../../assets/placeholder.png")
                    }
                  />
                  <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                    <FontAwesome6
                      name="camera"
                      size={24}
                      color={COLORS.text.tertiary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('fullName')}</Text>
                <TextInput
                  placeholder={t('fullName')}
                  style={styles.input}
                  value={formData.fullName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, fullName: text })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('email')}</Text>
                <TextInput
                  placeholder={t('email')}
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
                <Text style={styles.label}>{t('phoneNumber')}</Text>
                <TextInput
                  placeholder={t('phoneNumber')}
                  style={styles.input}
                  value={formData.phoneNumber}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phoneNumber: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.relative}>
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
                    style={styles.eyeIconButton}
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

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.relative}>
                  <TextInput
                    placeholder="Confirm Password"
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(text) =>
                      setFormData({ ...formData, confirmPassword: text })
                    }
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesome6
                      name={showConfirmPassword ? "eye-slash" : "eye"}
                      size={20}
                      color="#333"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpText}>{t('signUp')}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signInContainer}>
                <Text style={styles.signIn}>
                  {t('alreadyHaveAccount')}{" "}
                  <Text
                    style={styles.signUpLink}
                    onPress={() => {
                      setshouldCreateAccount(false);
                      router.replace("sign-in");
                    }}
                  >
                    {t('signIn')}
                  </Text>
                </Text>
              </View>

              <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>{t('or')}</Text>
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
                <Text style={styles.footer}>{t('agreeToTerms')}</Text>
                <Text style={styles.footerLink}>{t('termsAndConditions')}</Text>
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
  cameraIcon: {
    bottom: 0,
    padding: 0,
    position: "absolute",
    right: 0,
  },
  container: {
    backgroundColor: COLORS.surface,
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
    gap: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 80,
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
  eyeIconButton: {
    position: "absolute",
    right: SPACING.sm,
    top: 12,
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
  image: {
    backgroundColor: COLORS.gray[200],
    borderRadius: 60,
    height: 95,
    width: 95,
  },
  imageContainer: {
    alignItems: "center",
  },
  input: {
    ...commonStyles.input,
    width: "100%",
  },
  inputContainer: {
    marginBottom: SPACING.sm,
    width: "100%",
  },
  label: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.caption,
    fontWeight: "300",
    marginBottom: SPACING.sm,
  },
  line: {
    backgroundColor: COLORS.gray[100],
    flex: 1,
    height: 1,
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
  relative: {
    position: "relative",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  signIn: {
    color: COLORS.text.primary,
    textAlign: "center",
  },
  signInContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  signUpButton: {
    ...commonStyles.button,
    marginBottom: SPACING.lg,
    width: "100%",
  },
  signUpLink: {
    color: COLORS.secondary,
  },
  signUpText: {
    ...commonStyles.buttonText,
  },
  skipButton: {
    position: "absolute",
    right: 25,
    top: 60,
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
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: "center",
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: "center",
  },
});