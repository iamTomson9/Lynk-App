import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace this with your actual Firebase configuration object
// You can find this in your Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyC0oAiI1dWADj4RpzDMHKExCd9F-4ufeFw",
  authDomain: "lynk-901be.firebaseapp.com",
  projectId: "lynk-901be",
  storageBucket: "lynk-901be.firebasestorage.app",
  messagingSenderId: "2136919909",
  appId: "1:2136919909:web:522c2d0bdd829ef03a1b8c",
  measurementId: "G-X3YHPXZSGS"
};

import { Platform } from 'react-native';

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase auth conditionally based on platform
let auth;
if (Platform.OS === 'web') {
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
} else {
  const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
