import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, ActivityIndicator,
  Animated, PanResponder, Dimensions, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkle, X, Heart, Star, ChatCircle } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import {
  collection, getDocs, doc, setDoc, getDoc, query, where, serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { DiscoverStyles, CARD_WIDTH } from '../../styles/DiscoverStyles';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  interestedIn: string;
  photoUrls: string[];
  university?: string;
}

function calculateAge(dob: string): number {
  // Expects DD/MM/YYYY
  const parts = dob.split('/');
  if (parts.length !== 3) return 0;
  const birthday = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  const ageDiff = Date.now() - birthday.getTime();
  return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
}

// ─── Swipeable Card ───────────────────────────────────────────────────────────
function SwipeCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  isTop,
  cardIndex,
}: {
  profile: UserProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
  cardIndex: number;
}) {
  const position = useRef(new Animated.ValueXY()).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const passOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onMoveShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
        // Fade in LIKE / PASS badges
        if (gestureState.dx > 0) {
          likeOpacity.setValue(Math.min(gestureState.dx / SWIPE_THRESHOLD, 1));
          passOpacity.setValue(0);
        } else {
          passOpacity.setValue(Math.min(-gestureState.dx / SWIPE_THRESHOLD, 1));
          likeOpacity.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swipe right → LIKE
          Animated.timing(position, {
            toValue: { x: width * 1.5, y: gestureState.dy },
            duration: 280,
            useNativeDriver: true,
          }).start(onSwipeRight);
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Swipe left → PASS
          Animated.timing(position, {
            toValue: { x: -width * 1.5, y: gestureState.dy },
            duration: 280,
            useNativeDriver: true,
          }).start(onSwipeLeft);
        } else {
          // Snap back
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 5,
          }).start();
          likeOpacity.setValue(0);
          passOpacity.setValue(0);
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const scale = isTop ? 1 : Math.max(0.93 - cardIndex * 0.03, 0.87);
  const translateY = isTop ? 0 : -cardIndex * 10;

  const cardStyle = isTop
    ? {
        transform: [
          { translateX: position.x },
          { translateY: position.y },
          { rotate },
        ],
      }
    : { transform: [{ scale }, { translateY }] };

  const age = calculateAge(profile.dob);
  const photoUrl = profile.photoUrls?.[0];

  return (
    <Animated.View
      style={[DiscoverStyles.card, cardStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={DiscoverStyles.cardImage} />
      ) : (
        <LinearGradient
          colors={['#FA517C', '#A528CD']}
          style={DiscoverStyles.cardImage}
        />
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={DiscoverStyles.cardGradient}
      />

      {/* LIKE Badge */}
      {isTop && (
        <Animated.View style={[DiscoverStyles.likeBadge, { opacity: likeOpacity }]}>
          <Text style={DiscoverStyles.likeBadgeText}>LIKE</Text>
        </Animated.View>
      )}

      {/* PASS Badge */}
      {isTop && (
        <Animated.View style={[DiscoverStyles.passBadge, { opacity: passOpacity }]}>
          <Text style={DiscoverStyles.passBadgeText}>PASS</Text>
        </Animated.View>
      )}

      <View style={DiscoverStyles.cardInfo}>
        <Text style={DiscoverStyles.cardName}>
          {profile.firstName}{' '}
          <Text style={DiscoverStyles.cardAge}>{age}</Text>
        </Text>
        {profile.university && (
          <Text style={DiscoverStyles.cardUniversity}>🎓 {profile.university}</Text>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Main Discover Screen ─────────────────────────────────────────────────────
export default function DiscoverScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    loadProfiles();
  }, []);

  const seedMockData = async () => {
    setIsLoading(true);
    console.log("[Seed] 🕵️ Checking Identity...");
    console.log("[Seed] Current User UID:", auth.currentUser?.uid || "NOT LOGGED IN");
    console.log("[Seed] Email Verified:", auth.currentUser?.emailVerified ? "YES" : "NO");

    try {
      const { MOCK_IMAGES } = require('../../utils/mockData');
      const mockProfiles = [
        {
          id: 'mock_1',
          firstName: 'Sarah',
          lastName: 'Jenkins',
          dob: '12/05/2004',
          gender: 'Female',
          interestedIn: 'Everyone',
          photoUrls: [MOCK_IMAGES[0]],
          university: 'University of Cape Town',
        },
        {
          id: 'mock_2',
          firstName: 'James',
          lastName: 'Wilson',
          dob: '22/09/2003',
          gender: 'Male',
          interestedIn: 'Everyone',
          photoUrls: [MOCK_IMAGES[1]],
          university: 'Stellenbosch University',
        },
        {
          id: 'mock_3',
          firstName: 'Maya',
          lastName: 'Patel',
          dob: '05/01/2005',
          gender: 'Female',
          interestedIn: 'Men',
          photoUrls: [MOCK_IMAGES[2]],
          university: 'Wits University',
        }
      ];

      for (const profile of mockProfiles) {
        console.log(`[Seed] Creating mock user: ${profile.firstName}...`);
        const { photoUrls, ...metadata } = profile;
        
        // 1. Save metadata to main doc
        await setDoc(doc(db, 'users', profile.id), {
          ...metadata,
          photoUrls: [], 
          createdAt: serverTimestamp(),
          completedOnboarding: true,
        });
        console.log(`[Seed] Metadata for ${profile.firstName} saved.`);

        // 2. Save photos to sub-collection
        if (photoUrls && photoUrls.length > 0) {
          console.log(`[Seed] Saving photos for ${profile.firstName}...`);
          for (let i = 0; i < photoUrls.length; i++) {
            await setDoc(doc(db, 'users', profile.id, 'photos', `photo_${i}`), {
              base64: photoUrls[i],
              index: i,
              uploadedAt: new Date()
            });
          }
          console.log(`[Seed] Photos for ${profile.firstName} saved.`);
        }
      }

      console.log("[Seed] ALL MOCK DATA SAVED SUCCESSFULLY!");
      alert('Mock data seeded! Enjoy swiping! 💫');
      loadProfiles();
    } catch (e) {
      console.error('Failed to seed mock data:', e);
      alert('Failed to seed data. Check console.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfiles = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      // Get the current user's own profile to know their gender preference
      const myDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const myData = myDoc.data();
      const interestedIn: string = myData?.interestedIn ?? 'Everyone';

      // Query all users excluding self
      const snapshot = await getDocs(collection(db, 'users'));
      const allProfiles: UserProfile[] = [];

      for (const d of snapshot.docs) {
        if (d.id === currentUser.uid) continue; // skip self

        const data = d.data() as Omit<UserProfile, 'id'>;

        // Simple gender filter
        if (interestedIn !== 'Everyone') {
          const targetGender = interestedIn === 'Women' ? 'Female' : 'Male';
          if (data.gender !== targetGender) continue;
        }

        // Fetch the first photo from the sub-collection for this user
        try {
          const firstPhotoDoc = await getDoc(doc(db, 'users', d.id, 'photos', 'photo_0'));
          if (firstPhotoDoc.exists()) {
            data.photoUrls = [firstPhotoDoc.data().base64];
          }
        } catch (photoErr) {
          console.warn(`Could not load photo for user ${d.id}`);
        }

        allProfiles.push({ id: d.id, ...data });
      }

      // Shuffle profiles for variety
      allProfiles.sort(() => Math.random() - 0.5);
      setProfiles(allProfiles);
    } catch (e) {
      console.error('Failed to load profiles:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipeRight = async () => {
    const likedProfile = profiles[currentIndex];
    setCurrentIndex((prev) => prev + 1);

    if (!currentUser || !likedProfile) return;

    // Record the like in Firestore
    await setDoc(
      doc(db, 'likes', `${currentUser.uid}_${likedProfile.id}`),
      {
        from: currentUser.uid,
        to: likedProfile.id,
        createdAt: serverTimestamp(),
      }
    );

    // Check if they already liked us back (mutual like = match!)
    const reverseDoc = await getDoc(
      doc(db, 'likes', `${likedProfile.id}_${currentUser.uid}`)
    );

    if (reverseDoc.exists()) {
      // 🎉 It's a match!
      const matchId = [currentUser.uid, likedProfile.id].sort().join('_');
      await setDoc(doc(db, 'matches', matchId), {
        users: [currentUser.uid, likedProfile.id],
        createdAt: serverTimestamp(),
      });
      setMatchedProfile(likedProfile);
      setShowMatchModal(true);
    }
  };

  const handleSwipeLeft = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleActionPass = () => {
    if (currentIndex < profiles.length) {
      handleSwipeLeft();
    }
  };

  const handleActionLike = () => {
    if (currentIndex < profiles.length) {
      handleSwipeRight();
    }
  };

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const hasMore = currentIndex < profiles.length;

  return (
    <View style={DiscoverStyles.container}>
      {/* Header */}
      <View style={DiscoverStyles.header}>
        <Text style={DiscoverStyles.headerTitle}>
          <Text style={DiscoverStyles.headerTitleAccent}>Lyn</Text>k
        </Text>
        <TouchableOpacity style={DiscoverStyles.headerIconBtn}>
          <Sparkle size={22} color="#FF4D6D" weight="fill" />
        </TouchableOpacity>
      </View>

      {/* Card Stack Area */}
      {isLoading ? (
        <View style={DiscoverStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4D6D" />
        </View>
      ) : !hasMore ? (
        <View style={DiscoverStyles.emptyState}>
          <Heart size={72} color="#FF4D6D" weight="thin" style={DiscoverStyles.emptyIcon} />
          <Text style={DiscoverStyles.emptyTitle}>You've seen everyone!</Text>
          <Text style={DiscoverStyles.emptySubtitle}>
            Check back later — new people join Lynk every day. 💫
          </Text>
          
          <TouchableOpacity 
            style={[DiscoverStyles.primaryBtn, { marginTop: 24, paddingHorizontal: 30 }]} 
            onPress={seedMockData}
          >
            <Text style={DiscoverStyles.primaryBtnText}>Seed Mock Data</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={DiscoverStyles.cardStack}>
          {/* Render at most 3 cards in the stack (back to front) */}
          {[currentIndex + 2, currentIndex + 1, currentIndex].map((idx, stackPos) => {
            const p = profiles[idx];
            if (!p) return null;
            const isTopCard = idx === currentIndex;
            return (
              <SwipeCard
                key={p.id}
                profile={p}
                isTop={isTopCard}
                cardIndex={2 - stackPos}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            );
          })}
        </View>
      )}

      {/* Action Buttons */}
      {hasMore && !isLoading && (
        <View style={DiscoverStyles.actionsRow}>
          <TouchableOpacity
            id="btn-pass"
            style={DiscoverStyles.actionBtnPass}
            onPress={handleActionPass}
            activeOpacity={0.8}
          >
            <X size={30} color="#FF4D6D" weight="bold" />
          </TouchableOpacity>

          <TouchableOpacity
            id="btn-superlike"
            style={DiscoverStyles.actionBtnSuperLike}
            activeOpacity={0.8}
          >
            <Star size={24} color="#5A78FF" weight="fill" />
          </TouchableOpacity>

          <TouchableOpacity
            id="btn-like"
            style={DiscoverStyles.actionBtnLike}
            onPress={handleActionLike}
            activeOpacity={0.8}
          >
            <Heart size={30} color="#00C853" weight="fill" />
          </TouchableOpacity>
        </View>
      )}

      {/* 🎉 Match Modal */}
      <Modal transparent visible={showMatchModal} animationType="fade">
        <LinearGradient
          colors={['rgba(250,81,124,0.95)', 'rgba(165,40,205,0.95)']}
          style={DiscoverStyles.matchOverlay}
        >
          <View style={DiscoverStyles.matchCard}>
            <Text style={DiscoverStyles.matchTitle}>It's a Lynk! 🎉</Text>
            <Text style={DiscoverStyles.matchSubtitle}>
              You and {matchedProfile?.firstName} liked each other!
            </Text>

            {/* Avatar previews */}
            <View style={DiscoverStyles.matchAvatarsRow}>
              {currentUser?.photoURL ? (
                <Image
                  source={{ uri: currentUser.photoURL }}
                  style={DiscoverStyles.matchAvatar}
                />
              ) : (
                <LinearGradient
                  colors={['#FA517C', '#A528CD']}
                  style={DiscoverStyles.matchAvatar}
                />
              )}
              <Heart size={32} color="#FFFFFF" weight="fill" style={DiscoverStyles.matchHeart} />
              {matchedProfile?.photoUrls?.[0] ? (
                <Image
                  source={{ uri: matchedProfile.photoUrls[0] }}
                  style={DiscoverStyles.matchAvatar}
                />
              ) : (
                <LinearGradient
                  colors={['#A528CD', '#FA517C']}
                  style={DiscoverStyles.matchAvatar}
                />
              )}
            </View>

            <TouchableOpacity
              style={DiscoverStyles.matchBtn}
              onPress={() => {
                setShowMatchModal(false);
                router.push('/(tabs)/messages');
              }}
              activeOpacity={0.85}
            >
              <Text style={DiscoverStyles.matchBtnText}>
                <ChatCircle size={16} color="#FF4D6D" /> Send a Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={DiscoverStyles.matchBtnSecondary}
              onPress={() => setShowMatchModal(false)}
            >
              <Text style={DiscoverStyles.matchBtnSecondaryText}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
}
