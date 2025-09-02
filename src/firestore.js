// Browser-compatible Firestore configuration for Cloud Run deployment
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration for Firestore and Storage
const firebaseConfig = {
  projectId: process.env.REACT_APP_PROJECT_ID || 'kashvibirthday',
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || 'kashvibirthday.appspot.com',
  // We only need projectId for Firestore and storageBucket for Storage
};

console.log('Initializing Firebase with project:', firebaseConfig.projectId);

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Connect to emulators if in development mode
if (process.env.REACT_APP_USE_FIRESTORE_EMULATOR === 'true' && 
    process.env.NODE_ENV === 'development') {
  const emulatorHost = process.env.REACT_APP_FIRESTORE_EMULATOR_HOST || 'localhost:8080';
  const [host, port] = emulatorHost.split(':');
  
  try {
    connectFirestoreEmulator(db, host, parseInt(port));
    connectStorageEmulator(storage, host, 9199); // Default storage emulator port
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.log('Firebase emulator connection failed or already connected:', error.message);
  }
} else {
  console.log('Using production Firebase with project:', firebaseConfig.projectId);
}

// Collection names
export const COLLECTIONS = {
  RSVPS: process.env.REACT_APP_FIRESTORE_COLLECTION_RSVPS || 'rsvps',
  MESSAGES: process.env.REACT_APP_FIRESTORE_COLLECTION_MESSAGES || 'messages'
};

// Storage bucket configuration
export const STORAGE_PATHS = {
  PHOTOS: 'baby-journey-photos/', // Path for baby journey photos
  GALLERY: 'gallery/', // Path for additional gallery photos
};

// Export the database and storage instances
export default db;
