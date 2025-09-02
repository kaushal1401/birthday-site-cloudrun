// Script to initialize Firestore collections
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvOiCik6fJMrCrPhqFgKLx1w1w-7QJgV4",
  authDomain: "kashvibirthday.firebaseapp.com",
  projectId: "kashvibirthday",
  storageBucket: "kashvibirthday-photos",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeCollections() {
  try {
    console.log('Creating Firestore collections...');
    
    // Create a sample RSVP
    const rsvpRef = await addDoc(collection(db, 'rsvps'), {
      name: 'Sample Guest',
      mobile: '123-456-7890',
      adultCount: 2,
      children: [
        { name: 'Child 1', age: 8 },
        { name: 'Child 2', age: 5 }
      ],
      message: 'Looking forward to celebrating!',
      attending: 'yes',
      createdAt: serverTimestamp()
    });
    console.log('Sample RSVP created with ID:', rsvpRef.id);

    // Create a sample message
    const messageRef = await addDoc(collection(db, 'messages'), {
      name: 'Sample User',
      message: 'Happy Birthday! Can\'t wait to celebrate with you!',
      guestType: 'adult',
      createdAt: serverTimestamp()
    });
    console.log('Sample message created with ID:', messageRef.id);

    console.log('✅ Firestore collections initialized successfully!');
    console.log('Collections created:');
    console.log('  - rsvps (for RSVP submissions)');
    console.log('  - messages (for guest messages)');
    
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
}

// Run the initialization
initializeCollections();
