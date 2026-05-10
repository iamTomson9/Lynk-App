export type UserIntent = 'friends' | 'dating';
export type SwipeAction = 'like' | 'pass' | 'super_like';

export type LynkProfile = {
  id: string;
  fullName: string;
  displayName: string;
  age: number;
  gender: string;
  intent: UserIntent;
  bio: string;
  interests: string[];
  hobbies: string[];
  photos: string[];
  occupation: string;
  distanceKm: number;
  relationshipGoal?: string;
  sexualOrientation?: string;
  isPremium?: boolean;
};

export type CurrentProfileInput = {
  fullName: string;
  displayName: string;
  age: number;
  gender: string;
  intent: UserIntent;
  bio: string;
  interests: string[];
  hobbies: string[];
  photos: string[];
  occupation: string;
  preferredGenders: string[];
  preferredMinAge: number;
  preferredMaxAge: number;
  discoveryRadiusKm: number;
  relationshipGoal?: string;
  sexualOrientation?: string;
};

export type LynkMatch = {
  id: string;
  profile: LynkProfile;
  createdAt: string;
  lastMessage?: string;
  unreadCount?: number;
};

export type LynkMessage = {
  id: string;
  matchId: string;
  senderId: string;
  body: string;
  createdAt: string;
  type: 'text' | 'emoji' | 'icebreaker';
};

export type LynkClub = {
  id: string;
  name: string;
  category: string;
  description: string;
  meetingDay: string;
  memberCount: number;
  nextEvent?: {
    id: string;
    title: string;
    startsAt: string;
    location: string;
  };
};
