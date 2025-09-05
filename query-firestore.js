// Query Firestore documents script
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvOiCik6fJMrCrPhqFgKLx1w1w-7QJgV4",
  authDomain: "kashvibirthday.firebaseapp.com",
  projectId: "kashvibirthday",
  storageBucket: "kashvibirthday-photos",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg"
};

async function showFirestoreDocuments() {
  try {
    console.log('🔥 Connecting to Firestore Database...');
    console.log('📊 Project: kashvibirthday');
    console.log('=' * 80);
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Query RSVPs collection
    console.log('\n📝 RSVP DOCUMENTS:');
    console.log('=' * 50);
    
    const rsvpsQuery = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    const rsvpsSnapshot = await getDocs(rsvpsQuery);
    
    if (rsvpsSnapshot.empty) {
      console.log('❌ No RSVP documents found');
    } else {
      console.log(`✅ Found ${rsvpsSnapshot.size} RSVP document(s):\n`);
      
      rsvpsSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`📋 RSVP #${index + 1} (ID: ${doc.id})`);
        console.log(`   👤 Name: ${data.name || 'N/A'}`);
        console.log(`   📱 Mobile: ${data.mobile || 'N/A'}`);
        console.log(`   👥 Adults: ${data.adultCount || data.adults || 'N/A'}`);
        console.log(`   👶 Children: ${data.childrenCount || (data.children ? data.children.length : 'N/A')}`);
        console.log(`   🎉 Attending: ${data.attending || 'N/A'}`);
        console.log(`   💬 Message: ${data.message || 'N/A'}`);
        console.log(`   📅 Created: ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A'}`);
        console.log('   ' + '-'.repeat(40));
      });
    }
    
    // Query Messages collection
    console.log('\n💌 MESSAGE DOCUMENTS:');
    console.log('=' * 50);
    
    const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const messagesSnapshot = await getDocs(messagesQuery);
    
    if (messagesSnapshot.empty) {
      console.log('❌ No message documents found');
    } else {
      console.log(`✅ Found ${messagesSnapshot.size} message document(s):\n`);
      
      messagesSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`💌 Message #${index + 1} (ID: ${doc.id})`);
        console.log(`   👤 Name: ${data.name || 'N/A'}`);
        console.log(`   💬 Message: ${data.message || 'N/A'}`);
        console.log(`   📅 Created: ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A'}`);
        console.log('   ' + '-'.repeat(40));
      });
    }
    
    console.log('\n📊 SUMMARY:');
    console.log('=' * 30);
    console.log(`📝 Total RSVPs: ${rsvpsSnapshot.size}`);
    console.log(`💌 Total Messages: ${messagesSnapshot.size}`);
    console.log(`🎉 Database Status: Connected and accessible`);
    
  } catch (error) {
    console.error('❌ Error querying Firestore:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

showFirestoreDocuments();
