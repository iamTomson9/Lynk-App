import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase';
import { auth } from '../../firebaseConfig';
import { getSupabaseProfileId } from '../../utils/supabaseUtils';

const CATEGORIES = ['Academics', 'Sports', 'Arts', 'Tech', 'Social', 'Other'];

export default function CreateClubScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isLoading, setIsLoading] = useState(false);

  const canCreate = name.trim().length > 2 && description.trim().length > 10;

  async function handleCreate() {
    if (!canCreate || !auth.currentUser) return;
    setIsLoading(true);

    const profileId = await getSupabaseProfileId();
    if (!profileId) {
      alert('Profile not found. Please complete your profile setup first.');
      setIsLoading(false);
      return;
    }
    
    const { data, error } = await supabase.from('clubs').insert({
      name: name.trim(),
      description: description.trim(),
      category: category,
      created_by: profileId,
      member_count: 1
    }).select().single();

    setIsLoading(false);

    if (error) {
      alert("Error creating group: " + error.message);
      return;
    }

    if (data) {
      // Navigate to the newly created group details page
      router.replace(`/clubs/${data.id}`);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <CaretLeft color="#1A1028" size={24} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Group</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Campus Coders"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What is this group about? (Min 10 characters)"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.createButton, !canCreate && styles.createButtonDisabled]} 
          disabled={!canCreate || isLoading}
          onPress={handleCreate}
        >
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.createButtonText}>Create Group</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F0E9F8' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FBF9FF', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1028' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '700', color: '#1A1028', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#F8F4FF', borderRadius: 16, paddingHorizontal: 16, height: 56, color: '#1A1028', borderWidth: 1, borderColor: '#F0E9F8', fontSize: 16 },
  textArea: { height: 120, paddingTop: 16, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { minHeight: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E0EA', justifyContent: 'center', alignItems: 'center' },
  chipActive: { backgroundColor: '#FFF0F3', borderColor: '#FF4D6D' },
  chipText: { color: '#5F586A', fontSize: 14, fontWeight: '700' },
  chipTextActive: { color: '#FF4D6D' },
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
  createButton: { height: 56, borderRadius: 28, backgroundColor: '#FF4D6D', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 4px 10px rgba(255, 77, 109, 0.3)', elevation: 5 },
  createButtonDisabled: { backgroundColor: '#FFB3C1', elevation: 0, boxShadow: 'none' },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
