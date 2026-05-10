import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrentProfileInput, LynkClub, LynkMatch, LynkMessage, LynkProfile, SwipeAction } from './lynkTypes';
import { DEMO_USER_ID, demoClubs, demoMatches, demoMessages, demoProfiles } from './lynkPrototypeData';

declare const process: { env: Record<string, string | undefined> };

const STORAGE_KEYS = {
  profile: 'lynk.currentProfile',
  swiped: 'lynk.swipedProfileIds',
  matches: 'lynk.matches',
  messages: 'lynk.messages',
  rsvps: 'lynk.eventRsvps',
};

import { supabase } from './supabase';

export const isSupabaseConfigured = Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

async function supabaseRest<T>(table: string, query = '*'): Promise<T[] | null> {
  if (!isSupabaseConfigured) return null;

  // Since the previous function took a custom query string `select=*`, we'll simplify it for standard select.
  // The query argument was typically just 'select=*' or 'select=*&order=starts_at.asc'.
  // Using the Supabase client makes it easier but we'll try to map the basic usage.
  
  try {
    let request = supabase.from(table).select('*');
    
    // Quick hack to support the one specific order query used in getClubs
    if (query.includes('order=starts_at.asc')) {
       request = request.order('starts_at', { ascending: true });
    }

    const { data, error } = await request;

    if (error) {
      console.error(`Supabase error fetching ${table}:`, error);
      return null;
    }
    return data as T[];
  } catch (err) {
    return null;
  }
}

function getAge(dateOfBirth?: string): number {
  if (!dateOfBirth) return 21;
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return 21;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) as T : fallback;
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getCurrentProfile(): Promise<CurrentProfileInput | null> {
  return readJson<CurrentProfileInput | null>(STORAGE_KEYS.profile, null);
}

export async function saveCurrentProfile(profile: CurrentProfileInput): Promise<void> {
  await writeJson(STORAGE_KEYS.profile, profile);
}

export async function getDiscoveryProfiles(): Promise<LynkProfile[]> {
  const remoteProfiles = await supabaseRest<any>('profiles', 'select=*');
  if (remoteProfiles?.length) {
    return remoteProfiles.map((profile) => ({
      id: profile.id,
      fullName: profile.full_name,
      displayName: profile.display_name,
      age: getAge(profile.date_of_birth),
      gender: profile.gender,
      intent: profile.intent,
      bio: profile.bio ?? '',
      interests: profile.interests ?? [],
      hobbies: profile.hobbies ?? [],
      photos: profile.profile_photo_url ? [profile.profile_photo_url] : ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800'],
      university: profile.university ?? 'Campus',
      distanceKm: 1,
      relationshipGoal: profile.relationship_goal?.replaceAll('_', ' '),
      sexualOrientation: profile.sexual_orientation,
      isPremium: profile.is_premium,
    }));
  }

  const swiped = await readJson<string[]>(STORAGE_KEYS.swiped, []);
  const current = await getCurrentProfile();
  return demoProfiles.filter((profile) => {
    if (swiped.includes(profile.id)) return false;
    if (!current) return true;
    if (profile.age < current.preferredMinAge || profile.age > current.preferredMaxAge) return false;
    if (profile.distanceKm > current.discoveryRadiusKm) return false;
    return true;
  });
}

export async function recordSwipe(profile: LynkProfile, action: SwipeAction): Promise<LynkMatch | null> {
  const swiped = await readJson<string[]>(STORAGE_KEYS.swiped, []);
  await writeJson(STORAGE_KEYS.swiped, Array.from(new Set([...swiped, profile.id])));

  if (action === 'pass') return null;

  const matches = await getMatches();
  const alreadyMatched = matches.some((match) => match.profile.id === profile.id);
  if (alreadyMatched) return null;

  const shouldMatch = profile.id === 'profile-ama' || action === 'super_like';
  if (!shouldMatch) return null;

  const match: LynkMatch = {
    id: `match-${profile.id}`,
    profile,
    createdAt: new Date().toISOString(),
    lastMessage: 'Start with an ice breaker.',
    unreadCount: 0,
  };

  await writeJson(STORAGE_KEYS.matches, [match, ...matches]);
  return match;
}

export async function getMatches(): Promise<LynkMatch[]> {
  return readJson<LynkMatch[]>(STORAGE_KEYS.matches, demoMatches);
}

export async function getMessages(matchId = 'match-ama'): Promise<LynkMessage[]> {
  const allMessages = await readJson<LynkMessage[]>(STORAGE_KEYS.messages, demoMessages);
  return allMessages.filter((message) => message.matchId === matchId);
}

export async function sendMessage(matchId: string, body: string, type: LynkMessage['type'] = 'text'): Promise<LynkMessage> {
  const message: LynkMessage = {
    id: `msg-${Date.now()}`,
    matchId,
    senderId: DEMO_USER_ID,
    body,
    type,
    createdAt: new Date().toISOString(),
  };

  const allMessages = await readJson<LynkMessage[]>(STORAGE_KEYS.messages, demoMessages);
  await writeJson(STORAGE_KEYS.messages, [...allMessages, message]);
  return message;
}

export async function getClubs(): Promise<LynkClub[]> {
  const remoteClubs = await supabaseRest<any>('clubs', 'select=*');
  if (remoteClubs?.length) {
    const remoteEvents = await supabaseRest<any>('club_events', 'select=*&order=starts_at.asc');
    const nextEventByClub = new Map<string, any>();

    remoteEvents?.forEach((event) => {
      if (!nextEventByClub.has(event.club_id)) {
        nextEventByClub.set(event.club_id, event);
      }
    });

    return remoteClubs.map((club) => ({
      id: club.id,
      name: club.name,
      category: club.category,
      description: club.description,
      meetingDay: club.meeting_day ?? 'TBA',
      memberCount: club.member_count ?? 0,
      nextEvent: nextEventByClub.has(club.id)
        ? {
            id: nextEventByClub.get(club.id).id,
            title: nextEventByClub.get(club.id).title,
            startsAt: new Date(nextEventByClub.get(club.id).starts_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            location: nextEventByClub.get(club.id).location,
          }
        : undefined,
    }));
  }

  return demoClubs;
}

export async function rsvpToEvent(eventId: string): Promise<void> {
  const rsvps = await readJson<string[]>(STORAGE_KEYS.rsvps, []);
  await writeJson(STORAGE_KEYS.rsvps, Array.from(new Set([...rsvps, eventId])));
}

export async function resetPrototypeData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
