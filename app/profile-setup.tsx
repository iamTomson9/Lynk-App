import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image, StyleSheet, ScrollView } from 'react-native';
import { CaretLeft, Plus, X } from 'phosphor-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ProfileSetupStyles } from '../styles/ProfileSetupStyles';
import { saveUserProfileAsync, validateImageSize } from '../utils/firebaseUtils';

export default function ProfileSetupScreen() {
  const router = useRouter();
  
  // Wizard State
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(''); 
  const [gender, setGender] = useState('');
  const [interestedIn, setInterestedIn] = useState('');
  // Each entry holds the local URI (for preview) and the base64 string (for upload)
  const [photos, setPhotos] = useState<{ uri: string; base64: string }[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // Available interest chips
  const INTERESTS = [
    '🎵 Music', '🏋️ Fitness', '✈️ Travel', '📸 Photography',
    '🎮 Gaming', '🍳 Cooking', '📚 Reading', '🎨 Art',
    '⚽ Sports', '🎬 Movies', '🐾 Pets', '🌿 Nature',
    '💃 Dancing', '🧘 Yoga', '🎸 Concerts', '🍕 Foodie',
    '🏄 Surfing', '🧗 Hiking', '🎭 Theatre', '💻 Tech',
  ];

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter(i => i !== item));
    } else if (interests.length < 5) {
      setInterests([...interests, item]);
    }
  };

  // Validation
  const canProceedStep1 = firstName.trim().length > 0 && lastName.trim().length > 0;
  const canProceedStep2 = dob.length > 0;
  const canProceedStep3 = gender !== '' && interestedIn !== '';
  const canProceedStep4 = photos.length > 0 && photos.every(p => p.base64.length > 0);
  const canProceedStep5 = interests.length >= 1;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      submitProfile();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.1,  // Dropped to 0.1 to ensure base64 stays under Firestore's 1MB limit
      exif: false,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      if (!asset.base64) {
        alert('Could not read photo. Please try a different image.');
        return;
      }

      // Log size for debugging
      console.log(`[Picker] Selected image size: ~${Math.round(asset.base64.length / 1024)} KB (base64)`);

      // Validate file size — reject anything over 5MB
      const sizeError = validateImageSize(asset.fileSize);
      if (sizeError) {
        alert(sizeError);
        return;
      }

      // Build data URL from the base64 string the picker gave us
      const ext = asset.uri.split('.').pop()?.toLowerCase() || 'jpg';
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = `data:${mime};base64,${asset.base64}`;

      setPhotos([...photos, { uri: asset.uri, base64: dataUrl }]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const submitProfile = async () => {
    setIsLoading(true);
    console.log("[Submit] Starting profile submission...");
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out. Please check your internet or Firebase Firestore setup.")), 15000)
    );

    try {
      const photoUrls = photos.map(p => p.base64);
      console.log(`[Submit] Saving profile for ${firstName} with ${photoUrls.length} photos...`);

      // Race the save against the timeout
      await Promise.race([
        saveUserProfileAsync({
          firstName,
          lastName,
          dob,
          gender,
          interestedIn,
          interests,
          photoUrls,
        }),
        timeoutPromise
      ]);

      console.log("[Submit] Profile saved successfully!");
      alert("Profile created! Welcome to Lynk 🎉");
      router.replace('/discover');
      
    } catch (error: any) {
      console.error("[Submit] Error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={ProfileSetupStyles.titleText}>What's your name?</Text>
            <Text style={ProfileSetupStyles.subtitleText}>This is how it will appear on your profile.</Text>
            
            <View style={ProfileSetupStyles.inputWrapper}>
              <TextInput
                style={ProfileSetupStyles.textInput}
                placeholder="First Name"
                placeholderTextColor="#999999"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={ProfileSetupStyles.inputWrapper}>
              <TextInput
                style={ProfileSetupStyles.textInput}
                placeholder="Last Name"
                placeholderTextColor="#999999"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={ProfileSetupStyles.titleText}>When is your birthday?</Text>
            <Text style={ProfileSetupStyles.subtitleText}>You must be at least 18 years old to use Lynk.</Text>
            
            <View style={ProfileSetupStyles.inputWrapper}>
              <TextInput
                style={ProfileSetupStyles.textInput}
                placeholder="DD / MM / YYYY"
                placeholderTextColor="#999999"
                keyboardType="numbers-and-punctuation"
                value={dob}
                onChangeText={setDob}
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={ProfileSetupStyles.titleText}>Who are you?</Text>
            <Text style={ProfileSetupStyles.subtitleText}>Choose how you identify and who you want to meet.</Text>
            
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 }}>I am a...</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity 
                style={[ProfileSetupStyles.optionButton, { width: '48%' }, gender === 'Male' && ProfileSetupStyles.optionButtonActive]}
                onPress={() => setGender('Male')}
              >
                <Text style={[ProfileSetupStyles.optionText, gender === 'Male' && ProfileSetupStyles.optionTextActive]}>Man</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[ProfileSetupStyles.optionButton, { width: '48%' }, gender === 'Female' && ProfileSetupStyles.optionButtonActive]}
                onPress={() => setGender('Female')}
              >
                <Text style={[ProfileSetupStyles.optionText, gender === 'Female' && ProfileSetupStyles.optionTextActive]}>Woman</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginTop: 20, marginBottom: 10 }}>Looking for...</Text>
            <TouchableOpacity 
              style={[ProfileSetupStyles.optionButton, interestedIn === 'Women' && ProfileSetupStyles.optionButtonActive]}
              onPress={() => setInterestedIn('Women')}
            >
              <Text style={[ProfileSetupStyles.optionText, interestedIn === 'Women' && ProfileSetupStyles.optionTextActive]}>Women</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[ProfileSetupStyles.optionButton, interestedIn === 'Men' && ProfileSetupStyles.optionButtonActive]}
              onPress={() => setInterestedIn('Men')}
            >
              <Text style={[ProfileSetupStyles.optionText, interestedIn === 'Men' && ProfileSetupStyles.optionTextActive]}>Men</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[ProfileSetupStyles.optionButton, interestedIn === 'Everyone' && ProfileSetupStyles.optionButtonActive]}
              onPress={() => setInterestedIn('Everyone')}
            >
              <Text style={[ProfileSetupStyles.optionText, interestedIn === 'Everyone' && ProfileSetupStyles.optionTextActive]}>Everyone</Text>
            </TouchableOpacity>
          </>
        );
      case 4:
        return (
          <>
            <Text style={ProfileSetupStyles.titleText}>Add your photos</Text>
            <Text style={ProfileSetupStyles.subtitleText}>Add at least 1 photo to continue. The more, the better!</Text>
            
            <View style={ProfileSetupStyles.photoGrid}>
              {[0, 1, 2, 3].map((index) => {
                const hasPhoto = index < photos.length;
                return (
                  <View key={index} style={ProfileSetupStyles.photoBox}>
                    {hasPhoto ? (
                      <>
                        <Image source={{ uri: photos[index].uri }} style={ProfileSetupStyles.photoImage} />
                        <TouchableOpacity style={ProfileSetupStyles.deletePhotoIcon} onPress={() => removePhoto(index)}>
                          <X color="#FFFFFF" size={16} weight="bold" />
                        </TouchableOpacity>
                      </>
                    ) : (
                      index === photos.length && (
                        <TouchableOpacity style={ProfileSetupStyles.addPhotoIcon} onPress={pickImage}>
                          <Plus color="#FFFFFF" size={20} weight="bold" />
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                );
              })}
            </View>
          </>
        );
      case 5:
        return (
          <>
            <Text style={ProfileSetupStyles.titleText}>Your interests</Text>
            <Text style={ProfileSetupStyles.subtitleText}>
              Pick up to 5 things you love. This helps us find your perfect Lynk! ✨
            </Text>

            <View style={interestStyles.grid}>
              {INTERESTS.map((item) => {
                const selected = interests.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[interestStyles.chip, selected && interestStyles.chipActive]}
                    onPress={() => toggleInterest(item)}
                    activeOpacity={0.75}
                  >
                    <Text style={[interestStyles.chipText, selected && interestStyles.chipTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={interestStyles.counter}>
              {interests.length}/5 selected
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  let canProceed = false;
  if (step === 1) canProceed = canProceedStep1;
  else if (step === 2) canProceed = canProceedStep2;
  else if (step === 3) canProceed = canProceedStep3;
  else if (step === 4) canProceed = canProceedStep4;
  else if (step === 5) canProceed = canProceedStep5;

  return (
    <KeyboardAvoidingView 
      style={ProfileSetupStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={ProfileSetupStyles.progressContainer}>
        <View style={ProfileSetupStyles.progressBarBackground}>
          <View style={[ProfileSetupStyles.progressBarFill, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
      </View>

      <ScrollView
        style={ProfileSetupStyles.contentContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStepContent()}
      </ScrollView>

      <View style={ProfileSetupStyles.footerContainer}>
        {step > 1 ? (
          <TouchableOpacity style={ProfileSetupStyles.navButton} onPress={handleBack}>
            <CaretLeft color="#1A1A1A" size={24} weight="bold" />
          </TouchableOpacity>
        ) : (
          <View style={ProfileSetupStyles.navButton} /> 
        )}

        <TouchableOpacity 
          style={[ProfileSetupStyles.primaryButton, !canProceed && ProfileSetupStyles.primaryButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={ProfileSetupStyles.primaryButtonText}>
              {step === totalSteps ? 'Finish 🎉' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Interests chip grid styles ───────────────────────────────────────────────
const interestStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    borderColor: '#FF4D6D',
    backgroundColor: '#FFF0F3',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
  },
  chipTextActive: {
    color: '#FF4D6D',
  },
  counter: {
    marginTop: 16,
    fontSize: 13,
    color: '#BBBBBB',
    fontWeight: '500',
    textAlign: 'center',
  },
});
