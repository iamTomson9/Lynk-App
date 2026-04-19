import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView,
  FlatList, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import {
  collection, query, where, getDocs, doc, getDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { MatchesStyles } from '../../styles/MatchesStyles';

interface MatchedUser {
  id: string;
  firstName: string;
  lastName: string;
  photoUrls: string[];
  matchId: string;
}

export default function MatchesScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      // Query matches where current user is a participant
      const matchesQuery = query(
        collection(db, 'matches'),
        where('users', 'array-contains', currentUser.uid)
      );
      const snapshot = await getDocs(matchesQuery);
      const matchedUsers: MatchedUser[] = [];

      for (const matchDoc of snapshot.docs) {
        const matchData = matchDoc.data();
        // Get the OTHER user's ID
        const otherUserId = matchData.users.find((uid: string) => uid !== currentUser.uid);
        if (!otherUserId) continue;

        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          matchedUsers.push({
            id: otherUserId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            photoUrls: userData.photoUrls ?? [],
            matchId: matchDoc.id,
          });
        }
      }

      setMatches(matchedUsers);
    } catch (e) {
      console.error('Failed to load matches:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={MatchesStyles.container}>
      {/* Header */}
      <View style={MatchesStyles.header}>
        <Text style={MatchesStyles.headerTitle}>Matches 💘</Text>
        <Text style={MatchesStyles.headerSubtitle}>
          {matches.length > 0
            ? `You have ${matches.length} match${matches.length === 1 ? '' : 'es'}!`
            : 'Keep swiping to find your Lynk'}
        </Text>
      </View>

      {isLoading ? (
        <View style={MatchesStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4D6D" />
        </View>
      ) : matches.length === 0 ? (
        <View style={MatchesStyles.emptyState}>
          <Heart size={80} color="#FF4D6D" weight="thin" style={MatchesStyles.emptyIcon} />
          <Text style={MatchesStyles.emptyTitle}>No matches yet</Text>
          <Text style={MatchesStyles.emptySubtitle}>
            Head to Discover and start swiping — your first Lynk is waiting! ✨
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* New Matches section — horizontal bubbles */}
          <Text style={MatchesStyles.sectionLabel}>New Matches</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={MatchesStyles.newMatchesScroll}
          >
            {matches.map((match) => (
              <TouchableOpacity
                key={match.id}
                style={MatchesStyles.newMatchItem}
                onPress={() => router.push('/(tabs)/messages')}
                activeOpacity={0.8}
              >
                <View style={MatchesStyles.newMatchAvatarWrapper}>
                  {match.photoUrls[0] ? (
                    <Image
                      source={{ uri: match.photoUrls[0] }}
                      style={MatchesStyles.newMatchAvatar}
                    />
                  ) : (
                    <LinearGradient
                      colors={['#FA517C', '#A528CD']}
                      style={MatchesStyles.newMatchAvatar}
                    />
                  )}
                </View>
                <Text style={MatchesStyles.newMatchName} numberOfLines={1}>
                  {match.firstName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Conversation list */}
          <Text style={MatchesStyles.sectionLabel}>Say Hello 👋</Text>
          {matches.map((match) => (
            <TouchableOpacity
              key={`conv-${match.id}`}
              style={MatchesStyles.conversationItem}
              onPress={() => router.push('/(tabs)/messages')}
              activeOpacity={0.85}
            >
              {match.photoUrls[0] ? (
                <Image
                  source={{ uri: match.photoUrls[0] }}
                  style={MatchesStyles.conversationAvatar}
                />
              ) : (
                <LinearGradient
                  colors={['#FA517C', '#A528CD']}
                  style={MatchesStyles.conversationAvatar}
                />
              )}
              <View style={MatchesStyles.conversationInfo}>
                <Text style={MatchesStyles.conversationName}>
                  {match.firstName} {match.lastName}
                </Text>
                <Text style={MatchesStyles.conversationPreview}>
                  Say hi to {match.firstName}! 👋
                </Text>
              </View>
              <Text style={MatchesStyles.conversationTime}>Now</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
