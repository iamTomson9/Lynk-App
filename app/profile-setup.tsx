import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { CaretLeft, Plus, X } from 'phosphor-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ProfileSetupStyles } from '../styles/ProfileSetupStyles';
import { uploadProfileImageAsync, saveUserProfileAsync } from '../utils/firebaseUtils';

export default function ProfileSetupScreen() {
  const router = useRouter();
  
  // Wizard State
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(''); 
  const [gender, setGender] = useState('');
  const [interestedIn, setInterestedIn] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Validation
  const canProceedStep1 = firstName.trim().length > 0 && lastName.trim().length > 0;
  const canProceedStep2 = dob.length > 0;
  const canProceedStep3 = gender !== '' && interestedIn !== '';
  const canProceedStep4 = photos.length > 0;

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
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const submitProfile = async () => {
    setIsLoading(true);
    try {
      // 1. Upload photos
      const uploadedPhotoUrls = [];
      for (let i = 0; i < photos.length; i++) {
        const url = await uploadProfileImageAsync(photos[i], i);
        uploadedPhotoUrls.push(url);
      }

      // 2. Save profile
      await saveUserProfileAsync({
        firstName,
        lastName,
        dob,
        gender,
        interestedIn,
        photoUrls: uploadedPhotoUrls,
      });

      // Navigate to the main app tab navigator
      router.replace('/(tabs)/discover');
      
    } catch (error: any) {
      console.error(error);
      alert("Failed to save profile: " + error.message);
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
                        <Image source={{ uri: photos[index] }} style={ProfileSetupStyles.photoImage} />
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
      default:
        return null;
    }
  };

  let canProceed = false;
  if (step === 1) canProceed = canProceedStep1;
  else if (step === 2) canProceed = canProceedStep2;
  else if (step === 3) canProceed = canProceedStep3;
  else if (step === 4) canProceed = canProceedStep4;

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

      <View style={ProfileSetupStyles.contentContainer}>
        {renderStepContent()}
      </View>

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
              {step === totalSteps ? "Finish" : "Next"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
