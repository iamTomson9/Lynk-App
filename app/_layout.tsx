import { Stack } from "expo-router";

// This is the root layout of our application.
// In Expo Router, the _layout.tsx file wraps all the screens in its directory.
// We are using a Stack navigator here, which means screens will stack on top of each other.
export default function RootLayout() {
  return (
    <Stack>
      {/* We set headerShown to false because we want to build our own custom headers/screens */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
