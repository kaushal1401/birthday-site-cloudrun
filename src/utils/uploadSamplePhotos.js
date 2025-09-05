// Script to upload sample photos to Firebase Storage
// This would be run once to populate the storage with sample images

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// Direct Firebase configuration - no environment variables needed
const firebaseConfig = {
  projectId: "kashvibirthday",
  apiKey: "AIzaSyBvOiCik6fJMrCrPhqFgKLx1w1w-7QJgV4",
  authDomain: "kashvibirthday.firebaseapp.com",
  storageBucket: "kashvibirthday.appspot.com",
  messagingSenderId: "279842866856",
  appId: "1:279842866856:web:61e61fb3a145b7045dbf8502c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Sample baby photos URLs (free stock photos)
const samplePhotos = {
  babyJourney: {
    'Newborn': [
      'https://images.unsplash.com/photo-1544023323-b6df08d1ea31?w=400',
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400',
      'https://images.unsplash.com/photo-1576659531892-0f4991fcc984?w=400'
    ],
    'Month 1': [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'
    ],
    'Month 2': [
      'https://images.unsplash.com/photo-1519689680689-dd2144a7169e?w=400',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
      'https://images.unsplash.com/photo-1520420097861-e4959843b682?w=400'
    ],
    'Month 3': [
      'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=400',
      'https://images.unsplash.com/photo-1509066933371-cf36d7d6b9e8?w=400',
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400'
    ],
    // Add more months as needed...
  },
  bestPhotos: {
    'Precious Smiles': [
      'https://images.unsplash.com/photo-1544023323-b6df08d1ea31?w=500',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500'
    ],
    'First Steps': [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500',
      'https://images.unsplash.com/photo-1519689680689-dd2144a7169e?w=500',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500'
    ],
    // Add more categories as needed...
  }
};

// Function to fetch image from URL and convert to blob
async function fetchImageAsBlob(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

// Function to upload sample photos
export async function uploadSamplePhotos() {
  console.log('Starting sample photo upload...');
  
  try {
    // Upload baby journey photos
    for (const [month, urls] of Object.entries(samplePhotos.babyJourney)) {
      console.log(`Uploading photos for ${month}...`);
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const blob = await fetchImageAsBlob(url);
        
        if (blob) {
          const filename = `${month.replace(/\s+/g, '_')}_${i + 1}.jpg`;
          const storageRef = ref(storage, `baby-birthday-photos/babyJourney/${month}/${filename}`);
          
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          console.log(`Uploaded ${filename}: ${downloadURL}`);
        }
      }
    }
    
    // Upload best photos
    for (const [category, urls] of Object.entries(samplePhotos.bestPhotos)) {
      console.log(`Uploading best photos for ${category}...`);
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const blob = await fetchImageAsBlob(url);
        
        if (blob) {
          const filename = `${category.replace(/\s+/g, '_')}_${i + 1}.jpg`;
          const storageRef = ref(storage, `baby-birthday-photos/bestPhotos/${category}/${filename}`);
          
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          console.log(`Uploaded ${filename}: ${downloadURL}`);
        }
      }
    }
    
    console.log('Sample photo upload completed!');
  } catch (error) {
    console.error('Error uploading sample photos:', error);
  }
}

// Note: This script would typically be run once to populate the storage
// You can call uploadSamplePhotos() from a temporary component or script
