import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalendarDots, CheckCircle, UsersThree, Plus } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { getClubs, rsvpToEvent } from '../../utils/lynkData';
import { LynkClub } from '../../utils/lynkTypes';

export default function ClubsScreen() {
  const router = useRouter();
  const [clubs, setClubs] = useState<LynkClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getClubs().then((items) => {
      setClubs(items);
      setLoading(false);
    });
  }, []);

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
        <Text style={styles.subtitle}>Find your tribe and meaningful connections.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#FF4D6D" size="large" style={{ marginTop: 80 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {clubs.map((club) => (
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
          ))}
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
  subtitle: { color: '#766A87', fontWeight: '700', marginTop: 4 },
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
});
