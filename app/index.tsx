import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'phosphor-react-native';
import { useRouter } from 'expo-router';

// We import our newly separated CSS/Styles here
import { SplashStyles } from '../styles/SplashStyles';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // This timer simulates a loading process.
    // After 3 seconds, we navigate to the login screen.
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    // Cleanup the timer if the component unmounts before 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    // LinearGradient gives us that beautiful pink-to-purple background from your design.
    <LinearGradient
      colors={['#FA517C', '#A528CD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={SplashStyles.container}
    >
      <View style={SplashStyles.logoContainer}>
        {/* Left floating heart */}
        <Heart 
          weight="fill" 
          size={32} 
          color="#FFF" 
          style={SplashStyles.leftHeartIcon} 
        />
        
        {/* Main Logo Text */}
        <Text style={SplashStyles.logoText}>Lynk</Text>
        
        {/* Right floating heart */}
        <Heart 
          weight="fill" 
          size={24} 
          color="#FFF" 
          style={SplashStyles.rightHeartIcon} 
        />
      </View>
      
      {/* Subtitle Text */}
      <Text style={SplashStyles.subtitleText}>Online Dating App</Text>
    </LinearGradient>
  );
}
