import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { CaretLeft, UsersThree, ChatCircle } from 'phosphor-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase';
import { LynkClub } from '../../utils/lynkTypes';
import { auth } from '../../firebaseConfig';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [club, setClub] = useState<LynkClub | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    async function loadGroup() {
      if (!id || typeof id !== 'string') return;
      
      const { data, error } = await supabase.from('clubs').select('*').eq('id', id).single();
      
      if (!error && data) {
        setClub({
          id: data.id,
          name: data.name,
          category: data.category,
          description: data.description,
          memberCount: data.member_count
        });
      }

      // Check if user is a member
      if (auth.currentUser) {
        const { data: memberData } = await supabase
          .from('club_members')
          .select('*')
          .eq('club_id', id)
          .eq('user_id', auth.currentUser.uid)
          .single();

        if (memberData) {
          setIsMember(true);
        }
      }

      setLoading(false);
    }
    
    loadGroup();
  }, [id]);

  async function handleJoin() {
    if (!auth.currentUser || !club) return;
    setLoading(true);
    
    const { error } = await supabase.from('club_members').insert({
      club_id: club.id,
      user_id: auth.currentUser.uid,
    });

    if (!error) {
      setIsMember(true);
      // optionally increment member_count in clubs table
    } else {
      alert("Error joining group: " + error.message);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF4D6D" />
      </View>
    );
  }

  if (!club) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <CaretLeft color="#1A1028" size={24} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Info</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.clubIcon}>
          <UsersThree size={48} color="#FF4D6D" weight="bold" />
        </View>
        <Text style={styles.category}>{club.category}</Text>
        <Text style={styles.title}>{club.name}</Text>
        <Text style={styles.members}>{club.memberCount} Members</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{club.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isMember ? (
          <TouchableOpacity 
            style={styles.chatButton} 
            onPress={() => router.push(`/clubs/chat?id=${club.id}`)}
          >
            <ChatCircle size={24} color="#FFF" weight="fill" />
            <Text style={styles.buttonText}>Open Group Chat</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
            <UsersThree size={24} color="#FFF" weight="fill" />
            <Text style={styles.buttonText}>Join Group</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF9FF', paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0E9F8' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1028' },
  content: { padding: 24, alignItems: 'center' },
  clubIcon: { width: 100, height: 100, borderRadius: 30, backgroundColor: '#FFF0F3', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  category: { color: '#7C3AED', fontWeight: '900', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '900', color: '#1A1028', textAlign: 'center', marginBottom: 6 },
  members: { color: '#766A87', fontSize: 14, fontWeight: '700', marginBottom: 30 },
  section: { width: '100%', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#F0E9F8' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1028', marginBottom: 8 },
  description: { fontSize: 15, color: '#5F536D', lineHeight: 22 },
  footer: { paddingHorizontal: 20, paddingBottom: 40 },
  joinButton: { backgroundColor: '#FF4D6D', height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, boxShadow: '0px 4px 10px rgba(255, 77, 109, 0.3)', elevation: 5 },
  chatButton: { backgroundColor: '#7C3AED', height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, boxShadow: '0px 4px 10px rgba(124, 58, 237, 0.3)', elevation: 5 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
