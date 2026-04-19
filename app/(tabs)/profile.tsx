import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PencilSimple, SignOut, GraduationCap, Gender, Heart } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { ProfileTabStyles } from '../../styles/ProfileTabStyles';

interface UserProfile {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  interestedIn: string;
  photoUrls: string[];
  university?: string;
}

function calculateAge(dob: string): number {
  const parts = dob.split('/');
  if (parts.length !== 3) return 0;
  const birthday = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  const ageDiff = Date.now() - birthday.getTime();
  return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
}

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (profileDoc.exists()) {
        const data = profileDoc.data() as UserProfile;
        
        // If photos aren't in the main doc, try to fetch from sub-collection
        if (!data.photoUrls || data.photoUrls.length === 0) {
          const photosSnap = await getDocs(collection(db, 'users', currentUser.uid, 'photos'));
          const fetchedPhotos = photosSnap.docs
            .map(d => d.data())
            .sort((a, b) => a.index - b.index)
            .map(d => d.base64);
          data.photoUrls = fetchedPhotos;
        }
        
        setProfile(data);
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut(auth);
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={ProfileTabStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4D6D" />
      </View>
    );
  }

  const age = profile?.dob ? calculateAge(profile.dob) : null;
  const coverPhoto = profile?.photoUrls?.[0];
  const avatarPhoto = profile?.photoUrls?.[0];

  return (
    <ScrollView style={ProfileTabStyles.container} showsVerticalScrollIndicator={false}>
      {/* Cover Photo / Hero */}
      <View style={ProfileTabStyles.coverArea}>
        {coverPhoto ? (
          <Image source={{ uri: coverPhoto }} style={ProfileTabStyles.coverImage} />
        ) : (
          <LinearGradient
            colors={['#FA517C', '#A528CD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={ProfileTabStyles.coverImage}
          />
        )}

        {/* Dark gradient overlay at bottom of cover */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={ProfileTabStyles.coverGradient}
        />

        {/* Avatar overlapping the cover */}
        <View style={ProfileTabStyles.avatarOverlay}>
          {avatarPhoto ? (
            <Image source={{ uri: avatarPhoto }} style={ProfileTabStyles.avatar} />
          ) : (
            <LinearGradient
              colors={['#FA517C', '#A528CD']}
              style={ProfileTabStyles.avatar}
            />
          )}
          <View style={ProfileTabStyles.editAvatarBadge}>
            <PencilSimple size={14} color="#FFFFFF" weight="bold" />
          </View>
        </View>
      </View>

      {/* Profile Info */}
      <View style={ProfileTabStyles.infoSection}>
        <Text style={ProfileTabStyles.nameText}>
          {profile?.firstName ?? 'Your'} {profile?.lastName ?? 'Name'}
          {age ? `,  ${age}` : ''}
        </Text>
        <Text style={ProfileTabStyles.ageGenderText}>
          {currentUser?.email ?? ''}
        </Text>

        <View style={ProfileTabStyles.tagRow}>
          {profile?.gender && (
            <View style={ProfileTabStyles.tag}>
              <Text style={ProfileTabStyles.tagText}>
                {profile.gender === 'Male' ? '♂' : '♀'} {profile.gender}
              </Text>
            </View>
          )}
          {profile?.interestedIn && (
            <View style={ProfileTabStyles.tag}>
              <Text style={ProfileTabStyles.tagText}>
                ❤️ Interested in {profile.interestedIn}
              </Text>
            </View>
          )}
          {profile?.university && (
            <View style={ProfileTabStyles.tag}>
              <Text style={ProfileTabStyles.tagText}>
                🎓 {profile.university}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={ProfileTabStyles.actionsSection}>
        <TouchableOpacity
          id="btn-edit-profile"
          style={ProfileTabStyles.primaryBtn}
          onPress={() => router.push('/profile-setup')}
          activeOpacity={0.85}
        >
          <PencilSimple size={18} color="#FFFFFF" weight="bold" />
          <Text style={ProfileTabStyles.primaryBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          id="btn-sign-out"
          style={ProfileTabStyles.dangerBtn}
          onPress={handleSignOut}
          activeOpacity={0.85}
        >
          <SignOut size={18} color="#FF4D6D" weight="bold" />
          <Text style={ProfileTabStyles.dangerBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
