// GCS Bucket Test - Run this to check if bucket is accessible
// Test the GCS bucket connectivity and structure

const testGCSBucket = async () => {
  const bucketUrl = 'https://storage.googleapis.com/baby-birthday-photos';
  
  console.log('🔍 Testing GCS Bucket Access...');
  console.log(`Bucket URL: ${bucketUrl}`);
  
  // Test basic bucket access
  try {
    const response = await fetch(bucketUrl, { 
      method: 'HEAD',
      mode: 'cors'
    });
    
    console.log(`✅ Bucket Response Status: ${response.status}`);
    console.log(`✅ Bucket Response Type: ${response.type}`);
    
    if (response.ok) {
      console.log('✅ GCS Bucket is accessible!');
    } else {
      console.log('❌ GCS Bucket access failed');
    }
  } catch (error) {
    console.log('❌ GCS Bucket test failed:', error.message);
  }
  
  // Test specific photo paths
  const testPaths = [
    // Baby Journey test paths
    'baby-journey/newborn/photo1.jpg',
    'baby-journey/month_1/photo1.jpg',
    'baby-journey/month_2/photo1.jpg',
    
    // Best Photos test paths
    'best-photos/precious_smiles/photo1.jpg',
    'best-photos/first_steps/photo1.jpg',
    'best-photos/family_moments/photo1.jpg'
  ];
  
  console.log('\n🔍 Testing Photo Paths...');
  
  for (const path of testPaths) {
    const fullUrl = `${bucketUrl}/${path}`;
    try {
      const response = await fetch(fullUrl, { 
        method: 'HEAD',
        mode: 'cors'
      });
      
      if (response.ok) {
        console.log(`✅ Found: ${path}`);
      } else {
        console.log(`❌ Not found: ${path} (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`❌ Error checking: ${path} - ${error.message}`);
    }
  }
  
  console.log('\n📋 Expected Folder Structure:');
  console.log('baby-birthday-photos/');
  console.log('├── baby-journey/');
  console.log('│   ├── newborn/');
  console.log('│   │   ├── photo1.jpg');
  console.log('│   │   └── photo2.jpg');
  console.log('│   ├── month_1/');
  console.log('│   │   ├── photo1.jpg');
  console.log('│   │   └── photo2.jpg');
  console.log('│   └── ... (up to month_12)');
  console.log('└── best-photos/');
  console.log('    ├── precious_smiles/');
  console.log('    │   ├── photo1.jpg');
  console.log('    │   └── photo2.jpg');
  console.log('    └── ... (other categories)');
};

// Export for use in components
export { testGCSBucket };

// Auto-run test when imported
if (typeof window !== 'undefined') {
  console.log('🚀 Running GCS Bucket Test...');
  testGCSBucket();
}
