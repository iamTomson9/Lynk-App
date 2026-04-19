import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db, auth } from '../firebaseConfig';
import { Platform } from 'react-native';

/**
 * Converts a local image URI to a base64 data URL.
 * Used as a fallback on web where Firebase Storage has CORS restrictions.
 */
const uriToBase64DataUrl = (uri: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = () => reject(new TypeError('Network request failed while reading image'));
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

/**
 * Converts a local image URI into a Blob (used for native uploads).
 */
const uriToBlob = (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = () => reject(new TypeError('Network request failed while reading image'));
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

/**
 * Uploads an image to Firebase Storage (native) or returns a base64 data URL (web).
 * Returns a string URL that can be stored in Firestore and rendered in <Image />.
 */
export const uploadProfileImageAsync = async (uri: string, index: number): Promise<string> => {
  if (!auth.currentUser) throw new Error('No user logged in');

  // ── Web: Firebase Storage CORS blocks localhost uploads.
  //    We store a base64 data URL directly in Firestore instead.
  if (Platform.OS === 'web') {
    console.log(`[Upload] Web platform — converting image ${index} to base64...`);
    const dataUrl = await uriToBase64DataUrl(uri);
    console.log(`[Upload] Image ${index} converted successfully.`);
    return dataUrl; // caller stores this in Firestore
  }

  // ── Native (iOS / Android): use Firebase Storage as normal
  console.log(`[Upload] Native platform — uploading image ${index} to Firebase Storage...`);

  try {
    const blob = await uriToBlob(uri);

    const fileExtension = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
    const fileRef = ref(
      storage,
      `users/${auth.currentUser.uid}/profile_${index}_${Date.now()}.${fileExtension}`
    );

    const uploadTask = uploadBytesResumable(fileRef, blob, { contentType: mimeType });

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`[Upload] Image ${index}: ${Math.round(progress)}% uploaded`);
        },
        (error) => {
          console.error('[Upload] Firebase Storage error:', error.code, error.message, error);
          reject(error);
        },
        () => resolve()
      );
    });

    // Free blob memory
    // @ts-ignore
    if (blob.close) blob.close();

    const downloadUrl = await getDownloadURL(fileRef);
    console.log(`[Upload] Image ${index} uploaded to Storage. URL: ${downloadUrl}`);
    return downloadUrl;

  } catch (storageError: any) {
    // ── Fallback: if Storage upload fails (e.g. rules not configured),
    //    store as base64 in Firestore. Works on any platform.
    console.warn(
      `[Upload] Storage upload failed (${storageError?.code ?? 'unknown'}). ` +
      `Falling back to base64 encoding for image ${index}.`
    );
    const dataUrl = await uriToBase64DataUrl(uri);
    console.log(`[Upload] Image ${index} saved as base64 fallback.`);
    return dataUrl;
  }
};

/**
 * Saves the user's complete profile to Firestore.
 */
export const saveUserProfileAsync = async (profileData: any) => {
  if (!auth.currentUser) throw new Error('No user logged in');

  const userRef = doc(db, 'users', auth.currentUser.uid);

  await setDoc(
    userRef,
    {
      ...profileData,
      uid: auth.currentUser.uid,
      email: auth.currentUser.email ?? null,
      createdAt: new Date(),
      completedOnboarding: true,
    },
    { merge: true } // Don't overwrite existing fields we haven't touched
  );
};
