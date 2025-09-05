// Firebase configuration for Firestore (NoSQL DB) + Cloud Storage (Photos)
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Direct Firebase configuration - no environment variables needed
const firebaseConfig = {
  projectId: "kashvibirthday",
  apiKey: "AIzaSyBvOiCik6fJMrCrPhqFgKLx1w1w-7QJgV4",
  authDomain: "kashvibirthday.firebaseapp.com",
  storageBucket: "kashvibirthday.appspot.com",
  messagingSenderId: "279842866856",
  appId: "1:279842866856:web:61e61fb3a145b7045dbf8502c"
};

// Event and Birthday Details - hardcoded
export const eventDetails = {
  birthdayDate: "2025-09-24",
  eventDate: "2025-10-05",
  eventVenue: "Mythri Banquet Hall",
  eventAddress: "8350 N MacArthur Blvd Suite 190, Irving, TX 75063",
  eventTime: "6:30 PM"
};

console.log('� Initializing Firebase with hardcoded config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId
});

// Demo mode flag - always false since we have hardcoded config
export const isDemoMode = false;

// Initialize Firebase services
let app = null;
let db = null;
let storage = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  app = null;
  db = null;
  storage = null;
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
    db && storage) {
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