// Upload sample photos to Google Cloud Storage
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: 'your-project-id', // Replace with your GCP project ID
  keyFilename: 'path/to/your/service-account-key.json' // Replace with your service account key
});

const bucketName = 'baby-birthday-photos';
const bucket = storage.bucket(bucketName);

// Photo categories structure
const photoStructure = {
  'baby-journey': [
    'newborn', 'month_1', 'month_2', 'month_3', 'month_4', 'month_5',
    'month_6', 'month_7', 'month_8', 'month_9', 'month_10', 'month_11', 'month_12'
  ],
  'best-photos': [
    'precious_smiles', 'first_steps', 'family_moments', 
    'milestone_celebrations', 'adorable_poses', 'sweet_dreams'
  ]
};

// Function to upload a file to GCS
async function uploadFile(localFilePath, destFileName) {
  try {
    const options = {
      destination: destFileName,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    };

    await bucket.upload(localFilePath, options);
    
    // Make the file publicly readable
    await bucket.file(destFileName).makePublic();
    
    console.log(`${localFilePath} uploaded to ${destFileName}`);
    return `https://storage.googleapis.com/${bucketName}/${destFileName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Function to create sample photos (placeholder images)
async function createSamplePhotos() {
  console.log('Creating sample photo structure in GCS...');
  
  // Create placeholder images for each category
  for (const [category, subcategories] of Object.entries(photoStructure)) {
    for (const subcategory of subcategories) {
      for (let i = 1; i <= 5; i++) {
        const fileName = `${category}/${subcategory}/photo_${i}.jpg`;
        
        // For now, we'll create placeholder text files
        // In production, you would upload actual image files
        const placeholderContent = `Placeholder photo ${i} for ${category}/${subcategory}`;
        const tempFile = path.join(__dirname, `temp_${category}_${subcategory}_${i}.txt`);
        
        fs.writeFileSync(tempFile, placeholderContent);
        
        try {
          await uploadFile(tempFile, fileName);
          fs.unlinkSync(tempFile); // Clean up temp file
        } catch (error) {
          console.error(`Error uploading ${fileName}:`, error);
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        }
      }
    }
  }
  
  console.log('Sample photos uploaded successfully!');
}

// Function to set bucket CORS policy for web access
async function setBucketCors() {
  const corsConfiguration = [
    {
      origin: ['*'],
      method: ['GET'],
      responseHeader: ['Content-Type'],
      maxAgeSeconds: 3600,
    },
  ];

  await bucket.setCorsConfiguration(corsConfiguration);
  console.log('CORS policy set for bucket');
}

// Main execution
async function main() {
  try {
    console.log('Setting up Google Cloud Storage for birthday photos...');
    
    // Set CORS policy
    await setBucketCors();
    
    // Upload sample photos
    await createSamplePhotos();
    
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  uploadFile,
  createSamplePhotos,
  setBucketCors
};
