import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../utils/authStore";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../utils/config";

export default function VerificationScreen() {
  const router = useRouter();
  const { type = "email" } = useLocalSearchParams();
  const { clearVerification, logIn, signUpData, userId } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const otpCode = otp.join("");
      const contact = type === "email" ? signUpData.email : signUpData.phoneNumber;
      // Call backend API to verify OTP
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneOrEmail: contact,
          otp: otpCode,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (type === "email") {
          // If email verification is successful, proceed to phone verification
          router.setParams({ type: "phone" });
        } else {
          // If phone verification is successful, complete sign-up
          logIn(signUpData.id || userId); // Use id from signUpData or authStore
          router.replace("/(tabs)");
        }
      } else {
        alert(data.error || data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      alert(error.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const contact = type === "email" ? signUpData.email : signUpData.phoneNumber;
      const response = await fetch(`${API_BASE_URL}/api/auth/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneOrEmail: contact,
          method: type === "phone" ? "sms" : "email",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Verification code has been resent successfully!");
      } else {
        alert(data.error || data.message || "Failed to resend verification code. Please try again.");
      }
    } catch (error) {
      alert(error.message || "Failed to resend verification code. Please try again.");
    }
  };

  const handleSwitchMethod = () => {
    // Switch between email and phone verification
    const newType = type === "email" ? "phone" : "email";
    router.setParams({ type: newType });
  };

  const handleClose = () => {
    clearVerification();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.title}>OTP</Text>
            <Text style={styles.subtitle}>
              We&apos;ve sent a verification code to your {type}
              {"\n"}
              Enter it below to complete your verification
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <React.Fragment key={index}>
                  <TextInput
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (
                        nativeEvent.key === "Backspace" &&
                        !digit &&
                        index > 0
                      ) {
                        inputRefs.current[index - 1].focus();
                      }
                    }}
                  />
                  {index === 2 && <Text style={styles.hyphen}>-</Text>}
                </React.Fragment>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>Confirm</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.infoText}>
              Didn&apos;t receive any code?{" "}
              <Text style={styles.linkText} onPress={handleResend}>
                Send again
              </Text>
            </Text>

            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            <Text style={styles.switchText}>
              Send to{" "}
              <Text style={styles.linkText} onPress={handleSwitchMethod}>
                {type === "email" ? "Phone Number" : "Email"}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: "center",
    backgroundColor: COLORS.gray[200],
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: SPACING.lg,
    top: SPACING.lg,
    width: 40,
    zIndex: 1,
  },
  closeButtonText: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.h3,
  },
  confirmButton: {
    ...commonStyles.button,
    marginBottom: SPACING.md,
    width: "100%",
  },
  confirmText: {
    ...commonStyles.buttonText,
  },
  container: {
    backgroundColor: COLORS.surface,
    flex: 1,
  },
  content: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  hyphen: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.h2,
    fontWeight: "bold",
    marginHorizontal: SPACING.xs,
  },
  infoText: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    textAlign: "center",
  },
  line: {
    backgroundColor: COLORS.gray[200],
    flex: 1,
    height: 1,
  },
  linkText: {
    color: COLORS.secondary,
    fontWeight: "bold",
  },
  orContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: SPACING.lg,
    width: "100%",
  },
  orText: {
    color: COLORS.text.secondary,
    marginHorizontal: SPACING.sm,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: SPACING.xl,
  },
  otpInput: {
    backgroundColor: COLORS.gray[100],
    borderColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    ...TYPOGRAPHY.h2,
    fontWeight: "bold",
    height: 60,
    marginHorizontal: SPACING.xs,
    textAlign: "center",
    width: 50,
  },
  scrollContent: {
    flexGrow: 1,
  },
  subtitle: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  switchText: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    textAlign: "center",
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.sm,
  },
});
