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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../utils/authStore";

const COLORS = {
  white: "#fff",
  gold: "#d4af37",
  gray: "#666",
  gray2: "#333",
  gray3: "#f0f0f0",
  gray4: "#e0e0e0",
  black: "#000000",
  blue: "#007BFF",
};

export default function VerificationScreen() {
  const router = useRouter();
  const { type = "email" } = useLocalSearchParams();
  const { clearVerification, logIn, signUpData } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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
      // Here you would typically verify the OTP with your backend
      const otpCode = otp.join("");
      console.log("Verifying OTP:", otpCode);

      // Simulate API call
      // await verifyOTP(otpCode, type, signUpData);

      // If verification is successful
      if (type === "email") {
        // If email verification is successful, proceed to phone verification
        router.setParams({ type: "phone" });
      } else {
        // If phone verification is successful, complete sign-up
        logIn();
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      // Handle verification error
      alert(error.message || "Verification failed. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      // Implement resend logic here
      console.log("Resending code to", type);
      // Simulate API call
      // await resendVerificationCode(type, signUpData);
      alert("Verification code has been resent successfully!");
    } catch (error) {
      console.error("Resend failed:", error);
      alert(
        error.message ||
          "Failed to resend verification code. Please try again.",
      );
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
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
          >
            <Text style={styles.confirmText}>Confirm</Text>
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
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: "center",
    backgroundColor: COLORS.gray3,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    top: 20,
    width: 40,
    zIndex: 1,
  },
  closeButtonText: {
    color: COLORS.black,
    fontSize: 20,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
  },
  confirmText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  hyphen: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 4,
  },
  infoText: {
    color: COLORS.gray2,
    marginBottom: 16,
  },
  line: {
    backgroundColor: COLORS.black,
    flex: 1,
    height: 1.5,
  },
  linkText: {
    color: COLORS.blue,
    fontWeight: "bold",
  },
  orContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 16,
    width: "100%",
  },
  orText: {
    color: COLORS.black,
    marginHorizontal: 10,
  },
  otpContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
    width: "100%",
  },
  otpInput: {
    backgroundColor: COLORS.gray4,
    borderRadius: 10,
    fontSize: 20,
    height: 50,
    marginHorizontal: 4,
    textAlign: "center",
    width: 45,
  },
  scrollContent: {
    flexGrow: 1,
  },
  subtitle: {
    color: COLORS.gray2,
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 32,
    textAlign: "center",
  },
  switchText: {
    color: COLORS.gray2,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
