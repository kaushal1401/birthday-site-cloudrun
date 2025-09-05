// Firebase Test Utility
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const testFirestoreConnection = async () => {
  try {
    console.log('🔥 Testing Firestore connection...');
    console.log('DB object:', db);
    console.log('DB available:', !!db);

    if (!db) {
      console.error('❌ Firestore database is null - Firebase not initialized properly');
      return false;
    }

    // Try to create a test document
    const testDocRef = doc(db, 'test', 'connection-test');
    await setDoc(testDocRef, {
      message: 'Firebase connection test',
      timestamp: new Date().toISOString(),
      testId: Math.random().toString(36).substr(2, 9)
    });

    console.log('✅ Test document created successfully');

    // Try to read it back
    const testDoc = await getDoc(testDocRef);
    if (testDoc.exists()) {
      console.log('✅ Test document read successfully:', testDoc.data());
      return true;
    } else {
      console.error('❌ Test document not found after creation');
      return false;
    }
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    return false;
  }
};

// Call this to test the connection
export const runFirebaseTest = () => {
  console.log('Starting Firebase test...');
  testFirestoreConnection().then(result => {
    console.log('Firebase test result:', result ? 'SUCCESS' : 'FAILED');
  });
};
