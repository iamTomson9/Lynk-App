import { supabase } from './supabase';
import { auth } from '../firebaseConfig'; // We still use Firebase auth to get the current UID

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const validateImageSize = (fileSizeBytes?: number): string | null => {
  if (!fileSizeBytes) return null;
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(1);
    return `Image is ${sizeMB}MB. Please choose a photo under 5MB.`;
  }
  return null;
};

/**
 * Resolves a Firebase UID (text) to the Supabase profiles.id (uuid).
 * All foreign keys in the database reference profiles.id, so this helper
 * must be used whenever the code needs to write to club_members,
 * club_messages, profile_photos, etc.
 */
export const getSupabaseProfileId = async (firebaseUid?: string): Promise<string | null> => {
  const uid = firebaseUid ?? auth.currentUser?.uid;
  if (!uid) return null;

  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .single();

  return data?.id ?? null;
};

export const saveUserProfileAsync = async (profileData: any) => {
  if (!auth.currentUser) throw new Error('No user logged in');
  const uid = auth.currentUser.uid;

  console.log("[Supabase] Saving profile metadata...");
  
  const { photoUrls, ...metadata } = profileData;

  // Map camelCase fields to snake_case for Supabase
  const supabaseMetadata: Record<string, any> = {
    full_name: metadata.fullName,
    display_name: metadata.displayName,
    date_of_birth: new Date(new Date().getFullYear() - (metadata.age || 21), 0, 1).toISOString().split('T')[0],
    gender: metadata.gender,
    intent: metadata.intent,
    bio: metadata.bio ?? '',
    interests: metadata.interests ?? [],
    hobbies: metadata.hobbies ?? [],
    occupation: metadata.occupation ?? 'Student',
    discovery_radius_km: metadata.discoveryRadiusKm ?? 25,
    preferred_genders: metadata.preferredGenders ?? [],
    preferred_min_age: metadata.preferredMinAge ?? 18,
    preferred_max_age: metadata.preferredMaxAge ?? 30,
    sexual_orientation: metadata.sexualOrientation ?? null,
    email: auth.currentUser.email ?? null,
    updated_at: new Date().toISOString(),
    is_profile_complete: true,
  };

  // Only include relationship_goal if it's a valid enum value
  if (metadata.relationshipGoal && ['relationship', 'casual', 'unsure', 'prefer_not_to_say'].includes(metadata.relationshipGoal)) {
    supabaseMetadata.relationship_goal = metadata.relationshipGoal;
  }

  // Check if a profile already exists for this Firebase user
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .single();

  let profileError;
  let profileId: string;

  if (existing) {
    // Update existing profile
    profileId = existing.id;
    const { error } = await supabase
      .from('profiles')
      .update(supabaseMetadata)
      .eq('id', existing.id);
    profileError = error;
  } else {
    // Insert new profile — let Supabase generate the UUID id
    const { data: newRow, error } = await supabase
      .from('profiles')
      .insert({
        user_id: uid,
        ...supabaseMetadata,
      })
      .select('id')
      .single();
    profileError = error;
    profileId = newRow?.id;
  }

  if (profileError) {
    console.error('Error saving profile:', profileError);
    throw profileError;
  }

  // 2. Save each photo to profile_photos table (uses the real Supabase UUID)
  if (photoUrls && photoUrls.length > 0 && profileId) {
    console.log(`[Supabase] Saving ${photoUrls.length} photos...`);
    
    // First, delete existing photos for this user to avoid duplicates if they re-upload
    await supabase.from('profile_photos').delete().eq('profile_id', profileId);

    const photoPromises = photoUrls.map((base64: string, index: number) => {
      return supabase.from('profile_photos').insert({
        profile_id: profileId,
        storage_path: base64,
        sort_order: index,
      });
    });
    
    await Promise.all(photoPromises);
  }
  
  console.log("[Supabase] All data saved successfully.");
};
