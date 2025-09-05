// Firebase configuration for Firestore (NoSQL DB) + Cloud Storage (Photos)
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Enhanced validation for Cloud Run environment
const validateFirebaseConfig = () => {
  const requiredEnvVars = [
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_APP_ID'
  ];
  
  const missingVars = requiredEnvVars.filter(envVar => 
    !process.env[envVar] || 
    process.env[envVar] === 'default-key' ||
    process.env[envVar] === 'your-api-key' ||
    process.env[envVar] === 'your-app-id' ||
    process.env[envVar] === 'your-project-id'
  );
  
  if (missingVars.length > 0) {
    console.warn('Missing Firebase environment variables:', missingVars);
    return false;
  }
  
  return true;
};

// Check if we have valid Firebase credentials
const hasValidCredentials = validateFirebaseConfig();

// Demo mode flag - set early and export immediately
export const isDemoMode = !hasValidCredentials;

// Initialize Firebase services safely
let app = null;
let db = null;
let storage = null;

// Only initialize Firebase if we have valid credentials
if (hasValidCredentials) {
  try {
    // Build Firebase config with fallbacks for Cloud Run
    const firebaseConfig = {
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    console.log('🔥 Initializing Firebase with config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      storageBucket: firebaseConfig.storageBucket,
      hasApiKey: !!firebaseConfig.apiKey,
      hasAppId: !!firebaseConfig.appId
    });

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log('✅ Firebase initialized successfully for Cloud Run');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    app = null;
    db = null;
    storage = null;
  }
} else {
  console.warn('⚠️ Running in demo mode - Firebase services disabled');
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
    hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
    hasAppId: !!process.env.REACT_APP_FIREBASE_APP_ID
  });
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