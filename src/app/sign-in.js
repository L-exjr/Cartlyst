import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Image, Animated } from 'react-native';
import { router } from "expo-router";
import { useAuthStore } from "../utils/authStore"
import { FontAwesome6 } from "@expo/vector-icons"

export default function SignInScreen() {
  const { logIn, setGuestMode, setshouldCreateAccount, setResettingPassword } = useAuthStore();
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
      })
    ]).start(() => setError(""));
  };

  const validateForm = () => {
    const errors = {};

    // Email Validation
    if (!formData.email) {
      showError("Email/Phone is required");
      return false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && !/^\+?[1-9]\d{1,14}$/.test(formData.email)) {
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
      router.replace('/(tabs)');
    } catch (error) {
      showError(error.message || "An error occurred while signing in");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={async () => { 
              await setGuestMode(); 
              router.replace('/(tabs)'); 
            }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <View style={styles.contentContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.logo}/>
            <Text style={styles.title}>Sign In</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email/Phone</Text>
              <TextInput 
                placeholder="Email/Phone" 
                style={styles.input}
                value={formData.email} 
                onChangeText={text => setFormData({ ...formData, email: text })} 
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
                  onChangeText={text => setFormData({ ...formData, password: text })} 
                  secureTextEntry={!showPassword} 
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome6
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.forgotPasswordTouchable}
              onPress={() => { setResettingPassword(true); router.push('reset-password'); }}
            >
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUp}>
                Don't have an account? <Text style={styles.signUpLink} onPress={() => {setshouldCreateAccount (true); router.replace('sign-up');}}>Sign Up</Text>
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
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: -90,
    marginTop: -110,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  forgotPasswordTouchable: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#999',
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signUpContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  signUp: {
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