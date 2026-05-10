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

export const saveUserProfileAsync = async (profileData: any) => {
  if (!auth.currentUser) throw new Error('No user logged in');
  const uid = auth.currentUser.uid;

  console.log("[Supabase] Saving profile metadata...");
  
  const { photoUrls, ...metadata } = profileData;

  // 1. Save metadata to profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: uid, // Use Firebase UID as the profile ID
      ...metadata,
      email: auth.currentUser.email ?? null,
      updated_at: new Date().toISOString(),
      completed_onboarding: true,
    });

  if (profileError) {
    console.error('Error saving profile:', profileError);
    throw profileError;
  }

  // 2. Save each photo to profile_photos table
  if (photoUrls && photoUrls.length > 0) {
    console.log(`[Supabase] Saving ${photoUrls.length} photos...`);
    
    // First, delete existing photos for this user to avoid duplicates if they re-upload
    await supabase.from('profile_photos').delete().eq('user_id', uid);

    const photoPromises = photoUrls.map((base64: string, index: number) => {
      return supabase.from('profile_photos').insert({
        user_id: uid,
        base64_data: base64,
        index_order: index,
      });
    });
    
    await Promise.all(photoPromises);
  }
  
  console.log("[Supabase] All data saved successfully.");
};
