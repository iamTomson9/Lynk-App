import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Heart } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { OTPVerifyStyles } from '../styles/OTPVerifyStyles';

export default function OTPVerifyScreen() {
  const router = useRouter();
  
  // We use "useState" to remember the 6-digit code the user types
  const [code, setCode] = useState('');
  const CODE_LENGTH = 6; // Firebase uses 6 digits
  
  // A "ref" gives us a way to directly control the invisible text input
  const inputRef = useRef<TextInput>(null);

  const handleVerify = () => {
    // We will connect this to Firebase later to verify the code
    if (code.length === CODE_LENGTH) {
      alert("Code verified! (Mock)");
      // Next, they will go to Profile Setup. Let's redirect to a placeholder for now.
      router.push('/profile-setup');
    }
  };

  // This helper array lets us map over 6 items to draw 6 boxes easily
  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);

  return (
    // KeyboardAvoidingView prevents the keyboard from hiding our buttons
    <KeyboardAvoidingView 
      style={OTPVerifyStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* If the user taps anywhere outside the boxes, we dismiss the keyboard */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          
          {/* 1. Header Logo */}
          <View style={OTPVerifyStyles.headerLogoContainer}>
            <Heart weight="fill" size={20} color="#E82B73" style={OTPVerifyStyles.headerLeftHeart} />
            <Text style={OTPVerifyStyles.headerLogoText}>Lynk</Text>
            <Heart weight="fill" size={16} color="#E82B73" style={OTPVerifyStyles.headerRightHeart} />
          </View>

          {/* 2. Main Title & Subtitle */}
          <Text style={OTPVerifyStyles.titleText}>Verification Code</Text>
          <Text style={OTPVerifyStyles.subtitleText}>
            Please enter code we just sent to <Text style={OTPVerifyStyles.phoneNumberText}>+267 77 111 111</Text>
          </Text>

          {/* 3. The 6-Digit Code Input UI */}
          {/* We hide the actual input and use it behind the scenes! */}
          <TextInput
            ref={inputRef}
            style={OTPVerifyStyles.hiddenInput}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            value={code}
            onChangeText={setCode}
            autoFocus={true} // Automatically open the keyboard when they arrive here
          />
          
          {/* We draw 6 separate boxes. Tapping any box focuses the hidden input */}
          <TouchableOpacity 
            style={OTPVerifyStyles.codeContainer}
            activeOpacity={0.8}
            onPress={() => inputRef.current?.focus()}
          >
            {codeDigitsArray.map((_, index) => {
              const emptyInputChar = ' ';
              const digit = code[index] || emptyInputChar;
              // If the user has typed up to this box, we highlight it
              const isCurrentDigit = index === code.length;
              const isLastDigit = index === CODE_LENGTH - 1;
              const isCodeComplete = code.length === CODE_LENGTH;
              const isFocused = isCurrentDigit || (isLastDigit && isCodeComplete);

              return (
                <View 
                  key={index} 
                  style={[
                    OTPVerifyStyles.digitBox,
                    isFocused ? OTPVerifyStyles.digitBoxActive : {}
                  ]}
                >
                  <Text style={OTPVerifyStyles.digitText}>{digit}</Text>
                </View>
              );
            })}
          </TouchableOpacity>

          {/* 4. Resend Code */}
          <View style={OTPVerifyStyles.resendContainer}>
            <Text style={OTPVerifyStyles.resendText}>Didn't receive OTP?</Text>
            <TouchableOpacity>
              <Text style={OTPVerifyStyles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          </View>

          {/* 5. Verify Button */}
          <TouchableOpacity 
            style={[
              OTPVerifyStyles.verifyButton, 
              code.length < CODE_LENGTH ? OTPVerifyStyles.verifyButtonDisabled : {}
            ]}
            disabled={code.length < CODE_LENGTH}
            onPress={handleVerify}
            activeOpacity={0.8}
          >
            <Text style={OTPVerifyStyles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
