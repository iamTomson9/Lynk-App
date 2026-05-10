import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Heart, Phone, Envelope, Sparkle } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginStyles } from '../styles/LoginStyles';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={LoginStyles.container}>
      {/* 1. Header Logo */}
      <View style={LoginStyles.headerLogoContainer}>
        <Heart weight="fill" size={20} color="#E82B73" style={LoginStyles.headerLeftHeart} />
        <Text style={LoginStyles.headerLogoText}>Lynk</Text>
        <Heart weight="fill" size={16} color="#E82B73" style={LoginStyles.headerRightHeart} />
      </View>

      {/* 2. Illustration (Avatars) */}
      <View style={LoginStyles.illustrationContainer}>
        {/* We use real-looking portrait images to match your mockup */}
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }} 
          style={[LoginStyles.avatarCircle, LoginStyles.avatarTopLeft]} 
        />
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=32' }} 
          style={[LoginStyles.avatarCircle, LoginStyles.avatarBottomLeft]} 
        />
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
          style={[LoginStyles.avatarCircle, LoginStyles.avatarRight]} 
        />
      </View>

      {/* 3. Text Content */}
      <View style={LoginStyles.textContainer}>
        <Text style={LoginStyles.titleText}>Discover Love Where Your Story Begins.</Text>
        <Text style={LoginStyles.subtitleText}>
          Join us to discover your ideal partner and ignite the sparks of romance in your journey.
        </Text>
      </View>

      {/* 4. Login Buttons */}
      <TouchableOpacity 
        style={LoginStyles.primaryButton}
        onPress={() => router.push('/email-auth')}
        activeOpacity={0.8}
      >
        <Envelope weight="fill" size={24} color="#FFFFFF" />
        <Text style={LoginStyles.primaryButtonText}>Continue with Email</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={LoginStyles.secondaryButton}
        onPress={() => router.push('/phone-auth')}
        activeOpacity={0.8}
      >
        <Phone weight="fill" size={24} color="#FF4D6D" />
        <Text style={LoginStyles.secondaryButtonText}>Continue with Phone</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={LoginStyles.demoButton}
        onPress={async () => {
          await AsyncStorage.setItem('lynk.isInvestorMode', 'true');
          router.replace('/discover');
        }}
        activeOpacity={0.8}
      >
        <Sparkle weight="fill" size={22} color="#7C3AED" />
        <Text style={LoginStyles.demoButtonText}>Investor Demo Mode</Text>
      </TouchableOpacity>

      {/* 5. Footer */}
      <View style={LoginStyles.footerContainer}>
        <Text style={LoginStyles.footerText}>Do not have an account?</Text>
        <TouchableOpacity>
          <Text style={LoginStyles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
