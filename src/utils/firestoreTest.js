// Firestore connectivity test
import { rsvpService, messagesService } from '../services/firestoreService';
import { isDemoMode } from '../firebase';

export const firestoreConnectivityTest = async () => {
  console.log('🧪 Starting Firestore Connectivity Test...');
  console.log('📊 Mode:', isDemoMode ? 'Demo Mode' : 'Live Firebase');
  
  const results = {
    mode: isDemoMode ? 'demo' : 'firebase',
    tests: [],
    success: true,
    errors: []
  };

  try {
    // Test 1: Read RSVPs
    console.log('📝 Test 1: Reading RSVPs...');
    const rsvps = await rsvpService.getRSVPs();
    results.tests.push({
      name: 'Read RSVPs',
      status: 'passed',
      data: `Found ${rsvps.length} RSVPs`
    });
    console.log('✅ RSVPs read successfully:', rsvps.length, 'items');

    // Test 2: Create test RSVP
    console.log('📝 Test 2: Creating test RSVP...');
    const testRSVP = {
      name: 'Test User - ' + new Date().toLocaleTimeString(),
      mobile: '+1-555-TEST',
      adultCount: 2,
      childrenCount: 1,
      message: 'This is a connectivity test RSVP',
      attending: 'yes'
    };
    
    const createdRSVP = await rsvpService.createRSVP(testRSVP);
    results.tests.push({
      name: 'Create RSVP',
      status: 'passed',
      data: `Created RSVP with ID: ${createdRSVP.id}`
    });
    console.log('✅ RSVP created successfully:', createdRSVP.id);

    // Test 3: Read messages
    console.log('📝 Test 3: Reading messages...');
    const messages = await messagesService.getMessages();
    results.tests.push({
      name: 'Read Messages',
      status: 'passed',
      data: `Found ${messages.length} messages`
    });
    console.log('✅ Messages read successfully:', messages.length, 'items');

    // Test 4: Create test message
    console.log('📝 Test 4: Creating test message...');
    const testMessage = {
      name: 'Test Message Sender - ' + new Date().toLocaleTimeString(),
      message: 'This is a connectivity test message for Kashvi!'
    };
    
    const createdMessage = await messagesService.createMessage(testMessage);
    results.tests.push({
      name: 'Create Message',
      status: 'passed',
      data: `Created message with ID: ${createdMessage.id}`
    });
    console.log('✅ Message created successfully:', createdMessage.id);

    // Test 5: Delete test data (cleanup)
    if (!isDemoMode) {
      console.log('📝 Test 5: Cleaning up test data...');
      try {
        await rsvpService.deleteRSVP(createdRSVP.id);
        await messagesService.deleteMessage(createdMessage.id);
        results.tests.push({
          name: 'Cleanup Test Data',
          status: 'passed',
          data: 'Test data cleaned up successfully'
        });
        console.log('✅ Test data cleaned up');
      } catch (cleanupError) {
        results.tests.push({
          name: 'Cleanup Test Data',
          status: 'warning',
          data: 'Cleanup failed but main tests passed'
        });
        console.warn('⚠️ Cleanup failed:', cleanupError.message);
      }
    } else {
      results.tests.push({
        name: 'Cleanup Test Data',
        status: 'skipped',
        data: 'Skipped in demo mode'
      });
      console.log('ℹ️ Cleanup skipped in demo mode');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    results.success = false;
    results.errors.push(error.message);
    results.tests.push({
      name: 'General Test',
      status: 'failed',
      data: error.message
    });
  }

  // Summary
  console.log('🎯 Test Summary:');
  console.log('Mode:', results.mode);
  console.log('Overall Success:', results.success);
  console.log('Tests Passed:', results.tests.filter(t => t.status === 'passed').length);
  console.log('Tests Failed:', results.tests.filter(t => t.status === 'failed').length);
  console.log('Tests Skipped:', results.tests.filter(t => t.status === 'skipped').length);
  
  return results;
};

export default firestoreConnectivityTest;
