# Birthday Site - Cloud Run Deployment Guide

## Overview
This is a React-based birthday celebration website with Firestore integration, designed to be deployed on Google Cloud Run.

## Features
- Single-page birthday celebration site
- RSVP functionality with adult/child count management
- Guest message wall with real-time updates
- 12-month photo gallery (photos via GCP Storage)
- Admin dashboard for managing RSVPs and messages
- Pastel birthday theme with floating animations
- Mobile-responsive design

## Prerequisites
1. Google Cloud Platform account
2. GCP project with billing enabled
3. Firestore database enabled
4. Cloud Run API enabled
5. Cloud Storage bucket (for photos)

## Environment Setup

### 1. Update Environment Variables
Edit `.env` file and replace `your-gcp-project-id` with your actual GCP project ID:

```env
REACT_APP_PROJECT_ID=your-actual-project-id
```

### 2. Firestore Collections
The app uses two Firestore collections:
- `rsvps` - stores RSVP responses
- `messages` - stores guest messages

These collections will be created automatically when first used.

### 3. Firestore Security Rules
Set up the following Firestore security rules in your GCP console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to rsvps collection
    match /rsvps/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to messages collection
    match /messages/{document} {
      allow read, write: if true;
    }
  }
}
```

**Note**: These rules allow public access for demo purposes. For production, implement proper authentication and authorization.

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

### 3. Test Firestore Connection
- Try submitting an RSVP
- Post a message on the message wall
- Check admin panel to see if data appears

## Cloud Run Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Create Dockerfile
The project includes a Dockerfile for containerization.

### 3. Deploy to Cloud Run
Using gcloud CLI:

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/birthday-site
gcloud run deploy birthday-site --image gcr.io/YOUR_PROJECT_ID/birthday-site --platform managed --region us-central1 --allow-unauthenticated
```

### 4. Service Account Permissions
Ensure your Cloud Run service has the following IAM roles:
- Cloud Datastore User (for Firestore access)
- Storage Object Viewer (for photo gallery)

## Photo Gallery Setup

### 1. Create Cloud Storage Bucket
```bash
gcloud storage buckets create gs://your-birthday-photos-bucket --location=us-central1
```

### 2. Upload Photos
Upload 12 photos (one for each month) to the bucket:
- `month-1.jpg` (or .png, .webp)
- `month-2.jpg`
- ... up to ...
- `month-12.jpg`

### 3. Make Bucket Public (for web access)
```bash
gcloud storage buckets add-iam-policy-binding gs://your-birthday-photos-bucket --member=allUsers --role=roles/storage.objectViewer
```

### 4. Update Photo Gallery Component
Edit `src/components/PhotoGallery.jsx` and update the `baseUrl` to point to your bucket:

```javascript
const baseUrl = 'https://storage.googleapis.com/your-birthday-photos-bucket';
```

## Testing Checklist

### Frontend Testing
- [ ] RSVP form submission works
- [ ] Adult count +/- buttons work
- [ ] Child age selection works
- [ ] Message wall posts and displays messages
- [ ] Admin panel shows RSVPs and messages
- [ ] Admin panel delete functionality works
- [ ] Photo gallery displays properly
- [ ] Countdown timers show correct dates
- [ ] Mobile responsiveness works

### Backend Testing
- [ ] Firestore collections are created
- [ ] Data is stored correctly in Firestore
- [ ] Real-time updates work
- [ ] Delete operations work
- [ ] No console errors in browser

## Troubleshooting

### Common Issues

1. **Firestore Permission Denied**
   - Check Firestore security rules
   - Verify project ID in .env file
   - Ensure Firestore API is enabled

2. **Photos Not Loading**
   - Verify Cloud Storage bucket exists
   - Check bucket permissions
   - Update baseUrl in PhotoGallery.jsx

3. **Build Errors**
   - Run `npm install` to ensure all dependencies
   - Check for syntax errors in components
   - Verify environment variables

### Development vs Production

**Development**: 
- Uses Firebase Web SDK
- Direct browser connection to Firestore
- Environment variables from .env file

**Production (Cloud Run)**:
- Same Firebase Web SDK (browser-compatible)
- Service account authentication
- Environment variables from Cloud Run settings

## Security Considerations

1. **Firestore Rules**: Current rules allow public access. Implement authentication for production.
2. **Environment Variables**: Never commit actual project IDs to version control.
3. **CORS**: Configure Cloud Storage CORS for cross-origin requests if needed.
4. **Rate Limiting**: Consider implementing rate limiting for form submissions.

## Monitoring and Logs

1. **Cloud Run Logs**: `gcloud logs tail /projects/YOUR_PROJECT_ID/logs/run.googleapis.com`
2. **Firestore Usage**: Monitor in GCP Console -> Firestore
3. **Application Errors**: Check browser console and Cloud Run logs

## Cost Optimization

1. **Firestore**: Charged per read/write operation
2. **Cloud Run**: Charged per request and CPU/memory usage
3. **Cloud Storage**: Charged per GB stored and bandwidth
4. **Consider**: Use Firestore emulator for local development to reduce costs

## Next Steps

1. Replace placeholder project ID with actual GCP project ID
2. Set up Firestore security rules
3. Upload birthday photos to Cloud Storage
4. Deploy to Cloud Run
5. Test all functionality
6. Share the URL with family and friends!
