# Photo Upload Guide for Kashvi's Birthday Site

## Google Cloud Storage Integration

### Setup Instructions

1. **Create GCS Bucket** (if not already created):
```bash
gsutil mb gs://baby-birthday-photos
```

2. **Make bucket publicly readable**:
```bash
gsutil iam ch allUsers:objectViewer gs://baby-birthday-photos
```

3. **Set CORS policy for web access**:
```bash
echo '[{"origin":["*"],"method":["GET"],"responseHeader":["Content-Type"],"maxAgeSeconds":3600}]' > cors.json
gsutil cors set cors.json gs://baby-birthday-photos
```

### Photo Structure

The photos should be organized in the following structure in your GCS bucket:

```
baby-birthday-photos/
├── baby-journey/
│   ├── newborn/
│   │   ├── photo_1.jpg
│   │   ├── photo_2.jpg
│   │   └── ...
│   ├── month_1/
│   ├── month_2/
│   └── ... (up to month_12)
└── best-photos/
    ├── precious_smiles/
    ├── first_steps/
    ├── family_moments/
    ├── milestone_celebrations/
    ├── adorable_poses/
    └── sweet_dreams/
```

### Upload Photos

#### Option 1: Using gsutil (Command Line)
```bash
# Upload a single photo
gsutil cp /path/to/photo.jpg gs://baby-birthday-photos/baby-journey/newborn/photo_1.jpg

# Upload multiple photos
gsutil -m cp -r /local/photos/* gs://baby-birthday-photos/

# Make uploaded files public
gsutil -m acl set -R -a public-read gs://baby-birthday-photos/*
```

#### Option 2: Using Google Cloud Console
1. Go to [Google Cloud Console > Storage](https://console.cloud.google.com/storage)
2. Click on `baby-birthday-photos` bucket
3. Upload files following the folder structure above

#### Option 3: Using the Upload Script
```bash
cd scripts
node uploadToGCS.js
```

### Photo Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended max 2MB per photo for optimal loading
- **Naming**: Use sequential naming like `photo_1.jpg`, `photo_2.jpg`, etc.
- **Dimensions**: Recommended 1080x1080 (square) or 16:9 ratio

### Testing Locally

1. Ensure photos are uploaded to GCS
2. Run the development server:
```bash
npm start
```
3. Check that photos load correctly in the Baby Journey and Best Photos sections

### Deployment

After uploading photos, deploy the updated site:
```bash
# Quick deployment
./deploy-quick.sh

# Or manual deployment
npm run build
gcloud run deploy birthday-site --source . --platform managed --region us-central1 --allow-unauthenticated
```

### Troubleshooting

**Photos not loading?**
- Check bucket permissions: `gsutil iam get gs://baby-birthday-photos`
- Verify CORS policy: `gsutil cors get gs://baby-birthday-photos`
- Ensure photos follow the exact naming convention

**CORS errors?**
- Re-apply CORS policy as shown above
- Wait a few minutes for changes to propagate

**Performance issues?**
- Compress images before uploading
- Consider using WebP format for better compression
- Ensure images are not larger than 2MB

### Sample Upload Commands

```bash
# Upload baby journey photos
gsutil cp kashvi_newborn_1.jpg gs://baby-birthday-photos/baby-journey/newborn/photo_1.jpg
gsutil cp kashvi_1month_1.jpg gs://baby-birthday-photos/baby-journey/month_1/photo_1.jpg

# Upload best photos
gsutil cp smile_photo.jpg gs://baby-birthday-photos/best-photos/precious_smiles/photo_1.jpg
gsutil cp steps_photo.jpg gs://baby-birthday-photos/best-photos/first_steps/photo_1.jpg

# Make all public
gsutil -m acl set -R -a public-read gs://baby-birthday-photos/*
```

### URLs

After uploading, photos will be accessible at:
- `https://storage.googleapis.com/baby-birthday-photos/baby-journey/newborn/photo_1.jpg`
- `https://storage.googleapis.com/baby-birthday-photos/best-photos/precious_smiles/photo_1.jpg`

The website will automatically generate these URLs and display the photos in the galleries.
