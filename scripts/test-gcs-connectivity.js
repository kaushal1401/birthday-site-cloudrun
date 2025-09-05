// Standalone GCS Connectivity Test Script
const https = require('https');
const { URL } = require('url');

// Configuration matching your app
const GCS_CONFIG = {
  bucketName: 'baby-birthday-photos',
  baseUrl: 'https://storage.googleapis.com/baby-birthday-photos',
  
  photoStructure: {
    babyJourney: {
      path: 'baby-journey',
      months: [
        { key: 'newborn', name: 'Newborn' },
        { key: 'month_1', name: 'Month 1' },
        { key: 'month_2', name: 'Month 2' },
        { key: 'month_3', name: 'Month 3' }
      ]
    },
    bestPhotos: {
      path: 'best-photos',
      categories: [
        { key: 'precious_smiles', name: 'Precious Smiles' },
        { key: 'first_steps', name: 'First Steps' },
        { key: 'family_moments', name: 'Family Moments' },
        { key: 'milestone_celebrations', name: 'Milestone Celebrations' }
      ]
    }
  }
};

// Generate photo URL
function generatePhotoUrl(category, subcategory, photoIndex) {
  const { baseUrl, photoStructure } = GCS_CONFIG;
  let path;
  
  if (category === 'babyJourney') {
    const monthData = photoStructure.babyJourney.months.find(m => m.name === subcategory);
    path = `${photoStructure.babyJourney.path}/${monthData?.key || subcategory.toLowerCase().replace(' ', '_')}`;
  } else if (category === 'bestPhotos') {
    const categoryData = photoStructure.bestPhotos.categories.find(c => c.name === subcategory);
    path = `${photoStructure.bestPhotos.path}/${categoryData?.key || subcategory.toLowerCase().replace(' ', '_')}`;
  }
  
  return `${baseUrl}/${path}/photo_${photoIndex}.jpg`;
}

// Test URL accessibility
function testUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'HEAD',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      resolve({
        url: url,
        status: res.statusCode,
        statusText: res.statusMessage,
        accessible: res.statusCode === 200,
        headers: {
          'content-type': res.headers['content-type'],
          'content-length': res.headers['content-length'],
          'last-modified': res.headers['last-modified']
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        url: url,
        status: 0,
        statusText: err.message,
        accessible: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: url,
        status: 0,
        statusText: 'Timeout',
        accessible: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

// Test bucket accessibility
async function testBucketAccess() {
  console.log('🔍 Testing GCS Bucket Access...');
  console.log('=' .repeat(50));
  console.log('Bucket Name:', GCS_CONFIG.bucketName);
  console.log('Base URL:', GCS_CONFIG.baseUrl);
  console.log('');

  // Test bucket root
  console.log('Testing bucket root access...');
  const bucketTest = await testUrl(GCS_CONFIG.baseUrl);
  console.log('Bucket Root:', bucketTest.accessible ? '✅ Accessible' : '❌ Not Accessible');
  console.log('Status:', bucketTest.status, bucketTest.statusText);
  console.log('');

  return bucketTest.accessible;
}

// Test sample photo URLs
async function testSamplePhotos() {
  console.log('🖼️  Testing Sample Photo URLs...');
  console.log('=' .repeat(50));

  const testUrls = [
    // Baby Journey photos
    generatePhotoUrl('babyJourney', 'Newborn', 1),
    generatePhotoUrl('babyJourney', 'Month 1', 1),
    generatePhotoUrl('babyJourney', 'Month 2', 1),
    
    // Best Photos
    generatePhotoUrl('bestPhotos', 'Precious Smiles', 1),
    generatePhotoUrl('bestPhotos', 'First Steps', 1),
    generatePhotoUrl('bestPhotos', 'Family Moments', 1)
  ];

  let accessibleCount = 0;
  let totalCount = testUrls.length;

  for (const url of testUrls) {
    console.log('Testing:', url);
    const result = await testUrl(url);
    
    if (result.accessible) {
      console.log('✅ Accessible - Size:', result.headers['content-length'] || 'Unknown');
      accessibleCount++;
    } else {
      console.log('❌ Not Accessible - Status:', result.status, result.statusText);
    }
    console.log('');
  }

  console.log('📊 Summary:');
  console.log(`Accessible Photos: ${accessibleCount}/${totalCount}`);
  console.log(`Success Rate: ${((accessibleCount/totalCount) * 100).toFixed(1)}%`);
  
  return { accessible: accessibleCount, total: totalCount };
}

// Test folder structure
async function testFolderStructure() {
  console.log('📁 Testing Folder Structure...');
  console.log('=' .repeat(50));

  const folders = [
    `${GCS_CONFIG.baseUrl}/baby-journey/newborn/`,
    `${GCS_CONFIG.baseUrl}/baby-journey/month_1/`,
    `${GCS_CONFIG.baseUrl}/best-photos/precious_smiles/`,
    `${GCS_CONFIG.baseUrl}/best-photos/family_moments/`
  ];

  for (const folder of folders) {
    console.log('Testing folder:', folder);
    const result = await testUrl(folder);
    console.log(result.accessible ? '✅ Accessible' : '❌ Not Accessible');
    console.log('');
  }
}

// Main test function
async function runConnectivityTest() {
  console.log('🎂 GCS Connectivity Test for Kashvi\'s Birthday Site');
  console.log('═' .repeat(60));
  console.log('');

  try {
    // Test bucket access
    const bucketAccessible = await testBucketAccess();
    
    if (!bucketAccessible) {
      console.log('⚠️  Bucket not accessible. Please check:');
      console.log('1. Bucket exists: gsutil ls gs://baby-birthday-photos');
      console.log('2. Bucket is public: gsutil iam get gs://baby-birthday-photos');
      console.log('3. Run setup script: .\\scripts\\setup-bucket.ps1');
      console.log('');
    }

    // Test folder structure
    await testFolderStructure();

    // Test sample photos
    const photoResults = await testSamplePhotos();

    console.log('');
    console.log('🎯 Recommendations:');
    console.log('');

    if (photoResults.accessible === 0) {
      console.log('❌ No photos found. To upload photos:');
      console.log('1. Run: gsutil cp your-photo.jpg gs://baby-birthday-photos/baby-journey/newborn/photo_1.jpg');
      console.log('2. Run: gsutil cp family-photo.jpg gs://baby-birthday-photos/best-photos/family_moments/photo_1.jpg');
    } else if (photoResults.accessible < photoResults.total) {
      console.log('⚠️  Some photos missing. Upload more photos to complete the gallery.');
    } else {
      console.log('✅ All sample photos accessible! Your site is ready.');
    }

    console.log('');
    console.log('📋 Quick Upload Commands:');
    console.log('gsutil cp photo1.jpg gs://baby-birthday-photos/baby-journey/newborn/photo_1.jpg');
    console.log('gsutil cp photo2.jpg gs://baby-birthday-photos/baby-journey/month_1/photo_1.jpg');
    console.log('gsutil cp photo3.jpg gs://baby-birthday-photos/best-photos/precious_smiles/photo_1.jpg');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
runConnectivityTest();
