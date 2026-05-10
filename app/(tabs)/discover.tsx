import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Image, Modal, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatCircle, Heart, ShieldWarning, SlidersHorizontal, Star, X } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { getCurrentProfile, getDiscoveryProfiles, isSupabaseConfigured, recordSwipe } from '../../utils/lynkData';
import { CurrentProfileInput, LynkProfile } from '../../utils/lynkTypes';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width - 32, 396);
const SWIPE_THRESHOLD = width * 0.26;

function ProfileCard({ profile, onLike, onPass }: { profile: LynkProfile; onLike: () => void; onPass: () => void }) {
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-7deg', '0deg', '7deg'],
    extrapolate: 'clamp',
  });

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => position.setValue({ x: gesture.dx, y: gesture.dy }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        Animated.timing(position, { toValue: { x: width * 1.4, y: gesture.dy }, duration: 220, useNativeDriver: true }).start(onLike);
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        Animated.timing(position, { toValue: { x: -width * 1.4, y: gesture.dy }, duration: 220, useNativeDriver: true }).start(onPass);
      } else {
        Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true, friction: 6 }).start();
      }
    },
  }), [onLike, onPass, position]);

  return (
    <Animated.View style={[styles.card, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]} {...panResponder.panHandlers}>
      <Image source={{ uri: profile.photos[0] }} style={styles.photo} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.82)']} style={styles.photoShade} />
      {profile.isPremium && (
        <View style={styles.premiumPill}>
          <Star size={13} color="#FFFFFF" weight="fill" />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.name}>{profile.displayName}, {profile.age}</Text>
        <Text style={styles.school}>{profile.university} - {profile.distanceKm.toFixed(1)} km away</Text>
        <View style={styles.intentRow}>
          <Text style={styles.intentPill}>{profile.intent === 'friends' ? 'Friendship' : 'Dating'}</Text>
          {profile.relationshipGoal ? <Text style={styles.intentPill}>{profile.relationshipGoal}</Text> : null}
        </View>
        <Text style={styles.bio}>{profile.bio}</Text>
        <View style={styles.tagRow}>
          {profile.interests.slice(0, 3).map((interest) => <Text key={interest} style={styles.tag}>{interest}</Text>)}
        </View>
      </View>
    </Animated.View>
  );
}

