import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Heart, FacebookLogo, GoogleLogo } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { PhoneAuthStyles } from '../styles/PhoneAuthStyles';

// 1. Import Firebase Authentication methods
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebaseConfig'; // Import the auth instance we created

export default function PhoneAuthScreen() {
  const router = useRouter();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To show a loading spinner when sending SMS

  // 2. Setup the Recaptcha Verifier
  // Firebase uses Recaptcha to prevent bots from spamming SMS codes
  const setupRecaptcha = () => {
    // Only initialize if we haven't already
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible', // Invisible so the user doesn't have to click "I am not a robot"
        'callback': (response) => {
          console.log("Recaptcha verified!");
        }
      });
    }
  };

  // 3. Send the SMS Code
  const handleContinue = async () => {
    if (phoneNumber.length < 6) {
      alert("Please enter a valid phone number!");
      return;
    }

    // Firebase Phone Auth via the free JS SDK requires a Web Browser (DOM) for Recaptcha.
    // It will crash if tested natively on Expo Go (Android/iOS).
    if (Platform.OS !== 'web') {
      alert("Testing Phone Auth requires a Web Browser! Please open your terminal and press 'w' to test this feature on the web PWA.");
      return;
    }

    setIsLoading(true);

    try {
      setupRecaptcha();
      
      // Combine the country code and the phone number (E.164 format required by Firebase)
      const formattedNumber = `+267${phoneNumber}`;
      const appVerifier = window.recaptchaVerifier;

      // Ask Firebase to send the SMS
      const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      
      // Store the result globally so our OTP screen can access it
      window.confirmationResult = confirmationResult;
      
      setIsLoading(false);
      // Success! Move to the next screen to type in the code
      router.push('/otp-verify');
      
    } catch (error: any) {
      console.error("Firebase Phone Auth Error:", error);
      
      if (error.code === 'auth/billing-not-enabled') {
        alert("Firebase requires billing to be enabled (Blaze Plan) to use Phone Auth. Please link a card in the Firebase Console. You still get 10,000 free SMS/month.");
      } else {
        alert("Failed to send SMS: " + (error.message || "Unknown error"));
      }
      
      setIsLoading(false);
      
      // Important: If it fails, clear the recaptcha so they can try again
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch(e) {}
        window.recaptchaVerifier = null;
        
        // Sometimes Firebase leaves DOM nodes behind, clear them manually for web
        if (Platform.OS === 'web') {
          const container = document.getElementById('recaptcha-container');
          if (container) container.innerHTML = '';
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={PhoneAuthStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={PhoneAuthStyles.headerLogoContainer}>
        <Heart weight="fill" size={20} color="#E82B73" style={PhoneAuthStyles.headerLeftHeart} />
        <Text style={PhoneAuthStyles.headerLogoText}>Lynk</Text>
        <Heart weight="fill" size={16} color="#E82B73" style={PhoneAuthStyles.headerRightHeart} />
      </View>

      <Text style={PhoneAuthStyles.titleText}>Let's start with your number</Text>

      <View style={PhoneAuthStyles.inputWrapper}>
        <View style={PhoneAuthStyles.countryCodeBox}>
          <Text style={PhoneAuthStyles.flagText}>🇧🇼</Text>
          <Text style={PhoneAuthStyles.countryCodeText}>+267</Text>
        </View>
        <TextInput
          style={PhoneAuthStyles.textInput}
          placeholder="Enter phone number"
          placeholderTextColor="#999999"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* This hidden View is strictly required by Firebase for the Invisible Recaptcha */}
      <View nativeID="recaptcha-container"></View>

      <TouchableOpacity 
        style={PhoneAuthStyles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.8}
        disabled={isLoading} // Disable button while loading
      >
        {/* Show a loading spinner if we are talking to Firebase, otherwise show "Continue" */}
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={PhoneAuthStyles.continueButtonText}>Continue</Text>
        )}
      </TouchableOpacity>

      <View style={PhoneAuthStyles.dividerContainer}>
        <View style={PhoneAuthStyles.dividerLine} />
        <Text style={PhoneAuthStyles.dividerText}>OR</Text>
        <View style={PhoneAuthStyles.dividerLine} />
      </View>

      <TouchableOpacity style={PhoneAuthStyles.socialButton} activeOpacity={0.8}>
        <FacebookLogo weight="fill" size={24} color="#1877F2" />
        <Text style={PhoneAuthStyles.socialButtonText}>Login with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={PhoneAuthStyles.socialButton} activeOpacity={0.8}>
        <GoogleLogo weight="bold" size={24} color="#DB4437" />
        <Text style={PhoneAuthStyles.socialButtonText}>Login with Google</Text>
      </TouchableOpacity>

      <View style={PhoneAuthStyles.footerContainer}>
        <Text style={PhoneAuthStyles.footerText}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={PhoneAuthStyles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
