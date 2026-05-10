import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CaretLeft, Heart, Users } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { ProfileSetupStyles } from '../styles/ProfileSetupStyles';
import { saveCurrentProfile } from '../utils/lynkData';
import { UserIntent } from '../utils/lynkTypes';

const INTERESTS = ['Music', 'Fitness', 'Travel', 'Photography', 'Gaming', 'Cooking', 'Reading', 'Art', 'Sports', 'Movies', 'Nature', 'Tech'];
const GENDERS = ['Woman', 'Man', 'Non-binary'];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [intent, setIntent] = useState<UserIntent>('friends');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Woman');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>(['Tech']);
  const [preferredGenders, setPreferredGenders] = useState<string[]>(['Woman', 'Man']);
  const [relationshipGoal, setRelationshipGoal] = useState('relationship');
  const [radius, setRadius] = useState('25');

  const totalSteps = intent === 'dating' ? 5 : 4;
  const parsedAge = Number(age);

  const canContinue = useMemo(() => {
    if (step === 1) return true;
    if (step === 2) return fullName.trim().length > 2 && parsedAge >= 16 && gender.length > 0;
    if (step === 3) return interests.length > 0 && interests.length <= 3;
    if (step === 4 && intent === 'dating') return parsedAge >= 18 && preferredGenders.length > 0;
    return true;
  }, [fullName, gender, interests.length, intent, parsedAge, preferredGenders.length, step]);

  function toggle(list: string[], value: string, limit: number, setter: (next: string[]) => void) {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
      return;
    }
    if (list.length < limit) setter([...list, value]);
  }

  async function finish() {
    setIsLoading(true);
    await saveCurrentProfile({
      fullName: fullName.trim() || 'Demo User',
      displayName: fullName.trim().split(' ')[0] || 'Demo',
      age: parsedAge || 21,
      gender,
      intent,
      bio: bio.trim() || 'Student looking for meaningful campus connections.',
      interests,
      hobbies: interests,
      photos: [],
      university: 'University of Botswana',
      preferredGenders,
      preferredMinAge: intent === 'dating' ? 18 : 16,
      preferredMaxAge: 30,
      discoveryRadiusKm: Number(radius) || 25,
      relationshipGoal: intent === 'dating' ? relationshipGoal : undefined,
      sexualOrientation: intent === 'dating' ? 'Prefer not to say' : undefined,
    });
    setIsLoading(false);
    router.replace('/discover');
  }

  function next() {
    if (step < totalSteps) setStep(step + 1);
    else finish();
  }

  return (
    <KeyboardAvoidingView style={ProfileSetupStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={ProfileSetupStyles.progressContainer}>
        <View style={ProfileSetupStyles.progressBarBackground}>
          <View style={[ProfileSetupStyles.progressBarFill, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
      </View>

      <ScrollView style={ProfileSetupStyles.contentContainer} contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        {step === 1 && (
          <>
            <Text style={ProfileSetupStyles.titleText}>What brings you to Lynk?</Text>
            <Text style={ProfileSetupStyles.subtitleText}>Your intent shapes profile depth, filters, and match suggestions.</Text>
            <TouchableOpacity
              style={[ProfileSetupStyles.intentCard, intent === 'friends' && ProfileSetupStyles.intentCardActive]}
              onPress={() => setIntent('friends')}
            >
              <Users size={24} color={intent === 'friends' ? '#FFFFFF' : '#FF4D6D'} weight="bold" />
              <View style={{ flex: 1 }}>
                <Text style={[ProfileSetupStyles.intentTitle, intent === 'friends' && ProfileSetupStyles.intentTitleActive]}>Find friends</Text>
                <Text style={[ProfileSetupStyles.intentBody, intent === 'friends' && ProfileSetupStyles.intentBodyActive]}>Study partners, club buddies, and casual social connections.</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[ProfileSetupStyles.intentCard, intent === 'dating' && ProfileSetupStyles.intentCardActive]}
              onPress={() => setIntent('dating')}
            >
              <Heart size={24} color={intent === 'dating' ? '#FFFFFF' : '#FF4D6D'} weight="fill" />
              <View style={{ flex: 1 }}>
                <Text style={[ProfileSetupStyles.intentTitle, intent === 'dating' && ProfileSetupStyles.intentTitleActive]}>Find a partner</Text>
                <Text style={[ProfileSetupStyles.intentBody, intent === 'dating' && ProfileSetupStyles.intentBodyActive]}>Romantic matching with age, orientation, and relationship-goal filters.</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={ProfileSetupStyles.titleText}>Build your profile</Text>
            <Text style={ProfileSetupStyles.subtitleText}>Dating profiles require users to be 18 or older.</Text>
            <View style={ProfileSetupStyles.inputWrapper}>
              <TextInput style={ProfileSetupStyles.textInput} placeholder="Full name" placeholderTextColor="#999999" value={fullName} onChangeText={setFullName} />
            </View>
            <View style={ProfileSetupStyles.inputWrapper}>
              <TextInput style={ProfileSetupStyles.textInput} placeholder="Age" placeholderTextColor="#999999" keyboardType="number-pad" value={age} onChangeText={setAge} />
            </View>
            <View style={ProfileSetupStyles.chipRow}>
              {GENDERS.map((item) => (
                <TouchableOpacity key={item} style={[ProfileSetupStyles.chip, gender === item && ProfileSetupStyles.chipActive]} onPress={() => setGender(item)}>
                  <Text style={[ProfileSetupStyles.chipText, gender === item && ProfileSetupStyles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[ProfileSetupStyles.inputWrapper, { minHeight: 104, alignItems: 'flex-start', paddingTop: 12 }]}>
              <TextInput
                style={[ProfileSetupStyles.textInput, { minHeight: 78 }]}
                placeholder="Short bio"
                placeholderTextColor="#999999"
                value={bio}
                onChangeText={setBio}
                multiline
              />
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={ProfileSetupStyles.titleText}>Choose up to three interests</Text>
            <Text style={ProfileSetupStyles.subtitleText}>These power matching, club suggestions, and ice breakers.</Text>
            <View style={ProfileSetupStyles.chipRow}>
              {INTERESTS.map((item) => {
                const selected = interests.includes(item);
                return (
                  <TouchableOpacity key={item} style={[ProfileSetupStyles.chip, selected && ProfileSetupStyles.chipActive]} onPress={() => toggle(interests, item, 3, setInterests)}>
                    <Text style={[ProfileSetupStyles.chipText, selected && ProfileSetupStyles.chipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={ProfileSetupStyles.counterText}>{interests.length}/3 selected</Text>
          </>
        )}

        {step === 4 && intent === 'dating' && (
          <>
            <Text style={ProfileSetupStyles.titleText}>Dating preferences</Text>
            <Text style={ProfileSetupStyles.subtitleText}>These filters keep romantic discovery age-appropriate and relevant.</Text>
            <View style={ProfileSetupStyles.chipRow}>
              {GENDERS.map((item) => {
                const selected = preferredGenders.includes(item);
                return (
                  <TouchableOpacity key={item} style={[ProfileSetupStyles.chip, selected && ProfileSetupStyles.chipActive]} onPress={() => toggle(preferredGenders, item, 3, setPreferredGenders)}>
                    <Text style={[ProfileSetupStyles.chipText, selected && ProfileSetupStyles.chipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={ProfileSetupStyles.inputWrapper}>
              <TextInput style={ProfileSetupStyles.textInput} placeholder="relationship, casual, unsure" placeholderTextColor="#999999" value={relationshipGoal} onChangeText={setRelationshipGoal} />
            </View>
          </>
        )}

        {((step === 4 && intent === 'friends') || step === 5) && (
          <>
            <Text style={ProfileSetupStyles.titleText}>Discovery range</Text>
            <Text style={ProfileSetupStyles.subtitleText}>Lynk rounds precise location for privacy and focuses on nearby campus connections.</Text>
            <View style={ProfileSetupStyles.inputWrapper}>
              <TextInput style={ProfileSetupStyles.textInput} placeholder="Distance radius in km" placeholderTextColor="#999999" keyboardType="number-pad" value={radius} onChangeText={setRadius} />
            </View>
            <View style={ProfileSetupStyles.summaryBox}>
              <Text style={ProfileSetupStyles.summaryTitle}>{intent === 'friends' ? 'Friendship profile' : 'Dating profile'}</Text>
              <Text style={ProfileSetupStyles.summaryText}>Interests: {interests.join(', ')}</Text>
              <Text style={ProfileSetupStyles.summaryText}>Radius: {radius || 25} km</Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={ProfileSetupStyles.footerContainer}>
        {step > 1 ? (
          <TouchableOpacity style={ProfileSetupStyles.navButton} onPress={() => setStep(step - 1)}>
            <CaretLeft color="#1A1A1A" size={24} weight="bold" />
          </TouchableOpacity>
        ) : (
          <View style={ProfileSetupStyles.navButton} />
        )}
        <TouchableOpacity style={[ProfileSetupStyles.primaryButton, !canContinue && ProfileSetupStyles.primaryButtonDisabled]} onPress={next} disabled={!canContinue || isLoading}>
          {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={ProfileSetupStyles.primaryButtonText}>{step === totalSteps ? 'Finish' : 'Next'}</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
