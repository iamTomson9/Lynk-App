import { Stack } from "expo-router";

// This is the root layout of our application.
// In Expo Router, the _layout.tsx file wraps all the screens in its directory.
// We are using a Stack navigator here, which means screens will stack on top of each other.
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth + Onboarding screens */}
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="email-auth" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="profile-setup" />
      {/* Main app — tab group */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
