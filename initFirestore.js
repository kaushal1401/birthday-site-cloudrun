// Node.js script to initialize Firestore collections
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// For local development without service account key
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Initialize Firebase Admin (for local testing)
const app = initializeApp({
  projectId: 'kashvibirthday'
});

const db = getFirestore(app);

async function initializeCollections() {
  try {
    console.log('Creating Firestore collections...');
    
    // Create a sample RSVP
    const rsvpRef = await db.collection('rsvps').add({
      name: 'Sample Guest',
      mobile: '123-456-7890',
      adultCount: 2,
      children: [
        { name: 'Child 1', age: 8 },
        { name: 'Child 2', age: 5 }
      ],
      message: 'Looking forward to celebrating!',
      attending: 'yes',
      createdAt: new Date()
    });
    console.log('Sample RSVP created with ID:', rsvpRef.id);

    // Create a sample message
    const messageRef = await db.collection('messages').add({
      name: 'Sample User',
      message: 'Happy Birthday! Can\'t wait to celebrate with you!',
      guestType: 'adult',
      createdAt: new Date()
    });
    console.log('Sample message created with ID:', messageRef.id);

    console.log('✅ Firestore collections initialized successfully!');
    console.log('Collections created:');
    console.log('  - rsvps (for RSVP submissions)');
    console.log('  - messages (for guest messages)');
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error initializing collections:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeCollections();
