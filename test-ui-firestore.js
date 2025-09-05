// UI Testing Script for RSVP Form and Firestore Integration
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');

// Test the exact same configuration that the React app should be using
const envConfig = {
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'kashvibirthday',
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyBvOiCik6fJMrCrPhqFgKLx1w1w-7QJgV4',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'kashvibirthday.firebaseapp.com',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'kashvibirthday-photos',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:abcdefg'
};

// Test validation logic (same as React app)
function testValidationLogic() {
  console.log('🧪 TESTING FIREBASE VALIDATION LOGIC');
  console.log('=' * 50);
  
  console.log('Environment Variables:');
  console.log(`  REACT_APP_FIREBASE_PROJECT_ID: "${process.env.REACT_APP_FIREBASE_PROJECT_ID || 'undefined'}"`);
  console.log(`  REACT_APP_FIREBASE_API_KEY: "${process.env.REACT_APP_FIREBASE_API_KEY || 'undefined'}"`);
  console.log(`  REACT_APP_FIREBASE_APP_ID: "${process.env.REACT_APP_FIREBASE_APP_ID || 'undefined'}"`);
  
  const hasValidCredentials = 
    process.env.REACT_APP_FIREBASE_API_KEY && 
    process.env.REACT_APP_FIREBASE_API_KEY !== 'default-key' &&
    process.env.REACT_APP_FIREBASE_API_KEY !== 'your-api-key' &&
    process.env.REACT_APP_FIREBASE_APP_ID &&
    process.env.REACT_APP_FIREBASE_APP_ID !== '1:123456789:web:abcdef' &&
    process.env.REACT_APP_FIREBASE_APP_ID !== 'your-app-id' &&
    process.env.REACT_APP_FIREBASE_PROJECT_ID &&
    process.env.REACT_APP_FIREBASE_PROJECT_ID !== 'your-project-id';
  
  const isDemoMode = !hasValidCredentials;
  
  console.log(`\n🎯 Validation Results:`);
  console.log(`  hasValidCredentials: ${hasValidCredentials}`);
  console.log(`  isDemoMode: ${isDemoMode}`);
  
  if (isDemoMode) {
    console.log('❌ PROBLEM: App will run in demo mode - no real Firestore saving!');
    return false;
  } else {
    console.log('✅ SUCCESS: App should connect to real Firestore!');
    return true;
  }
}

async function testFirestoreConnection() {
  console.log('\n🔥 TESTING FIRESTORE CONNECTION');
  console.log('=' * 50);
  
  try {
    const app = initializeApp(envConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase app initialized successfully');
    
    // Test reading existing data
    const rsvpsQuery = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    const rsvpsSnapshot = await getDocs(rsvpsQuery);
    console.log(`✅ Successfully read ${rsvpsSnapshot.size} RSVP documents`);
    
    const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const messagesSnapshot = await getDocs(messagesQuery);
    console.log(`✅ Successfully read ${messagesSnapshot.size} message documents`);
    
    return true;
  } catch (error) {
    console.log('❌ Firestore connection failed:', error.message);
    return false;
  }
}

function generateUITestSteps() {
  console.log('\n📝 UI TESTING STEPS FOR WEBSITE');
  console.log('=' * 50);
  console.log('1. Open http://localhost:3000 in browser');
  console.log('2. Check browser console - should NOT show "Demo mode" message');
  console.log('3. Click the floating "RSVP" button (bottom-left)');
  console.log('4. Fill out the RSVP form:');
  console.log('   - Name: "UI Test User"');
  console.log('   - Mobile: "+1-555-UITEST"');
  console.log('   - Attending: Yes');
  console.log('   - Adults: 2');
  console.log('   - Children: 1');
  console.log('   - Message: "Testing UI to Firestore connection"');
  console.log('5. Click "Submit RSVP" button');
  console.log('6. Should see success message: "RSVP submitted successfully!"');
  console.log('7. Check browser console for any errors');
  console.log('8. Run: node query-firestore.js');
  console.log('9. Verify new RSVP appears in database with "UI Test User"');
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   ✅ Form submits without errors');
  console.log('   ✅ Success message appears');
  console.log('   ✅ New document appears in Firestore');
  console.log('   ❌ NO "Demo mode" messages in console');
}

async function runFullTest() {
  console.log('🎪 KASHVI BIRTHDAY SITE - FIREBASE UI TEST');
  console.log('=' * 60);
  
  // Test 1: Environment validation
  const validationPassed = testValidationLogic();
  
  // Test 2: Firestore connection
  const connectionPassed = await testFirestoreConnection();
  
  // Test 3: UI test instructions
  generateUITestSteps();
  
  console.log('\n📊 TEST SUMMARY');
  console.log('=' * 30);
  console.log(`🔧 Environment Validation: ${validationPassed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔥 Firestore Connection: ${connectionPassed ? '✅ PASS' : '❌ FAIL'}`);
  
  if (validationPassed && connectionPassed) {
    console.log('\n🎉 ALL BACKEND TESTS PASSED! UI should work correctly.');
    console.log('🚀 The RSVP form should now save to real Firestore database!');
  } else {
    console.log('\n❌ ISSUES DETECTED! Fix these before testing UI:');
    if (!validationPassed) console.log('   - Environment variables need fixing');
    if (!connectionPassed) console.log('   - Firestore connection issues');
  }
}

// Load environment from .env file (simulate React app environment loading)
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && key.startsWith('REACT_APP_')) {
      process.env[key] = value;
    }
  });
  console.log('📁 Loaded environment variables from .env file');
} else {
  console.log('⚠️ No .env file found');
}

runFullTest();
