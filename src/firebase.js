// Firebase configuration for Firestore (NoSQL DB) + Cloud Storage (Photos)
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Check if we have valid Firebase credentials
const hasValidCredentials = 
  process.env.REACT_APP_FIREBASE_API_KEY && 
  process.env.REACT_APP_FIREBASE_API_KEY !== 'default-key' &&
  process.env.REACT_APP_FIREBASE_API_KEY !== 'your-api-key' &&
  process.env.REACT_APP_FIREBASE_APP_ID &&
  process.env.REACT_APP_FIREBASE_APP_ID !== '1:123456789:web:abcdef' &&
  process.env.REACT_APP_FIREBASE_APP_ID !== 'your-app-id' &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID !== 'your-project-id';

// Demo mode flag - set early and export immediately
export const isDemoMode = !hasValidCredentials;

// Initialize Firebase services safely
let app = null;
let db = null;
let storage = null;

// Only initialize Firebase if we have valid credentials
if (hasValidCredentials) {
  try {
    const firebaseConfig = {
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log('Firebase initialized successfully with real credentials');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    app = null;
    db = null;
    storage = null;
  }
} else {
  console.warn('⚠️ Running in demo mode - Firebase services disabled');
}

// Export the Firebase services (may be null in demo mode)
export { db, storage };

// Export the app instance
export default app;

// Storage paths for organizing photos
export const STORAGE_PATHS = {
  PHOTOS: 'baby-journey/',  // Main path for monthly photos
  BABY_JOURNEY: 'baby-journey/',
  MILESTONES: 'milestones/',
  FAMILY: 'family/',
  CELEBRATION: 'celebration/'
};

// For development/testing - connect to emulators if enabled
if (process.env.NODE_ENV === 'development' && 
    process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true' && 
    !isDemoMode && db && storage) {
  try {
    // Connect to emulators
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.log('Emulators already connected or not available');
  }
}

console.log('Firebase initialization complete:', {
  demoMode: isDemoMode,
  dbAvailable: !!db,
  storageAvailable: !!storage
});