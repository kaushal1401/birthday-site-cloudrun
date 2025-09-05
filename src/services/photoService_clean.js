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
    console.log(`📸 Loading photos for ${category}/${subcategory || 'all'}`);
    
    // Get the photo structure from GCS config
    let photoStructure;
    if (category === 'babyJourney') {
      photoStructure = GCS_CONFIG.photoStructure.babyJourney;
    } else if (category === 'bestPhotos') {
      photoStructure = GCS_CONFIG.photoStructure.bestPhotos;
    } else {
      throw new Error(`Unknown category: ${category}`);
    }
    
    let photos = [];
    
    if (category === 'babyJourney') {
      // For baby journey, subcategory is the month name
      const monthName = subcategory;
      const monthPhotos = photoStructure.months[monthName] || [];
      
      photos = monthPhotos.map((photoInfo, index) => ({
        id: `${monthName}_${index}`,
        url: generatePhotoUrl(category, monthName, photoInfo.filename),
        alt: `${monthName} - ${photoInfo.description || `Photo ${index + 1}`}`,
        month: monthName,
        description: photoInfo.description,
        isPlaceholder: photoInfo.isPlaceholder || false
      }));
    } else if (category === 'bestPhotos') {
      // For best photos, subcategory is the category name
      const categoryName = subcategory;
      const categoryPhotos = photoStructure.categories[categoryName] || [];
      
      photos = categoryPhotos.map((photoInfo, index) => ({
        id: `${categoryName}_${index}`,
        url: generatePhotoUrl(category, categoryName, photoInfo.filename),
        alt: `${categoryName} - ${photoInfo.description || `Photo ${index + 1}`}`,
        category: categoryName,
        description: photoInfo.description,
        isPlaceholder: photoInfo.isPlaceholder || false
      }));
    }
    
    console.log(`✅ Loaded ${photos.length} photos for ${category}/${subcategory}`);
    return photos;
    
  } catch (error) {
    console.error(`Error loading photos for ${category}/${subcategory}:`, error);
    
    // Return placeholder photos on error
    const placeholderPhotos = [];
    for (let i = 0; i < 2; i++) {
      placeholderPhotos.push({
        id: `placeholder_${i}`,
        url: `https://via.placeholder.com/500x400/F0F8FF/667eea?text=${encodeURIComponent(`📸 ${subcategory || category}`)}`,
        alt: `Placeholder photo ${i + 1}`,
        isPlaceholder: true
      });
    }
    
    return placeholderPhotos;
  }
};

// Delete photo from GCS bucket (admin only)
export const deletePhoto = async (photoPath) => {
  try {
    // In production, this would call the GCS delete API
    console.log('Mock delete from GCS:', photoPath);
    return { success: true, deletedPath: photoPath };
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};

// Get photo metadata
export const getPhotoMetadata = async (photoUrl) => {
  try {
    // Extract path from URL for metadata lookup
    const urlParts = photoUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    return {
      url: photoUrl,
      filename: filename,
      uploadedAt: new Date().toISOString(), // Mock timestamp
      size: '1.2MB', // Mock size
      dimensions: '1920x1080' // Mock dimensions
    };
  } catch (error) {
    console.error('Error getting photo metadata:', error);
    return null;
  }
};

// Generate photo variations (thumbnails, etc.)
export const generatePhotoVariations = async (photoUrl) => {
  try {
    // In production, this would generate thumbnails using GCS or Cloud Functions
    return {
      original: photoUrl,
      thumbnail: photoUrl.replace('.jpg', '_thumb.jpg'),
      medium: photoUrl.replace('.jpg', '_medium.jpg'),
      large: photoUrl.replace('.jpg', '_large.jpg')
    };
  } catch (error) {
    console.error('Error generating photo variations:', error);
    return { original: photoUrl };
  }
};

// Batch operations for multiple photos
export const batchUploadPhotos = async (files, category, subcategory) => {
  try {
    const uploadPromises = files.map(file => uploadPhoto(file, category, subcategory));
    const results = await Promise.all(uploadPromises);
    
    console.log(`✅ Batch uploaded ${results.length} photos to ${category}/${subcategory}`);
    return results;
  } catch (error) {
    console.error('Error in batch upload:', error);
    throw error;
  }
};

export const batchDeletePhotos = async (photoPaths) => {
  try {
    const deletePromises = photoPaths.map(path => deletePhoto(path));
    const results = await Promise.all(deletePromises);
    
    console.log(`✅ Batch deleted ${results.length} photos`);
    return results;
  } catch (error) {
    console.error('Error in batch delete:', error);
    throw error;
  }
};

// Photo organization helpers
export const organizePhotosByMonth = (photos) => {
  const organized = {};
  
  photos.forEach(photo => {
    if (photo.month) {
      if (!organized[photo.month]) {
        organized[photo.month] = [];
      }
      organized[photo.month].push(photo);
    }
  });
  
  return organized;
};

export const organizePhotosByCategory = (photos) => {
  const organized = {};
  
  photos.forEach(photo => {
    if (photo.category) {
      if (!organized[photo.category]) {
        organized[photo.category] = [];
      }
      organized[photo.category].push(photo);
    }
  });
  
  return organized;
};

// Search and filter functions
export const searchPhotos = async (query, category = null) => {
  try {
    // In production, this would use GCS metadata search or a search index
    console.log(`🔍 Searching photos for: ${query} in ${category || 'all categories'}`);
    
    // Mock search results
    return [
      {
        id: 'search_result_1',
        url: `https://via.placeholder.com/500x400/F0F8FF/667eea?text=${encodeURIComponent(`Search: ${query}`)}`,
        alt: `Search result for ${query}`,
        relevance: 0.95
      }
    ];
  } catch (error) {
    console.error('Error searching photos:', error);
    return [];
  }
};

export const filterPhotosByDate = (photos, startDate, endDate) => {
  return photos.filter(photo => {
    if (!photo.uploadedAt) return false;
    const photoDate = new Date(photo.uploadedAt);
    return photoDate >= startDate && photoDate <= endDate;
  });
};

// Photo statistics
export const getPhotoStats = async (category = null) => {
  try {
    // In production, this would query GCS bucket statistics
    return {
      totalPhotos: 24,
      totalSize: '156.8MB',
      categories: {
        babyJourney: 12,
        bestPhotos: 12
      },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting photo stats:', error);
    return null;
  }
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
