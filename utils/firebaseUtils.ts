import { doc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validates a file size against the 5MB limit.
 */
export const validateImageSize = (fileSizeBytes?: number): string | null => {
  if (!fileSizeBytes) return null;
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(1);
    return `Image is ${sizeMB}MB. Please choose a photo under 5MB.`;
  }
  return null;
};

/**
 * Saves the user's complete profile.
 * IMPORTANT: To stay under Firestore's 1MB limit, we store NO photos in the main document.
 * All photos are saved as individual documents in a sub-collection.
 */
export const saveUserProfileAsync = async (profileData: any) => {
  if (!auth.currentUser) throw new Error('No user logged in');
  const uid = auth.currentUser.uid;

  console.log("[Firebase] Saving profile metadata...");
  
  const { photoUrls, ...metadata } = profileData;

  // 1. Save metadata to main document (NO photos here)
  const userRef = doc(db, 'users', uid);
  await setDoc(
    userRef,
    {
      ...metadata,
      uid,
      email: auth.currentUser.email ?? null,
      createdAt: new Date(),
      completedOnboarding: true,
      photoUrls: [], // Keep this empty to avoid the 1MB error
    },
    { merge: true }
  );

  // 2. Save each photo to its own document in the sub-collection
  // This allows each photo to have its own 1MB limit.
  if (photoUrls && photoUrls.length > 0) {
    console.log(`[Firebase] Saving ${photoUrls.length} photos separately...`);
    const photoPromises = photoUrls.map((base64: string, index: number) => {
      const photoDocRef = doc(db, 'users', uid, 'photos', `photo_${index}`);
      return setDoc(photoDocRef, { 
        base64, 
        index, 
        uploadedAt: new Date() 
      });
    });
    await Promise.all(photoPromises);
  }
  console.log("[Firebase] All data saved successfully.");
};
