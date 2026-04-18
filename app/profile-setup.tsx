import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileSetupScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile Setup</Text>
      <Text style={{ marginTop: 10, color: 'gray' }}>We will build the profile creation flow here!</Text>
    </View>
  );
}
