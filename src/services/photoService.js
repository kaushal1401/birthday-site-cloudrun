// Google Cloud Storage Photo Service with Firestore for likes/messages
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { GCS_CONFIG, generatePhotoUrl } from '../config/gcsConfig';

// Photo categories and months configuration
export const PHOTO_CATEGORIES = {
  babyJourney: {
    months: [
      'Newborn', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5',
      'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'
    ]
  },
  bestPhotos: {
    categories: [
      { name: 'Precious Smiles', emoji: '😊' },
      { name: 'First Steps', emoji: '👶' },
      { name: 'Family Moments', emoji: '👨‍👩‍👧' },
      { name: 'Milestone Celebrations', emoji: '🎉' },
      { name: 'Adorable Poses', emoji: '📸' },
      { name: 'Sweet Dreams', emoji: '😴' }
    ]
  }
};

// Upload photo to Google Cloud Storage (for admin use)
// Note: In production, this would use the GCS API with proper authentication
export const uploadPhoto = async (file, category, subcategory) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storagePath = `baby-birthday-photos/${category}/${subcategory}/${fileName}`;
    
    // For now, return a mock response - in production, you would upload to GCS
    // using the @google-cloud/storage library on the server side
    console.log('Mock upload to GCS:', { storagePath, fileName });
    
    return {
      url: generatePhotoUrl(category, subcategory, fileName),
      path: storagePath,
      name: fileName,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

// Get all photos for a category using GCS direct URLs
export const getPhotos = async (category, subcategory = null) => {
  try {
    console.log(`Loading photos for ${category}/${subcategory}`);
    
    // Generate photos based on GCS structure
    const photos = await generateGCSPhotos(category, subcategory);
    
    // Filter out only existing photos first
    const existingPhotos = photos.filter(photo => photo.exists);
    
    // If we have some real photos, prioritize them
    if (existingPhotos.length > 0) {
      console.log(`Found ${existingPhotos.length} real photos for ${subcategory}`);
      
      // Fill remaining slots with placeholders if needed
      const remainingSlots = 2 - existingPhotos.length;
      if (remainingSlots > 0) {
        const placeholders = generatePlaceholders(category, subcategory, existingPhotos.length);
        return [...existingPhotos, ...placeholders.slice(0, remainingSlots)];
      }
      
      return existingPhotos.slice(0, 2);
    }
    
    // No real photos found, return placeholders
    console.log(`No real photos found for ${subcategory}, using placeholders`);
    return generatePlaceholders(category, subcategory);
    
  } catch (error) {
    console.error('Error getting photos:', error);
    // Return placeholders even on error so template shows
    return generatePlaceholders(category, subcategory);
  }
};

// Test if photo exists in GCS bucket with better error handling
const testPhotoExistence = async (url, photoData) => {
  try {
    console.log(`Testing GCS photo: ${url}`);
    
    // Try to fetch the photo from GCS bucket with a simple GET request
    const response = await fetch(url, { 
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (response.ok) {
      console.log(`✅ GCS photo exists: ${url}`);
      return { 
        ...photoData, 
        url, 
        exists: true, 
        isPlaceholder: false,
        lastChecked: new Date().toISOString()
      };
    } else {
      console.log(`❌ GCS photo not found: ${url} (Status: ${response.status})`);
      return { ...photoData, exists: false };
    }
  } catch (error) {
    // Handle CORS errors - assume photo exists if CORS blocks us
    if (error.message && error.message.includes('CORS')) {
      console.log(`🔓 CORS blocked, assuming photo exists: ${url}`);
      return { 
        ...photoData, 
        url, 
        exists: true, 
        isPlaceholder: false,
        lastChecked: new Date().toISOString(),
        corsBlocked: true
      };
    }
    
    // Log all other errors for debugging
    console.log(`⚠️ GCS photo access failed: ${url}`, error.message);
    return { ...photoData, exists: false };
  }
};

// Generate placeholders when no photos found in GCS
const generatePlaceholders = (category, subcategory, startIndex = 0) => {
  const placeholders = [];
  
  if (category === 'babyJourney') {
    const monthData = GCS_CONFIG.photoStructure.babyJourney.months.find(m => m.name === subcategory);
    const monthKey = monthData?.key || subcategory.toLowerCase().replace(' ', '_');
    
    for (let i = startIndex; i < 2; i++) {
      placeholders.push({
        id: `${monthKey}_placeholder_${i + 1}`,
        url: `https://via.placeholder.com/500x400/FFE5F1/FF6B9D?text=${encodeURIComponent(`📸 ${subcategory}\nPhoto ${i + 1}\nUpload to GCS bucket`)}`,
        path: `baby-journey/${monthKey}/photo_${i + 1}.jpg`,
        name: `${subcategory} - Photo ${i + 1}`,
        month: subcategory,
        fileName: `photo_${i + 1}.jpg`,
        exists: false,
        isPlaceholder: true,
        uploadPath: `baby-journey/${monthKey}/photo_${i + 1}.jpg`
      });
    }
  } else if (category === 'bestPhotos') {
    const categoryData = GCS_CONFIG.photoStructure.bestPhotos.categories.find(c => c.name === subcategory);
    const categoryKey = categoryData?.key || subcategory.toLowerCase().replace(/\s+/g, '_');
    
    for (let i = startIndex; i < 2; i++) {
      placeholders.push({
        id: `${categoryKey}_placeholder_${i + 1}`,
        url: `https://via.placeholder.com/500x400/F0F8FF/667eea?text=${encodeURIComponent(`📸 ${subcategory}\nPhoto ${i + 1}\nUpload to GCS bucket`)}`,
        path: `best-photos/${categoryKey}/photo_${i + 1}.jpg`,
        name: `${subcategory} - Photo ${i + 1}`,
        category: subcategory,
        fileName: `photo_${i + 1}.jpg`,
        exists: false,
        isPlaceholder: true,
        uploadPath: `best-photos/${categoryKey}/photo_${i + 1}.jpg`
      });
    }
  }
  
  return placeholders;
};

// Generate GCS photos with existence checking - show real photos when available
const generateGCSPhotos = async (category, subcategory) => {
  const photos = [];
  
  if (category === 'babyJourney' && subcategory) {
    // Find the correct month key from GCS config
    const monthData = GCS_CONFIG.photoStructure.babyJourney.months.find(m => m.name === subcategory);
    const monthKey = monthData?.key || subcategory.toLowerCase().replace(' ', '_');
    
    // Check for photos in GCS bucket using the actual naming patterns from bucket
    const photoPatterns = [
      'photo_1.jpg', 'photo_2.jpg', // Primary naming pattern found in bucket
      'photo1.jpg', 'photo2.jpg',   // Alternative naming
      '1.jpg', '2.jpg',             // Simple naming
      'kashvi_1.jpg', 'kashvi_2.jpg', // Name-based with underscore
      'kashvi1.jpg', 'kashvi2.jpg', // Name-based
      'img_1.jpg', 'img_2.jpg',     // Alternative with underscore
      'img1.jpg', 'img2.jpg',       // Alternative naming
      'image_1.jpg', 'image_2.jpg', // Another pattern with underscore
      'image1.jpg', 'image2.jpg'    // Another common pattern
    ];
    
    // Try to find exactly 2 photos for this month
    let photoCount = 0;
    for (const fileName of photoPatterns) {
      if (photoCount >= 2) break; // Stop when we have 2 photos
      
      const photoData = {
        id: `${monthKey}_${photoCount + 1}`,
        path: `baby-journey/${monthKey}/${fileName}`,
        name: `${subcategory} - Photo ${photoCount + 1}`,
        month: subcategory,
        fileName: fileName,
        monthKey: monthKey
      };
      
      const gcsUrl = `${GCS_CONFIG.baseUrl}/baby-journey/${monthKey}/${fileName}`;
      
      const photo = await testPhotoExistence(gcsUrl, photoData);
      if (photo.exists) {
        photos.push(photo);
        photoCount++;
        console.log(`✅ Found photo ${photoCount} for ${subcategory}: ${fileName}`);
      }
    }
    
    console.log(`Found ${photoCount} real photos for ${subcategory}`);
    
  } else if (category === 'bestPhotos' && subcategory) {
    // Find the correct category key from GCS config
    const categoryData = GCS_CONFIG.photoStructure.bestPhotos.categories.find(c => c.name === subcategory);
    const categoryKey = categoryData?.key || subcategory.toLowerCase().replace(/\s+/g, '_');
    
    // Check for photos in GCS bucket using the actual naming patterns from bucket
    const photoPatterns = [
      'photo_1.jpg', 'photo_2.jpg', // Primary naming pattern found in bucket
      'photo1.jpg', 'photo2.jpg',   // Alternative naming
      '1.jpg', '2.jpg',             // Simple naming
      'best_1.jpg', 'best_2.jpg',   // Category-based with underscore
      'best1.jpg', 'best2.jpg',     // Category-based
      'img_1.jpg', 'img_2.jpg',     // Alternative with underscore
      'img1.jpg', 'img2.jpg',       // Alternative naming
      'image_1.jpg', 'image_2.jpg', // Another pattern with underscore
      'image1.jpg', 'image2.jpg'    // Another common pattern
    ];
    
    // Try to find exactly 2 photos for this category
    let photoCount = 0;
    for (const fileName of photoPatterns) {
      if (photoCount >= 2) break; // Stop when we have 2 photos
      
      const photoData = {
        id: `${categoryKey}_${photoCount + 1}`,
        path: `best-photos/${categoryKey}/${fileName}`,
        name: `${subcategory} - Photo ${photoCount + 1}`,
        category: subcategory,
        fileName: fileName,
        categoryKey: categoryKey
      };
      
      const gcsUrl = `${GCS_CONFIG.baseUrl}/best-photos/${categoryKey}/${fileName}`;
      
      const photo = await testPhotoExistence(gcsUrl, photoData);
      if (photo.exists) {
        photos.push(photo);
        photoCount++;
        console.log(`✅ Found photo ${photoCount} for ${subcategory}: ${fileName}`);
      }
    }
    
    console.log(`Found ${photoCount} real photos for ${subcategory}`);
  }
  
  return photos;
};

// Like functionality with heart emoji tracking (no unlikes)
export const togglePhotoLike = async (photoUrl, userId = 'anonymous') => {
  try {
    // Check if Firestore is available
    if (!db) {
      console.warn('⚠️ Firestore not available - running in demo mode');
      // Return a mock response for demo mode
      return Math.floor(Math.random() * 10) + 1;
    }

    // Use photoUrl as the document ID (encode it safely)
    const photoId = btoa(photoUrl).replace(/[^a-zA-Z0-9]/g, '');
    const photoDocRef = doc(db, 'photoLikes', photoId);
    
    console.log('🔥 Firebase Like Operation:', {
      photoUrl,
      photoId,
      dbAvailable: !!db,
      userId
    });
    
    const photoDoc = await getDoc(photoDocRef);
    console.log('📄 Document exists:', photoDoc.exists());
    
    if (!photoDoc.exists()) {
      // Create new photo likes document with heart emoji
      const newDocData = {
        photoUrl,
        photoId,
        likes: [userId],
        totalLikes: 1,
        heartEmoji: '❤️',
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      console.log('📝 Creating new document:', newDocData);
      await setDoc(photoDocRef, newDocData);
      console.log('✅ New like added for photo:', photoUrl);
      return 1;
    } else {
      const data = photoDoc.data();
      console.log('📊 Existing document data:', data);
      
      const currentLikes = data.likes || [];
      const isLiked = currentLikes.includes(userId);
      
      if (isLiked) {
        // Already liked - don't allow unlikes, just return current count
        console.log('💖 Photo already liked by user:', userId);
        return data.totalLikes || 1;
      } else {
        // Add like
        const newCount = (data.totalLikes || 0) + 1;
        const updateData = {
          likes: arrayUnion(userId),
          totalLikes: newCount,
          heartEmoji: '❤️',
          lastUpdated: new Date().toISOString()
        };
        
        console.log('🔄 Updating document with:', updateData);
        await updateDoc(photoDocRef, updateData);
        console.log(`✅ Like added! New count: ${newCount}`);
        return newCount;
      }
    }
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    // Handle specific Firebase errors gracefully
    if (error.code === 'cancelled') {
      console.warn('⚠️ Firebase operation cancelled - returning default count');
      return 1;
    }
    
    if (error.code === 'permission-denied') {
      console.error('🚫 Permission denied - check Firestore rules');
      return 0;
    }
    
    if (error.code === 'unavailable') {
      console.error('🌐 Firebase unavailable - network issues');
      return 0;
    }
    
    if (error.message && error.message.includes('timeout')) {
      console.error('⏰ Firebase operation timeout');
      return 0;
    }
    
    // For any other error, return 0 to prevent UI breaking
    console.warn('⚠️ Unknown error in like function, returning 0');
    return 0;
    }
    
    if (error.code === 'permission-denied') {
      console.error('❌ Permission denied - check Firestore rules');
      return 0;
    }
    
    if (error.code === 'unavailable') {
      console.error('❌ Firebase unavailable - network issues');
      return 0;
    }
    
    if (error.message && error.message.includes('timeout')) {
      console.error('⏰ Firebase operation timeout');
      return 0;
    }
    
    // For any other error, return 0 to prevent UI breaking
    console.warn('⚠️ Unknown error in like function, returning 0');
    return 0;
  }
};

// Get photo likes count
export const getPhotoLikes = async (photoUrl, userId = 'anonymous') => {
  try {
    // Check if Firestore is available
    if (!db) {
      console.warn('⚠️ Firestore not available for getting likes - running in demo mode');
      return { liked: false, totalLikes: 0, heartEmoji: '🤍' };
    }

    const photoId = btoa(photoUrl).replace(/[^a-zA-Z0-9]/g, '');
    const photoDocRef = doc(db, 'photoLikes', photoId);
    
    console.log('🔍 Getting likes for photo:', {
      photoUrl,
      photoId,
      userId
    });
    
    const photoDoc = await getDoc(photoDocRef);
    
    if (!photoDoc.exists()) {
      console.log('📄 No likes document found for photo');
      return { liked: false, totalLikes: 0, heartEmoji: '🤍' };
    }
    
    const data = photoDoc.data();
    const likes = data.likes || [];
    const result = {
      liked: likes.includes(userId),
      totalLikes: data.totalLikes || 0,
      heartEmoji: data.heartEmoji || '❤️'
    };
    
    console.log('📊 Likes data retrieved:', result);
    return result;
  } catch (error) {
    console.error('❌ Error getting photo likes:', error);
    return { liked: false, totalLikes: 0, heartEmoji: '🤍' };
  }
};

// Get multiple photo likes at once
export const getMultiplePhotoLikes = async (photoIds, userId = 'anonymous') => {
  try {
    const likesData = {};
    
    await Promise.all(
      photoIds.map(async (photoId) => {
        const likes = await getPhotoLikes(photoId, userId);
        likesData[photoId] = likes;
      })
    );
    
    return likesData;
  } catch (error) {
    console.error('Error getting multiple photo likes:', error);
    return {};
  }
};
