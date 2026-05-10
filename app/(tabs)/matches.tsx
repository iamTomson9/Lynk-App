import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatCircle, Heart, Star } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { getMatches } from '../../utils/lynkData';
import { LynkMatch } from '../../utils/lynkTypes';

export default function MatchesScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<LynkMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches().then((items) => {
      setMatches(items);
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Mutual interest</Text>
        <Text style={styles.title}>Matches</Text>
        <Text style={styles.subtitle}>{matches.length ? `${matches.length} active connections` : 'Swipe right to unlock chat.'}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#FF4D6D" size="large" style={{ marginTop: 80 }} />
      ) : matches.length === 0 ? (
        <View style={styles.empty}>
          <Heart size={76} color="#FF4D6D" weight="thin" />
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyText}>Discovery creates a match when interest is mutual.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
          <Text style={styles.sectionTitle}>New matches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarRail}>
            {matches.map((match) => (
              <TouchableOpacity key={match.id} style={styles.avatarItem} onPress={() => router.push('/messages')}>
                <Image source={{ uri: match.profile.photos[0] }} style={styles.avatar} />
                <Text style={styles.avatarName} numberOfLines={1}>{match.profile.displayName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Conversations</Text>
          {matches.map((match) => (
            <TouchableOpacity key={`conversation-${match.id}`} style={styles.conversation} onPress={() => router.push('/messages')}>
              <Image source={{ uri: match.profile.photos[0] }} style={styles.conversationAvatar} />
              <View style={{ flex: 1 }}>
                <View style={styles.conversationTop}>
                  <Text style={styles.conversationName}>{match.profile.displayName}</Text>
                  {match.profile.isPremium ? <Star size={14} color="#7C3AED" weight="fill" /> : null}
                </View>
                <Text style={styles.preview} numberOfLines={1}>{match.lastMessage ?? 'Start with an ice breaker.'}</Text>
              </View>
              {match.unreadCount ? (
                <View style={styles.badge}><Text style={styles.badgeText}>{match.unreadCount}</Text></View>
              ) : (
                <ChatCircle size={22} color="#B9AFC6" />
              )}
            </TouchableOpacity>
          ))}

          <LinearGradient colors={['#FF4D6D', '#7C3AED']} style={styles.premiumPanel}>
            <Text style={styles.premiumTitle}>Premium preview</Text>
            <Text style={styles.premiumText}>Message before matching, send super likes, view repeated visitors, and start video calls.</Text>
          </LinearGradient>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF9FF', paddingTop: 54 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  kicker: { color: '#766A87', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  title: { color: '#1A1028', fontSize: 32, fontWeight: '900' },
  subtitle: { color: '#766A87', fontWeight: '700', marginTop: 4 },
  sectionTitle: { color: '#21182E', fontSize: 16, fontWeight: '900', marginHorizontal: 20, marginTop: 20, marginBottom: 10 },
  avatarRail: { paddingHorizontal: 20, gap: 14 },
  avatarItem: { width: 76, alignItems: 'center' },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 3, borderColor: '#FFFFFF' },
  avatarName: { color: '#3A2E46', fontWeight: '800', fontSize: 12, marginTop: 7 },
  conversation: { marginHorizontal: 20, marginBottom: 12, padding: 12, borderRadius: 18, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#F0E9F8' },
  conversationAvatar: { width: 58, height: 58, borderRadius: 18 },
  conversationTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  conversationName: { color: '#1A1028', fontSize: 16, fontWeight: '900' },
  preview: { color: '#766A87', fontSize: 13, fontWeight: '600', marginTop: 4 },
  badge: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: '#FF4D6D', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
  premiumPanel: { margin: 20, padding: 18, borderRadius: 22 },
  premiumTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', marginBottom: 6 },
  premiumText: { color: '#FFFFFF', lineHeight: 21, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 80 },
  emptyTitle: { fontSize: 23, fontWeight: '900', color: '#21182E', marginTop: 14 },
  emptyText: { color: '#766A87', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 8 },
});
