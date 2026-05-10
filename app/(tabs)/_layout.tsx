import { Tabs } from 'expo-router';
import { Sparkle, Heart, ChatCircle, User, UsersThree } from 'phosphor-react-native';

// The primary brand colour for active tabs
const PINK = '#FF4D6D';
const INACTIVE = '#B0B0B0';
const TAB_BG = '#FFFFFF';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PINK,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          // Subtle shadow above the tab bar
          boxShadow: '0px -2px 12px rgba(0,0,0,0.06)',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Sparkle
              size={focused ? 28 : 24}
              weight={focused ? 'fill' : 'regular'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, focused }) => (
            <Heart
              size={focused ? 28 : 24}
              weight={focused ? 'fill' : 'regular'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <ChatCircle
              size={focused ? 28 : 24}
              weight={focused ? 'fill' : 'regular'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="clubs"
        options={{
          title: 'Clubs',
          tabBarIcon: ({ color, focused }) => (
            <UsersThree
              size={focused ? 28 : 24}
              weight={focused ? 'fill' : 'regular'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User
              size={focused ? 28 : 24}
              weight={focused ? 'fill' : 'regular'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
