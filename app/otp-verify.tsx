import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { Heart } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { OTPVerifyStyles } from '../styles/OTPVerifyStyles';

export default function OTPVerifyScreen() {
  const router = useRouter();
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const CODE_LENGTH = 6; 
  const inputRef = useRef<TextInput>(null);

  const handleVerify = async () => {
    if (code.length === CODE_LENGTH) {
      setIsLoading(true);

      try {
        // 1. Get the confirmation object we saved in the previous screen
        const confirmationResult = window.confirmationResult;
        
        if (!confirmationResult) {
          alert("Something went wrong. Please go back and request a new code.");
          setIsLoading(false);
          return;
        }

        // 2. Ask Firebase to verify the 6-digit code the user typed
        const result = await confirmationResult.confirm(code);
        
        // 3. If successful, 'result.user' contains the logged-in user!
        console.log("Successfully logged in:", result.user.uid);
        setIsLoading(false);
        
        // Push them to the Profile Setup screen
        router.push('/profile-setup');

      } catch (error) {
        console.error(error);
        alert("Invalid verification code. Please try again.");
        setIsLoading(false);
        setCode(''); // Clear the input so they can type again
      }
    }
  };

  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);

  return (
    <KeyboardAvoidingView 
      style={OTPVerifyStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          
          <View style={OTPVerifyStyles.headerLogoContainer}>
            <Heart weight="fill" size={20} color="#E82B73" style={OTPVerifyStyles.headerLeftHeart} />
            <Text style={OTPVerifyStyles.headerLogoText}>Lynk</Text>
            <Heart weight="fill" size={16} color="#E82B73" style={OTPVerifyStyles.headerRightHeart} />
          </View>

          <Text style={OTPVerifyStyles.titleText}>Verification Code</Text>
          <Text style={OTPVerifyStyles.subtitleText}>
            Please enter code we just sent to your phone.
          </Text>

          <TextInput
            ref={inputRef}
            style={OTPVerifyStyles.hiddenInput}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            value={code}
            onChangeText={setCode}
            autoFocus={true} 
          />
          
          <TouchableOpacity 
            style={OTPVerifyStyles.codeContainer}
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
          >
            {codeDigitsArray.map((_, index) => {
              const emptyInputChar = ' ';
              const digit = code[index] || emptyInputChar;
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

          <View style={OTPVerifyStyles.resendContainer}>
            <Text style={OTPVerifyStyles.resendText}>Did not receive OTP?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={OTPVerifyStyles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[
              OTPVerifyStyles.verifyButton, 
              code.length < CODE_LENGTH || isLoading ? OTPVerifyStyles.verifyButtonDisabled : {}
            ]}
            disabled={code.length < CODE_LENGTH || isLoading}
            onPress={handleVerify}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={OTPVerifyStyles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
