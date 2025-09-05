// GCS Configuration for Birthday Site
export const GCS_CONFIG = {
  bucketName: 'baby-birthday-photos',
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'kashvibirthday',
  baseUrl: 'https://storage.googleapis.com/baby-birthday-photos',
  
  // Photo structure - Upload your photos to these paths in GCS bucket:
  // 
  // For Baby Journey (12 months):
  // baby-journey/newborn/photo1.jpg, baby-journey/newborn/photo2.jpg
  // baby-journey/month_1/photo1.jpg, baby-journey/month_1/photo2.jpg
  // baby-journey/month_2/photo1.jpg, baby-journey/month_2/photo2.jpg
  // ... up to month_12
  //
  // For Best Photos:
  // best-photos/precious_smiles/photo1.jpg, best-photos/precious_smiles/photo2.jpg
  // best-photos/first_steps/photo1.jpg, best-photos/first_steps/photo2.jpg
  // best-photos/family_moments/photo1.jpg, best-photos/family_moments/photo2.jpg
  // best-photos/milestone_celebrations/photo1.jpg, best-photos/milestone_celebrations/photo2.jpg
  // best-photos/adorable_poses/photo1.jpg, best-photos/adorable_poses/photo2.jpg
  // best-photos/sweet_dreams/photo1.jpg, best-photos/sweet_dreams/photo2.jpg
  //
  photoStructure: {
    babyJourney: {
      path: 'baby-journey',
      months: [
        { key: 'newborn', name: 'Newborn' },
        { key: 'month_1', name: 'Month 1' },
        { key: 'month_2', name: 'Month 2' },
        { key: 'month_3', name: 'Month 3' },
        { key: 'month_4', name: 'Month 4' },
        { key: 'month_5', name: 'Month 5' },
        { key: 'month_6', name: 'Month 6' },
        { key: 'month_7', name: 'Month 7' },
        { key: 'month_8', name: 'Month 8' },
        { key: 'month_9', name: 'Month 9' },
        { key: 'month_10', name: 'Month 10' },
        { key: 'month_11', name: 'Month 11' },
        { key: 'month_12', name: 'Month 12' }
      ]
    },
    bestPhotos: {
      path: 'best-photos',
      categories: [
        { key: 'precious_smiles', name: 'Precious Smiles', emoji: '😊' },
        { key: 'first_steps', name: 'First Steps', emoji: '👶' },
        { key: 'family_moments', name: 'Family Moments', emoji: '👨‍👩‍👧' },
        { key: 'milestone_celebrations', name: 'Milestone Celebrations', emoji: '🎉' },
        { key: 'adorable_poses', name: 'Adorable Poses', emoji: '📸' },
        { key: 'sweet_dreams', name: 'Sweet Dreams', emoji: '😴' }
      ]
    }
  }
};

// Helper function to generate photo URLs
export const generatePhotoUrl = (category, subcategory, photoIndex) => {
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
};

export default GCS_CONFIG;