export default function DiscoverScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<LynkProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<CurrentProfileInput | null>(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<LynkProfile | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [viewer, discoverable] = await Promise.all([getCurrentProfile(), getDiscoveryProfiles()]);
    setCurrentProfile(viewer);
    setProfiles(discoverable);
    setIndex(0);
    setLoading(false);
  }

  async function swipe(action: 'like' | 'pass' | 'super_like') {
    const profile = profiles[index];
    if (!profile) return;
    const newMatch = await recordSwipe(profile, action);
    setIndex((value) => value + 1);
    if (newMatch) setMatch(profile);
  }

  const profile = profiles[index];
  const hasProfile = Boolean(profile);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>{currentProfile?.intent === 'dating' ? 'Partner discovery' : 'Friend discovery'}</Text>
          <Text style={styles.title}>Lynk</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/profile-setup')}>
          <SlidersHorizontal size={22} color="#FF4D6D" weight="bold" />
        </TouchableOpacity>
      </View>

      {!isSupabaseConfigured && (
        <View style={styles.notice}>
          <ShieldWarning size={17} color="#7C3AED" weight="bold" />
          <Text style={styles.noticeText}>Demo data active. Add Supabase env vars to use live tables.</Text>
        </View>
      )}

      <View style={styles.stage}>
        {loading ? (
          <ActivityIndicator color="#FF4D6D" size="large" />
        ) : hasProfile ? (
          <ProfileCard profile={profile!} onLike={() => swipe('like')} onPass={() => swipe('pass')} />
        ) : (
          <View style={styles.empty}>
            <Heart size={68} color="#FF4D6D" weight="thin" />
            <Text style={styles.emptyTitle}>No more profiles nearby</Text>
            <Text style={styles.emptyText}>Try expanding your radius or check back when new students join.</Text>
            <TouchableOpacity style={styles.reloadButton} onPress={load}>
              <Text style={styles.reloadText}>Refresh discovery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {hasProfile && !loading && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.passButton} onPress={() => swipe('pass')}><X size={30} color="#FF4D6D" weight="bold" /></TouchableOpacity>
          <TouchableOpacity style={styles.superButton} onPress={() => swipe('super_like')}><Star size={25} color="#5A67D8" weight="fill" /></TouchableOpacity>
          <TouchableOpacity style={styles.likeButton} onPress={() => swipe('like')}><Heart size={31} color="#0FA968" weight="fill" /></TouchableOpacity>
        </View>
      )}

      <Modal visible={Boolean(match)} transparent animationType="fade">
        <LinearGradient colors={['rgba(255,77,109,0.96)', 'rgba(124,58,237,0.96)']} style={styles.matchOverlay}>
          <View style={styles.matchCard}>
            <Text style={styles.matchTitle}>It is a Lynk</Text>
            <Text style={styles.matchBody}>You and {match?.displayName} both showed interest. Chat is now unlocked.</Text>
            <TouchableOpacity style={styles.matchPrimary} onPress={() => { setMatch(null); router.push('/messages'); }}>
              <ChatCircle size={18} color="#FF4D6D" weight="bold" />
              <Text style={styles.matchPrimaryText}>Open chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.matchSecondary} onPress={() => setMatch(null)}>
              <Text style={styles.matchSecondaryText}>Keep discovering</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF9FF', paddingTop: 54 },
  header: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { color: '#766A87', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  title: { color: '#1A1028', fontSize: 34, fontWeight: '900' },
  iconButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0E9F8' },
  notice: { marginHorizontal: 20, marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: '#F1EBFF', flexDirection: 'row', gap: 8, alignItems: 'center' },
  noticeText: { color: '#4C357A', fontSize: 12, fontWeight: '700', flex: 1 },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  card: { width: CARD_WIDTH, height: 570, borderRadius: 28, overflow: 'hidden', backgroundColor: '#191027' },
  photo: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  photoShade: { ...StyleSheet.absoluteFillObject },
  premiumPill: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 12, height: 32, borderRadius: 16, backgroundColor: 'rgba(124,58,237,0.9)', flexDirection: 'row', alignItems: 'center', gap: 6 },
  premiumText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
  cardBody: { position: 'absolute', left: 20, right: 20, bottom: 24 },
  name: { color: '#FFFFFF', fontSize: 31, fontWeight: '900' },
  school: { color: '#EFE8F7', fontSize: 13, fontWeight: '700', marginTop: 4 },
  intentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  intentPill: { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 14, overflow: 'hidden', fontWeight: '800', fontSize: 12 },
  bio: { color: '#FFFFFF', lineHeight: 21, fontSize: 14, marginTop: 12, fontWeight: '600' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  tag: { color: '#2B133B', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, overflow: 'hidden', fontWeight: '800', fontSize: 12 },
  actions: { height: 112, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 },
  passButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFD3DC' },
  superButton: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#EEF0FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D9DEFF' },
  likeButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#CFEEDD' },
  empty: { alignItems: 'center', paddingHorizontal: 28 },
  emptyTitle: { fontSize: 23, fontWeight: '900', color: '#21182E', marginTop: 14, textAlign: 'center' },
  emptyText: { fontSize: 14, color: '#766A87', lineHeight: 21, textAlign: 'center', marginTop: 8 },
  reloadButton: { marginTop: 20, height: 48, borderRadius: 24, backgroundColor: '#FF4D6D', justifyContent: 'center', paddingHorizontal: 20 },
  reloadText: { color: '#FFFFFF', fontWeight: '900' },
  matchOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  matchCard: { width: '100%', borderRadius: 28, backgroundColor: '#FFFFFF', padding: 24, alignItems: 'center' },
  matchTitle: { fontSize: 30, fontWeight: '900', color: '#1A1028' },
  matchBody: { fontSize: 15, color: '#655B70', textAlign: 'center', lineHeight: 22, marginTop: 10, marginBottom: 20 },
  matchPrimary: { height: 50, borderRadius: 25, paddingHorizontal: 22, backgroundColor: '#FFF1F4', flexDirection: 'row', alignItems: 'center', gap: 8 },
  matchPrimaryText: { color: '#FF4D6D', fontWeight: '900' },
  matchSecondary: { marginTop: 14 },
  matchSecondaryText: { color: '#655B70', fontWeight: '800' },
});
