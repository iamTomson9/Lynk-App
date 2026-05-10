import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, PencilSimple, ShieldWarning, SignOut, Trash } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { getCurrentProfile, resetPrototypeData } from '../../utils/lynkData';
import { CurrentProfileInput } from '../../utils/lynkTypes';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<CurrentProfileInput | null>(null);

  useEffect(() => {
    getCurrentProfile().then(setProfile);
  }, []);

  function reset() {
    Alert.alert('Reset prototype', 'This clears local demo profile, swipes, matches, and messages.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await resetPrototypeData();
          router.replace('/login');
        },
      },
    ]);
  }

  const displayName = profile?.displayName ?? 'Demo';
  const intent = profile?.intent === 'dating' ? 'Dating' : 'Friendship';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#FF4D6D', '#7C3AED']} style={styles.hero}>
        <Text style={styles.initial}>{displayName.slice(0, 1).toUpperCase()}</Text>
        <Text style={styles.name}>{profile?.fullName ?? 'Demo User'}, {profile?.age ?? 21}</Text>
        <Text style={styles.meta}>{intent} profile - {profile?.university ?? 'University of Botswana'}</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile health</Text>
        <View style={styles.infoCard}>
          <ShieldWarning size={22} color="#7C3AED" weight="bold" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Safety controls enabled</Text>
            <Text style={styles.infoText}>Reporting, blocking, location rounding, and under-18 dating restrictions are part of the Supabase schema.</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <Crown size={22} color="#FF4D6D" weight="fill" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Premium ready</Text>
            <Text style={styles.infoText}>Super likes, visitor insights, direct messages, and video calls are represented for the prototype.</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.tagRow}>
          {(profile?.interests ?? ['Tech', 'Music', 'Sports']).map((interest) => <Text key={interest} style={styles.tag}>{interest}</Text>)}
        </View>
        <Text style={styles.bio}>{profile?.bio ?? 'Student looking for meaningful campus connections.'}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/profile-setup')}>
          <PencilSimple size={18} color="#FFFFFF" weight="bold" />
          <Text style={styles.primaryText}>Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={reset}>
          <Trash size={18} color="#FF4D6D" weight="bold" />
          <Text style={styles.secondaryText}>Reset demo data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/login')}>
          <SignOut size={18} color="#FF4D6D" weight="bold" />
          <Text style={styles.secondaryText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF9FF' },
  hero: { paddingTop: 68, paddingBottom: 30, paddingHorizontal: 20, alignItems: 'center' },
  initial: { width: 92, height: 92, borderRadius: 46, backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', textAlign: 'center', lineHeight: 92, fontSize: 42, fontWeight: '900', overflow: 'hidden', borderWidth: 2, borderColor: '#FFFFFF' },
  name: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: 16 },
  meta: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 6, opacity: 0.9 },
  section: { paddingHorizontal: 20, paddingTop: 22 },
  sectionTitle: { color: '#1A1028', fontSize: 18, fontWeight: '900', marginBottom: 12 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#F0E9F8', padding: 14, flexDirection: 'row', gap: 12, marginBottom: 12 },
  infoTitle: { color: '#1A1028', fontSize: 15, fontWeight: '900' },
  infoText: { color: '#766A87', fontSize: 13, lineHeight: 19, fontWeight: '600', marginTop: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { color: '#FF4D6D', backgroundColor: '#FFF0F3', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, overflow: 'hidden', fontWeight: '900', fontSize: 12 },
  bio: { color: '#4B4058', fontSize: 15, lineHeight: 22, fontWeight: '600', marginTop: 16 },
  actions: { padding: 20, gap: 12 },
  primaryButton: { height: 52, borderRadius: 26, backgroundColor: '#FF4D6D', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  primaryText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
  secondaryButton: { height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FFD3DC', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  secondaryText: { color: '#FF4D6D', fontWeight: '900', fontSize: 15 },
});
