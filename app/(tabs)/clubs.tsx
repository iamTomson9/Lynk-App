import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalendarDots, CheckCircle, UsersThree, Plus, ChatCircle } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { getClubs, rsvpToEvent } from '../../utils/lynkData';
import { LynkClub } from '../../utils/lynkTypes';
import { supabase } from '../../utils/supabase';
import { auth } from '../../firebaseConfig';

export default function ClubsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'discover' | 'joined'>('discover');
  const [clubs, setClubs] = useState<LynkClub[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<LynkClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    if (activeTab === 'discover') {
      const items = await getClubs();
      setClubs(items);
    } else {
      if (auth.currentUser) {
        const { data } = await supabase
          .from('club_members')
          .select('club_id, clubs(*)')
          .eq('user_id', auth.currentUser.uid);
          
        if (data) {
          const myClubs = data.map((d: any) => ({
            id: d.clubs.id,
            name: d.clubs.name,
            category: d.clubs.category,
            description: d.clubs.description,
            memberCount: d.clubs.member_count,
          }));
          setJoinedClubs(myClubs);
        }
      }
    }
    setLoading(false);
  }

  async function join(eventId?: string) {
    if (!eventId) return;
    await rsvpToEvent(eventId);
    setJoined((current) => ({ ...current, [eventId]: true }));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.kicker}>Campus catalogue</Text>
            <Text style={styles.title}>Clubs & Groups</Text>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={() => router.push('/clubs/create')}>
            <Plus size={20} color="#FFFFFF" weight="bold" />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'discover' && styles.tabButtonActive]}
            onPress={() => setActiveTab('discover')}
          >
            <Text style={[styles.tabText, activeTab === 'discover' && styles.tabTextActive]}>Discover</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'joined' && styles.tabButtonActive]}
            onPress={() => setActiveTab('joined')}
          >
            <Text style={[styles.tabText, activeTab === 'joined' && styles.tabTextActive]}>My Groups</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#FF4D6D" size="large" style={{ marginTop: 80 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {activeTab === 'discover' ? (
            clubs.map((club) => (
              <TouchableOpacity 
                key={club.id} 
                style={styles.clubCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/clubs/${club.id}`)}
              >
                <View style={styles.clubTop}>
                  <View style={styles.clubIcon}><UsersThree size={23} color="#FF4D6D" weight="bold" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.category}>{club.category}</Text>
                    <Text style={styles.clubName}>{club.name}</Text>
                  </View>
                  <Text style={styles.members}>{club.memberCount}</Text>
                </View>
                <Text style={styles.description}>{club.description}</Text>
                {club.nextEvent && (
                  <View style={styles.eventBox}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.eventTitleRow}>
                        <CalendarDots size={16} color="#7C3AED" weight="bold" />
                        <Text style={styles.eventTitle}>{club.nextEvent.title}</Text>
                      </View>
                      <Text style={styles.eventMeta}>{club.nextEvent.startsAt} - {club.nextEvent.location}</Text>
                    </View>
                    <TouchableOpacity style={[styles.rsvpButton, joined[club.nextEvent.id] && styles.rsvpButtonDone]} onPress={() => join(club.nextEvent?.id)}>
                      {joined[club.nextEvent.id] ? <CheckCircle size={18} color="#FFFFFF" weight="fill" /> : null}
                      <Text style={styles.rsvpText}>{joined[club.nextEvent.id] ? 'Joined' : 'RSVP'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            joinedClubs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>You haven't joined any groups yet.</Text>
              </View>
            ) : (
              joinedClubs.map((club) => (
                <TouchableOpacity 
                  key={club.id} 
                  style={styles.clubCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/clubs/${club.id}`)}
                >
                  <View style={styles.clubTop}>
                    <View style={styles.clubIcon}><UsersThree size={23} color="#FF4D6D" weight="bold" /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.category}>{club.category}</Text>
                      <Text style={styles.clubName}>{club.name}</Text>
                    </View>
                    <Text style={styles.members}>{club.memberCount}</Text>
                  </View>
                  <View style={{ marginTop: 16 }}>
                    <TouchableOpacity 
                      style={styles.openChatButton} 
                      onPress={() => router.push(`/clubs/chat?id=${club.id}`)}
                    >
                      <ChatCircle size={20} color="#FFFFFF" weight="fill" />
                      <Text style={styles.openChatText}>Group Chat</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF9FF', paddingTop: 54 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  createButton: { backgroundColor: '#FF4D6D', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 4 },
  createButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  kicker: { color: '#766A87', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  title: { color: '#1A1028', fontSize: 32, fontWeight: '900' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F0E9F8', borderRadius: 24, padding: 4, marginTop: 16 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  tabButtonActive: { backgroundColor: '#FFFFFF', boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', elevation: 2 },
  tabText: { color: '#766A87', fontWeight: '700', fontSize: 14 },
  tabTextActive: { color: '#1A1028', fontWeight: '900' },
  list: { padding: 20, paddingBottom: 110, gap: 14 },
  clubCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#F0E9F8' },
  clubTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  clubIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0F3' },
  category: { color: '#7C3AED', fontWeight: '900', fontSize: 11, textTransform: 'uppercase' },
  clubName: { color: '#1A1028', fontSize: 18, fontWeight: '900', marginTop: 2 },
  members: { color: '#766A87', fontWeight: '900', fontSize: 13 },
  description: { color: '#5F536D', lineHeight: 21, fontSize: 14, marginTop: 12, fontWeight: '600' },
  eventBox: { marginTop: 14, padding: 12, borderRadius: 16, backgroundColor: '#F8F4FF', flexDirection: 'row', alignItems: 'center', gap: 10 },
  eventTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventTitle: { color: '#27153C', fontWeight: '900', fontSize: 14 },
  eventMeta: { color: '#766A87', fontSize: 12, fontWeight: '700', marginTop: 4 },
  rsvpButton: { height: 40, borderRadius: 20, backgroundColor: '#FF4D6D', paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 },
  rsvpButtonDone: { backgroundColor: '#0FA968' },
  rsvpText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
  openChatButton: { backgroundColor: '#7C3AED', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 16, gap: 8 },
  openChatText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyStateText: { color: '#766A87', fontSize: 16, fontWeight: '600' },
});
