import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Heart, FacebookLogo, GoogleLogo } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { PhoneAuthStyles } from '../styles/PhoneAuthStyles';

export default function PhoneAuthScreen() {
  const router = useRouter();
  
  // We use "useState" to remember the phone number the user is typing
  const [phoneNumber, setPhoneNumber] = useState('');

  // This function runs when they press Continue
  const handleContinue = () => {
    // In the future, this is where we will trigger Firebase to send the SMS
    // For now, let's just push them to the OTP Verification screen
    if (phoneNumber.length > 5) {
      router.push('/otp-verify');
    } else {
      alert("Please enter a valid phone number!");
    }
  };

  return (
    // KeyboardAvoidingView prevents the keyboard from covering our input fields!
    <KeyboardAvoidingView 
      style={PhoneAuthStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 1. Header Logo */}
      <View style={PhoneAuthStyles.headerLogoContainer}>
        <Heart weight="fill" size={20} color="#E82B73" style={PhoneAuthStyles.headerLeftHeart} />
        <Text style={PhoneAuthStyles.headerLogoText}>Lynk</Text>
        <Heart weight="fill" size={16} color="#E82B73" style={PhoneAuthStyles.headerRightHeart} />
      </View>

      {/* 2. Main Title */}
      <Text style={PhoneAuthStyles.titleText}>Let's start with your number</Text>

      {/* 3. Phone Input Field */}
      <View style={PhoneAuthStyles.inputWrapper}>
        <View style={PhoneAuthStyles.countryCodeBox}>
          {/* Using a Botswana flag as requested in your mockup */}
          <Text style={PhoneAuthStyles.flagText}>🇧🇼</Text>
          <Text style={PhoneAuthStyles.countryCodeText}>+267</Text>
        </View>
        <TextInput
          style={PhoneAuthStyles.textInput}
          placeholder="Enter phone number"
          placeholderTextColor="#999999"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber} // Updates the phone number as they type
        />
      </View>

      {/* 4. Continue Button */}
      <TouchableOpacity 
        style={PhoneAuthStyles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.8}
      >
        <Text style={PhoneAuthStyles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* 5. OR Divider */}
      <View style={PhoneAuthStyles.dividerContainer}>
        <View style={PhoneAuthStyles.dividerLine} />
        <Text style={PhoneAuthStyles.dividerText}>OR</Text>
        <View style={PhoneAuthStyles.dividerLine} />
      </View>

      {/* 6. Social Buttons */}
      <TouchableOpacity style={PhoneAuthStyles.socialButton} activeOpacity={0.8}>
        <FacebookLogo weight="fill" size={24} color="#1877F2" />
        <Text style={PhoneAuthStyles.socialButtonText}>Login with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={PhoneAuthStyles.socialButton} activeOpacity={0.8}>
        <GoogleLogo weight="bold" size={24} color="#DB4437" />
        <Text style={PhoneAuthStyles.socialButtonText}>Login with Google</Text>
      </TouchableOpacity>

      {/* 7. Footer */}
      <View style={PhoneAuthStyles.footerContainer}>
        <Text style={PhoneAuthStyles.footerText}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={PhoneAuthStyles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
