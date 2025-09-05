// Quick Firebase test script
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// The same config from .env
const firebaseConfig = {
  apiKey: "AIzaSyBvOiCik6fJMrCrPhqFgKLx1w1w-7QJgV4",
  authDomain: "kashvibirthday.firebaseapp.com",
  projectId: "kashvibirthday",
  storageBucket: "kashvibirthday-photos",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg"
};

async function testFirestore() {
  try {
    console.log('🔥 Testing Firebase Connection...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized');
    
    // Test read
    console.log('📖 Testing read from Firestore...');
    const snapshot = await getDocs(collection(db, 'rsvps'));
    console.log(`✅ Read successful: ${snapshot.size} RSVPs found`);
    
    // Test write
    console.log('✏️ Testing write to Firestore...');
    const testRSVP = {
      name: 'Connection Test - ' + new Date().toISOString(),
      mobile: '+1-555-TEST',
      adultCount: 1,
      childrenCount: 0,
      message: 'Testing connection',
      attending: 'yes',
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'rsvps'), testRSVP);
    console.log(`✅ Write successful: Document created with ID ${docRef.id}`);
    
    console.log('🎉 All tests passed! Firestore is working correctly.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testFirestore();
