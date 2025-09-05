// Upload Sample Photos Script
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Sample photo URLs from Unsplash (free to use)
const samplePhotos = {
  babyJourney: {
    newborn: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', // Newborn baby
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80', // Baby sleeping
    ],
    month_1: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', // 1 month baby
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80', // Baby smiling
    ],
    month_2: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80', // 2 month baby
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // Baby with toys
    ],
    month_3: [
      'https://images.unsplash.com/photo-1576242276175-0d5586e8bb82?w=800&q=80', // 3 month baby
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Baby playing
    ]
  },
  bestPhotos: {
    precious_smiles: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80', // Smiling baby
      'https://images.unsplash.com/photo-1544375951-6e4a999d62f2?w=800&q=80', // Happy baby
    ],
    first_steps: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80', // Baby crawling
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', // Baby standing
    ],
    family_moments: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', // Family with baby
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80', // Parent and baby
    ],
    milestone_celebrations: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // Birthday celebration
      'https://images.unsplash.com/photo-1576242276175-0d5586e8bb82?w=800&q=80', // Baby with balloons
    ]
  }
};

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Upload file to GCS
function uploadToGCS(localPath, gcsPath) {
  try {
    const command = `gsutil cp "${localPath}" "gs://baby-birthday-photos/${gcsPath}"`;
    console.log(`Uploading: ${gcsPath}`);
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Failed to upload ${gcsPath}:`, error.message);
    return false;
  }
}

// Main upload function
async function uploadSamplePhotos() {
  console.log('🎂 Uploading Sample Photos for Kashvi\'s Birthday Site');
  console.log('═'.repeat(60));
  
  // Create temp directory
  const tempDir = './temp_photos';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  let totalUploaded = 0;
  let totalAttempted = 0;
  
  try {
    // Upload Baby Journey photos
    console.log('\n📸 Uploading Baby Journey Photos...');
    for (const [month, urls] of Object.entries(samplePhotos.babyJourney)) {
      console.log(`\n👶 ${month.replace('_', ' ').toUpperCase()}:`);
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const filename = `photo_${i + 1}.jpg`;
        const localPath = path.join(tempDir, filename);
        const gcsPath = `baby-journey/${month}/${filename}`;
        
        totalAttempted++;
        
        try {
          console.log(`  Downloading ${filename}...`);
          await downloadImage(url, localPath);
          
          if (uploadToGCS(localPath, gcsPath)) {
            console.log(`  ✅ Uploaded ${filename}`);
            totalUploaded++;
          }
          
          // Clean up local file
          fs.unlinkSync(localPath);
          
        } catch (error) {
          console.log(`  ❌ Failed ${filename}: ${error.message}`);
        }
      }
    }
    
    // Upload Best Photos
    console.log('\n🌟 Uploading Best Photos...');
    for (const [category, urls] of Object.entries(samplePhotos.bestPhotos)) {
      console.log(`\n📷 ${category.replace('_', ' ').toUpperCase()}:`);
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const filename = `photo_${i + 1}.jpg`;
        const localPath = path.join(tempDir, filename);
        const gcsPath = `best-photos/${category}/${filename}`;
        
        totalAttempted++;
        
        try {
          console.log(`  Downloading ${filename}...`);
          await downloadImage(url, localPath);
          
          if (uploadToGCS(localPath, gcsPath)) {
            console.log(`  ✅ Uploaded ${filename}`);
            totalUploaded++;
          }
          
          // Clean up local file
          fs.unlinkSync(localPath);
          
        } catch (error) {
          console.log(`  ❌ Failed ${filename}: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('Upload process failed:', error);
  }
  
  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  console.log('\n📊 Upload Summary:');
  console.log(`Successfully uploaded: ${totalUploaded}/${totalAttempted} photos`);
  console.log(`Success rate: ${((totalUploaded/totalAttempted) * 100).toFixed(1)}%`);
  
  if (totalUploaded > 0) {
    console.log('\n🎉 Sample photos uploaded! You can now:');
    console.log('1. Test your website to see the photos');
    console.log('2. Replace with your original photos using the same paths');
    console.log('\n📋 Example replacement commands:');
    console.log('gsutil cp your-newborn-photo.jpg gs://baby-birthday-photos/baby-journey/newborn/photo_1.jpg');
    console.log('gsutil cp your-family-photo.jpg gs://baby-birthday-photos/best-photos/family_moments/photo_1.jpg');
  }
}

// Make bucket public readable
function makeBucketPublic() {
  try {
    console.log('🔓 Making bucket publicly readable...');
    execSync('gsutil iam ch allUsers:objectViewer gs://baby-birthday-photos', { stdio: 'pipe' });
    console.log('✅ Bucket is now publicly readable');
    return true;
  } catch (error) {
    console.error('❌ Failed to make bucket public:', error.message);
    console.log('You may need to run: gsutil iam ch allUsers:objectViewer gs://baby-birthday-photos');
    return false;
  }
}

// Run the upload
async function main() {
  console.log('🚀 Starting sample photo upload process...\n');
  
  // First make bucket public
  makeBucketPublic();
  
  // Then upload photos
  await uploadSamplePhotos();
  
  console.log('\n🔍 Running connectivity test...');
  // Run the connectivity test again
  try {
    execSync('node scripts/test-gcs-connectivity.js', { stdio: 'inherit' });
  } catch (error) {
    console.log('Test completed with some issues - check output above');
  }
}

main().catch(console.error);
