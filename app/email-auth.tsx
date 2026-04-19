import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Heart, Envelope, LockKey, Eye, EyeSlash } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { EmailAuthStyles } from '../styles/EmailAuthStyles';

export default function EmailAuthScreen() {
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // Log In Flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (user.emailVerified) {
          router.replace('/profile-setup');
        } else {
          router.push('/verify-email');
        }
      } else {
        // Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Send verification link ONLY during registration
        await sendEmailVerification(user);
        router.push('/verify-email');
      }
    } catch (error: any) {
      console.error(error);
      // Simplify Firebase error messages for the user
      let message = error.message;
      if (error.code === 'auth/invalid-email') message = "Invalid email address format.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') message = "Incorrect email or password.";
      if (error.code === 'auth/email-already-in-use') message = "An account with this email already exists.";
      if (error.code === 'auth/weak-password') message = "Password should be at least 6 characters.";
      
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={EmailAuthStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={EmailAuthStyles.headerLogoContainer}>
        <Heart weight="fill" size={20} color="#E82B73" style={EmailAuthStyles.headerLeftHeart} />
        <Text style={EmailAuthStyles.headerLogoText}>Lynk</Text>
        <Heart weight="fill" size={16} color="#E82B73" style={EmailAuthStyles.headerRightHeart} />
      </View>

      {/* Tab Switcher */}
      <View style={EmailAuthStyles.tabContainer}>
        <TouchableOpacity 
          style={[EmailAuthStyles.tabButton, isLogin && EmailAuthStyles.tabButtonActive]}
          onPress={() => { setIsLogin(true); setErrorMsg(''); }}
        >
          <Text style={[EmailAuthStyles.tabText, isLogin && EmailAuthStyles.tabTextActive]}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[EmailAuthStyles.tabButton, !isLogin && EmailAuthStyles.tabButtonActive]}
          onPress={() => { setIsLogin(false); setErrorMsg(''); }}
        >
          <Text style={[EmailAuthStyles.tabText, !isLogin && EmailAuthStyles.tabTextActive]}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {errorMsg ? <Text style={EmailAuthStyles.errorText}>{errorMsg}</Text> : null}

      {/* Email Input */}
      <View style={EmailAuthStyles.inputWrapper}>
        <Envelope color="#999999" size={20} style={EmailAuthStyles.inputIcon} />
        <TextInput
          style={EmailAuthStyles.textInput}
          placeholder="Email address"
          placeholderTextColor="#999999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={EmailAuthStyles.inputWrapper}>
        <LockKey color="#999999" size={20} style={EmailAuthStyles.inputIcon} />
        <TextInput
          style={EmailAuthStyles.textInput}
          placeholder="Password"
          placeholderTextColor="#999999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity 
          style={EmailAuthStyles.passwordToggle} 
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeSlash color="#999999" size={20} />
          ) : (
            <Eye color="#999999" size={20} />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={EmailAuthStyles.primaryButton}
        onPress={handleAuth}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={EmailAuthStyles.primaryButtonText}>
            {isLogin ? "Log In" : "Sign Up"}
          </Text>
        )}
      </TouchableOpacity>

    </KeyboardAvoidingView>
  );
}
