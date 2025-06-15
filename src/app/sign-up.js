import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Image, Animated } from 'react-native';
import { router } from "expo-router";
import { useAuthStore } from "../utils/authStore"
import { FontAwesome6 } from "@expo/vector-icons"

export default function SignUpScreen() {
  const { setVerification, setGuestMode, setshouldCreateAccount } = useAuthStore();
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
      })
    ]).start(() => setError(""));
  };

  const validateForm = () => {
    // Full Name Validation
    if (!formData.fullName.trim()) {
      showError("Full name is required");
      return false;
    } else if (formData.fullName.length < 3) {
      showError("Full name must be at least 3 characters");
      return false;
    }

    // Email Validation
    if (!formData.email.trim()) {
      showError("Email is required");
      return false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      showError("Please enter a valid email");
      return false;
    }

    // Phone Number Validation
    if (!formData.phoneNumber.trim()) {
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
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    // Start with email verification
    setVerification('email', formData);
    router.push('/verification');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.skipButton} onPress={() => { setGuestMode(); router.replace('/(tabs)'); }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Sign Up</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                placeholder="Full Name" 
                style={styles.input}
                value={formData.fullName} 
                onChangeText={text => setFormData({ ...formData, fullName: text })} 
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                placeholder="Email" 
                style={styles.input}
                value={formData.email} 
                onChangeText={text => setFormData({ ...formData, email: text })} 
                keyboardType="email-address" 
                autoCapitalize="none" 
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                placeholder="Phone Number" 
                style={styles.input}
                value={formData.phoneNumber} 
                onChangeText={text => setFormData({ ...formData, phoneNumber: text })} 
                keyboardType="phone-pad" 
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={{ position: 'relative' }}>
                <TextInput 
                  placeholder="Password" 
                  style={styles.input}
                  value={formData.password} 
                  onChangeText={text => setFormData({ ...formData, password: text })} 
                  secureTextEntry={!showPassword} 
                />
                <TouchableOpacity 
                  style={{ position: 'absolute', right: 10, top: 12 }} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome6 name={showPassword ? "eye-slash" : "eye"} size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={{ position: 'relative' }}>
                <TextInput 
                  placeholder="Confirm Password" 
                  style={styles.input}
                  value={formData.confirmPassword} 
                  onChangeText={text => setFormData({ ...formData, confirmPassword: text })} 
                  secureTextEntry={!showConfirmPassword} 
                />
                <TouchableOpacity 
                  style={{ position: 'absolute', right: 10, top: 12 }} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesome6 name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text style={styles.signIn}>Already have an account? <Text style={styles.signUpLink} onPress={() => {setshouldCreateAccount(false); router.replace('sign-in');}}>Sign In</Text>
              </Text>
            </View>

            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>
            
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../assets/Google.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome6 name="apple" size={40} color="#000000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.footerContainer}>
              <Text style={styles.footer}>By continuing you agree to SwiftMart's</Text>
              <Text style={styles.footerLink}>Terms and Conditions</Text>
            </View>
          </View>

          {error && (
            <Animated.View 
              style={[
                styles.errorContainer,
                {
                  opacity: errorAnimation,
                  transform: [{
                    translateY: errorAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0]
                    })
                  }]
                }
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
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: 'center',
    gap: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 25,
    zIndex: 1,
  },
  skipText: {
    color: 'gray',
    fontSize: 20,
    fontWeight: '500',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '300',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signInContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  signIn: {
    color: '#333',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#2196f3',
  },
  orContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 50,
    marginBottom: 10,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  socialIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  footerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footer: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerLink: {
    color: '#d4af37',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
});