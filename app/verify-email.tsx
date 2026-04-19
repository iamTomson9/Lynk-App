import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Heart, EnvelopeOpen } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { VerifyEmailStyles } from '../styles/VerifyEmailStyles';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // We can safely assume auth.currentUser exists if they got here
  const user = auth.currentUser;

  const handleCheckVerification = async () => {
    if (!user) {
      router.replace('/login');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // We must reload the user to get the latest emailVerified status from Firebase
      await user.reload();
      
      if (auth.currentUser?.emailVerified) {
        // Success!
        router.replace('/profile-setup');
      } else {
        setErrorMsg('Email not verified yet. Please check your inbox and click the link.');
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to check verification status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user) return;
    
    setIsResending(true);
    setErrorMsg('');

    try {
      await sendEmailVerification(user);
      alert('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to resend email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={VerifyEmailStyles.container}>
      <View style={VerifyEmailStyles.headerLogoContainer}>
        <Heart weight="fill" size={20} color="#E82B73" style={VerifyEmailStyles.headerLeftHeart} />
        <Text style={VerifyEmailStyles.headerLogoText}>Lynk</Text>
        <Heart weight="fill" size={16} color="#E82B73" style={VerifyEmailStyles.headerRightHeart} />
      </View>

      <View style={VerifyEmailStyles.iconContainer}>
        <EnvelopeOpen size={48} color="#FF4D6D" weight="duotone" />
      </View>

      <Text style={VerifyEmailStyles.titleText}>Verify your email</Text>
      
      <Text style={VerifyEmailStyles.subtitleText}>
        We've sent a verification link to{'\n'}
        <Text style={VerifyEmailStyles.emailText}>{user?.email || 'your email'}</Text>.{'\n'}
        Please click the link to continue.
      </Text>

      {errorMsg ? <Text style={VerifyEmailStyles.errorText}>{errorMsg}</Text> : null}

      <TouchableOpacity 
        style={VerifyEmailStyles.verifyButton}
        onPress={handleCheckVerification}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={VerifyEmailStyles.verifyButtonText}>I've verified my email</Text>
        )}
      </TouchableOpacity>

      <View style={VerifyEmailStyles.resendContainer}>
        <Text style={VerifyEmailStyles.resendText}>Didn't receive the email?</Text>
        <TouchableOpacity onPress={handleResendEmail} disabled={isResending}>
          <Text style={VerifyEmailStyles.resendLink}>
            {isResending ? 'Sending...' : 'Resend'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
