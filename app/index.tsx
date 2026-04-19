import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'phosphor-react-native';
import { useRouter } from 'expo-router';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// We import our newly separated CSS/Styles here
import { SplashStyles } from '../styles/SplashStyles';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Listen for Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Show splash for at least 2.5 seconds
      await new Promise(resolve => setTimeout(resolve, 2500));

      if (user) {
        // Email unverified → send to verification screen
        if (user.email && !user.emailVerified) {
          router.replace('/verify-email');
          return;
        }

        // Check if this user has already completed their profile in Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists() && profileDoc.data()?.firstName) {
            // Profile is complete → go to the main app
            router.replace('/discover');
          } else {
            // Profile incomplete → go to setup wizard
            router.replace('/profile-setup');
          }
        } catch (e) {
          // Fallback: if Firestore is unreachable, send to profile-setup
          router.replace('/profile-setup');
        }
      } else {
        // Not logged in
        router.replace('/login');
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
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
