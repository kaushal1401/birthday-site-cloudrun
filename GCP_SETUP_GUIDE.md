# GCP Setup Guide for Birthday Site

## Prerequisites
- Google Cloud CLI installed (`gcloud` command available)
- A Google Cloud Project created

## Local Development Setup

### 1. Set up Firebase Emulator for Local Testing

Install Firebase CLI:
```bash
npm install -g firebase-tools
```

Initialize Firebase in your project:
```bash
cd birthday-site-cloudrun
firebase init
```

Select:
- ✅ Firestore: Configure security rules and indexes files for Firestore
- ✅ Storage: Configure a security rules file for Cloud Storage
- ✅ Emulators: Set up local emulators for Firebase products

### 2. Start Firebase Emulators

```bash
firebase emulators:start
```

This will start:
- Firestore Emulator on localhost:8080
- Storage Emulator on localhost:9199
- Web UI on localhost:4000

### 3. Configure Environment Variables

Update `.env` file with your actual project details:

```env
# Production Configuration
REACT_APP_PROJECT_ID=your-actual-project-id
REACT_APP_STORAGE_BUCKET=your-actual-project-id.appspot.com

# For local development (uncomment these lines)
REACT_APP_USE_FIRESTORE_EMULATOR=true
REACT_APP_FIRESTORE_EMULATOR_HOST=localhost:8080
```

## Production Setup

### 1. Enable Required APIs

```bash
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Create Firestore Database

```bash
# Create Firestore in Native mode
gcloud firestore databases create --region=us-central1
```

### 3. Create Storage Bucket

```bash
# Create storage bucket
gsutil mb gs://your-project-id.appspot.com

# Enable public access for web app
gsutil iam ch allUsers:objectViewer gs://your-project-id.appspot.com
```

### 4. Upload Baby Journey Photos

Create the folder structure and upload photos:

```bash
# Create the folder structure
gsutil cp your-photos/month1.jpg gs://your-project-id.appspot.com/baby-journey-photos/
gsutil cp your-photos/month2.jpg gs://your-project-id.appspot.com/baby-journey-photos/
# ... continue for all 12 months
```

Recommended naming pattern:
- `month1.jpg` to `month12.jpg`
- Or use descriptive names like `month1-hello-world.jpg`

### 5. Set up Cloud Run Service Account

```bash
# Create service account for Cloud Run
gcloud iam service-accounts create birthday-app-sa \
  --display-name="Birthday App Service Account"

# Grant Firestore access
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:birthday-app-sa@your-project-id.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

# Grant Storage access
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:birthday-app-sa@your-project-id.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"
```

## Build and Deploy to Cloud Run

### 1. Build the Docker Image

```bash
# Build the image
gcloud builds submit --tag gcr.io/your-project-id/birthday-site

# Or use Cloud Build with cloudbuild.yaml
gcloud builds submit
```

### 2. Deploy to Cloud Run

```bash
gcloud run deploy birthday-site \
  --image gcr.io/your-project-id/birthday-site \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --service-account birthday-app-sa@your-project-id.iam.gserviceaccount.com \
  --set-env-vars REACT_APP_PROJECT_ID=your-project-id,REACT_APP_STORAGE_BUCKET=your-project-id.appspot.com
```

## Testing Steps

### 1. Local Testing with Emulators

1. Start emulators: `firebase emulators:start`
2. Update `.env` to enable emulator mode
3. Run React app: `npm start`
4. Test RSVP form and message wall
5. Check data in emulator UI at localhost:4000

### 2. Production Testing

1. Upload test photos to storage bucket
2. Test RSVP functionality
3. Test message wall
4. Verify admin panel access
5. Check responsive design on mobile

## Firestore Collections Structure

The app uses these collections:

### `rsvps` Collection
```json
{
  "name": "John Doe",
  "mobile": "+1234567890",
  "adultCount": 2,
  "children": [{"age": 5}, {"age": 8}],
  "childrenCount": 2,
  "totalGuests": 4,
  "message": "Can't wait to celebrate!",
  "attending": "yes",
  "timestamp": "2025-09-01T10:00:00Z",
  "status": "confirmed"
}
```

### `messages` Collection
```json
{
  "name": "Jane Smith",
  "message": "Happy birthday little one!",
  "guestType": "adult",
  "timestamp": "2025-09-01T10:00:00Z"
}
```

## Storage Structure

```
your-project-id.appspot.com/
├── baby-journey-photos/
│   ├── month1.jpg
│   ├── month2.jpg
│   ├── ...
│   └── month12.jpg
└── gallery/
    ├── party-photo1.jpg
    └── party-photo2.jpg
```

## Environment Variables Reference

```env
# Required for production
REACT_APP_PROJECT_ID=your-gcp-project-id
REACT_APP_STORAGE_BUCKET=your-gcp-project-id.appspot.com
REACT_APP_FIRESTORE_COLLECTION_RSVPS=rsvps
REACT_APP_FIRESTORE_COLLECTION_MESSAGES=messages

# Event details
REACT_APP_EVENT_VENUE=Mythri Banquet Hall
REACT_APP_EVENT_ADDRESS=8350 N MacArthur Blvd Suite 190, Irving, TX 75063
REACT_APP_EVENT_TIME=7:00 PM

# Local development only
REACT_APP_USE_FIRESTORE_EMULATOR=true
REACT_APP_FIRESTORE_EMULATOR_HOST=localhost:8080
```

## Troubleshooting

### Common Issues:

1. **Storage Access Denied**: Ensure bucket has public read access
2. **Firestore Permission Denied**: Check service account permissions
3. **Photos Not Loading**: Verify bucket name and photo paths
4. **Emulator Connection Failed**: Ensure emulators are running

### Debugging Commands:

```bash
# Check service account permissions
gcloud projects get-iam-policy your-project-id

# List storage objects
gsutil ls -r gs://your-project-id.appspot.com/

# Check Firestore indexes
gcloud firestore indexes list

# View Cloud Run logs
gcloud run services logs read birthday-site --region=us-central1
```
