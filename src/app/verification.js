import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../utils/authStore';

export default function VerificationScreen() {
  const router = useRouter();
  const { type = 'email' } = useLocalSearchParams();
  const { clearVerification, logIn, signUpData } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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
      const otpCode = otp.join('');
      console.log('Verifying OTP:', otpCode);
      
      // Simulate API call
      // await verifyOTP(otpCode, type, signUpData);
      
      // If verification is successful
      if (type === 'email') {
        // If email verification is successful, proceed to phone verification
        router.setParams({ type: 'phone' });
      } else {
        // If phone verification is successful, complete sign-up
        logIn();
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      // Handle verification error
      alert(error.message || "Verification failed. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      // Implement resend logic here
      console.log('Resending code to', type);
      // Simulate API call
      // await resendVerificationCode(type, signUpData);
      alert("Verification code has been resent successfully!");
    } catch (error) {
      console.error('Resend failed:', error);
      alert(error.message || "Failed to resend verification code. Please try again.");
    }
  };

  const handleSwitchMethod = () => {
    // Switch between email and phone verification
    const newType = type === 'email' ? 'phone' : 'email';
    router.setParams({ type: newType });
  };

  const handleClose = () => {
    clearVerification();
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a verification code to your {type}{'\n'}
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
                    if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
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
            Didn't receive any code?{' '}
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
            Send to{' '}
            <Text style={styles.linkText} onPress={handleSwitchMethod}>
              {type === 'email' ? 'Phone Number' : 'Email'}
            </Text>
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    color: '#333',
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  otpInput: {
    width: 45,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 4,
  },
  hyphen: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#d4af37',
    borderRadius: 8,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoText: {
    color: '#333',
    marginBottom: 16,
  },
  orContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#000000',
  },
  orText: {
    marginHorizontal: 10,
    color: '#000000',
  },
  switchText: {
    color: '#333',
    marginBottom: 32,
  },
  linkText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
}); 