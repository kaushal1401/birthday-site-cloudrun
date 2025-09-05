// Test GCS connectivity and bucket status
import { GCS_CONFIG, generatePhotoUrl } from '../config/gcsConfig';

// Test if a photo URL is accessible
export const testPhotoUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
    return {
      accessible: response.ok,
      status: response.status,
      url: url
    };
  } catch (error) {
    return {
      accessible: false,
      error: error.message,
      url: url
    };
  }
};

// Test bucket accessibility
export const testBucketAccess = async () => {
  console.log('🔍 Testing GCS Bucket Access...');
  console.log(`📂 Bucket: ${GCS_CONFIG.bucketName}`);
  console.log(`🌐 Base URL: ${GCS_CONFIG.baseUrl}`);
  
  try {
    const response = await fetch(GCS_CONFIG.baseUrl, { 
      method: 'HEAD', 
      mode: 'cors' 
    });
    
    if (response.ok) {
      console.log('✅ GCS Bucket is accessible!');
      return true;
    } else {
      console.log(`❌ GCS Bucket access failed (Status: ${response.status})`);
      return false;
    }
  } catch (error) {
    console.log('❌ GCS Bucket test failed:', error.message);
    console.log('💡 This might be due to CORS policy or bucket configuration');
    return false;
  }
};

// Test multiple sample photos with expected folder structure
export const testGCSConnectivity = async () => {
  console.log('\n🚀 === GCS CONNECTIVITY TEST ===');
  
  // Test bucket access first
  const bucketAccessible = await testBucketAccess();
  
  console.log('\n📋 Expected Folder Structure:');
  console.log('baby-birthday-photos/');
  console.log('├── baby-journey/');
  console.log('│   ├── newborn/ → photo1.jpg, photo2.jpg');
  console.log('│   ├── month_1/ → photo1.jpg, photo2.jpg');
  console.log('│   ├── month_2/ → photo1.jpg, photo2.jpg');
  console.log('│   └── ... (up to month_12)');
  console.log('└── best-photos/');
  console.log('    ├── precious_smiles/ → photo1.jpg, photo2.jpg');
  console.log('    ├── first_steps/ → photo1.jpg, photo2.jpg');
  console.log('    ├── family_moments/ → photo1.jpg, photo2.jpg');
  console.log('    ├── milestone_celebrations/ → photo1.jpg, photo2.jpg');
  console.log('    ├── adorable_poses/ → photo1.jpg, photo2.jpg');
  console.log('    └── sweet_dreams/ → photo1.jpg, photo2.jpg');
  
  console.log('\n🔍 Testing Sample Photo URLs...');
  
  const testUrls = [
    // Baby Journey samples
    `${GCS_CONFIG.baseUrl}/baby-journey/newborn/photo1.jpg`,
    `${GCS_CONFIG.baseUrl}/baby-journey/month_1/photo1.jpg`,
    `${GCS_CONFIG.baseUrl}/baby-journey/month_2/photo1.jpg`,
    
    // Best Photos samples
    `${GCS_CONFIG.baseUrl}/best-photos/precious_smiles/photo1.jpg`,
    `${GCS_CONFIG.baseUrl}/best-photos/first_steps/photo1.jpg`,
    `${GCS_CONFIG.baseUrl}/best-photos/family_moments/photo1.jpg`
  ];
  
  let foundPhotos = 0;
  for (const url of testUrls) {
    const result = await testPhotoUrl(url);
    const status = result.accessible ? '✅ FOUND' : '❌ NOT FOUND';
    console.log(`${status}: ${url.replace(GCS_CONFIG.baseUrl + '/', '')}`);
    if (result.accessible) foundPhotos++;
  }
  
  console.log(`\n📊 Summary: ${foundPhotos}/${testUrls.length} sample photos found`);
  
  if (foundPhotos === 0) {
    console.log('\n💡 TO UPLOAD PHOTOS:');
    console.log('1. Go to Google Cloud Console');
    console.log('2. Navigate to Cloud Storage');
    console.log('3. Find your bucket: baby-birthday-photos');
    console.log('4. Create the folder structure shown above');
    console.log('5. Upload photos with names: photo1.jpg, photo2.jpg');
    console.log('\n🔧 Bucket Permissions:');
    console.log('- Make sure bucket allows public read access');
    console.log('- Or configure CORS for your domain');
  }
  
  return { bucketAccessible, foundPhotos, totalTested: testUrls.length };
};

// Auto-run test when this file is imported
console.log('🚀 Running GCS connectivity test...');
testGCSConnectivity();

// Manual test function you can call from browser console
window.testGCS = testGCSConnectivity;
window.testBucket = testBucketAccess;

const gcsTestUtils = { testPhotoUrl, testGCSConnectivity, testBucketAccess };
export default gcsTestUtils;
