# Google Cloud Storage Integration Guide

## Overview
The birthday site now uses Google Cloud Storage (GCS) for photos while keeping Firestore for messages, RSVP, and photo likes.

## Setup Instructions

### 1. Prerequisites
- Google Cloud SDK installed (`gcloud` command)
- A Google Cloud Project with billing enabled
- Storage API enabled in your project

### 2. Set up the GCS Bucket

#### Option A: Using PowerShell (Windows)
```powershell
# Update the PROJECT_ID in the script first
.\scripts\setup-bucket.ps1
```

#### Option B: Using Bash (Linux/Mac)
```bash
# Update the PROJECT_ID in the script first
chmod +x scripts/setup-bucket.sh
./scripts/setup-bucket.sh
```

#### Option C: Manual Setup
```bash
# Replace YOUR_PROJECT_ID with your actual project ID
export PROJECT_ID="YOUR_PROJECT_ID"
export BUCKET_NAME="baby-birthday-photos"

# Create bucket
gsutil mb -p $PROJECT_ID gs://$BUCKET_NAME

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Create folders
gsutil cp /dev/null gs://$BUCKET_NAME/baby-journey/newborn/.keep
gsutil cp /dev/null gs://$BUCKET_NAME/baby-journey/month_1/.keep
# ... continue for all months and categories
```

### 3. Upload Sample Photos

#### Structure:
```
baby-birthday-photos/
├── baby-journey/
│   ├── newborn/
│   │   ├── photo_1.jpg
│   │   ├── photo_2.jpg
│   │   └── ...
│   ├── month_1/
│   ├── month_2/
│   └── ...
└── best-photos/
    ├── precious_smiles/
    ├── first_steps/
    ├── family_moments/
    └── ...
```

#### Upload Commands:
```bash
# Upload baby journey photos
gsutil cp baby-photo1.jpg gs://baby-birthday-photos/baby-journey/newborn/photo_1.jpg
gsutil cp baby-photo2.jpg gs://baby-birthday-photos/baby-journey/month_1/photo_1.jpg

# Upload best photos
gsutil cp family-photo.jpg gs://baby-birthday-photos/best-photos/family_moments/photo_1.jpg
gsutil cp smile-photo.jpg gs://baby-birthday-photos/best-photos/precious_smiles/photo_1.jpg
```

### 4. Testing Connectivity

Once your photos are uploaded, you can test connectivity:

1. Open your browser's developer console
2. Run: `testGCS()`
3. Check the console output for accessibility results

### 5. Photo URL Format

Photos are accessed via direct GCS URLs:
```
https://storage.googleapis.com/baby-birthday-photos/baby-journey/newborn/photo_1.jpg
https://storage.googleapis.com/baby-birthday-photos/best-photos/family_moments/photo_1.jpg
```

## Configuration

### Environment Variables
For Cloud Run deployment, you can set:
- `GOOGLE_CLOUD_PROJECT`: Your project ID
- Bucket name is currently hardcoded as `baby-birthday-photos`

### Local Development
- Photos will show placeholder URLs until actual photos are uploaded to GCS
- Firestore functionality (likes, messages, RSVP) works independently

## Architecture

- **Photos**: Google Cloud Storage (public bucket)
- **Likes**: Firestore database
- **Messages**: Firestore database  
- **RSVP**: Firestore database

This hybrid approach allows fast photo loading from GCS while maintaining rich data features in Firestore.

## Troubleshooting

### Photos not loading?
1. Check bucket permissions: `gsutil iam get gs://baby-birthday-photos`
2. Verify photos exist: `gsutil ls gs://baby-birthday-photos/baby-journey/newborn/`
3. Test individual photo URL in browser

### Authentication issues?
1. Ensure you're logged in: `gcloud auth list`
2. Set default project: `gcloud config set project YOUR_PROJECT_ID`

### CORS issues?
```bash
# Create cors.json file with appropriate settings
gsutil cors set cors.json gs://baby-birthday-photos
```
