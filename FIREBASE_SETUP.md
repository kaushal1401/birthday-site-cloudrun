# Firebase Setup Instructions

## Current Status: Demo Mode Active

Your birthday site is currently running in **Demo Mode** with sample data. To enable full functionality with real Firestore database and Cloud Storage, follow these steps:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name: `kashvibirthday` (or your preferred name)
4. Continue through the setup process

## Step 2: Enable Required Services

### Enable Firestore Database
1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for now
4. Select your preferred location

### Enable Cloud Storage
1. Go to "Build" → "Storage"
2. Click "Get started"
3. Start in test mode
4. Choose the same location as Firestore

## Step 3: Get Your Project Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>) 
4. Register your app with name: `birthday-site`
5. Copy the configuration object

## Step 4: Update Environment Variables

Replace the values in your `.env` file with your real Firebase config:

```env
# Firebase Configuration - Replace with your real values
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Birthday & Event Details (already set)
REACT_APP_BIRTHDAY_DATE=2025-09-24
REACT_APP_EVENT_DATE=2025-10-05
REACT_APP_EVENT_VENUE=Mythri Banquet Hall
REACT_APP_EVENT_ADDRESS=8350 N MacArthur Blvd Suite 190, Irving, TX 75063
REACT_APP_EVENT_TIME=6:00 PM

# Environment
NODE_ENV=production
```

## Step 5: Upload Photos to Cloud Storage

1. Go to Firebase Console → Storage
2. Create folder structure:
   - `baby-journey/` (for monthly photos)
   - `milestones/` (optional)
   - `family/` (optional)
   - `celebration/` (optional)

3. Upload your baby's monthly photos to `baby-journey/` folder:
   - Name them: `month-01.jpg`, `month-02.jpg`, etc.
   - Or upload in order (the app will display them in order)

## Step 6: Set Up Security Rules

### Firestore Rules
Go to Firestore → Rules and replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to rsvps and messages
    match /rsvps/{document} {
      allow read, write: if true;
    }
    match /messages/{document} {
      allow read, write: if true;
    }
  }
}
```

### Storage Rules  
Go to Storage → Rules and replace with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false; // Only admin can upload
    }
  }
}
```

## Step 7: Restart Your Application

1. Stop the current development server
2. Run `npm start` again
3. The demo mode alert should disappear
4. All features should now work with real data

## Troubleshooting

### Common Issues:
- **"Demo Mode" still showing**: Check that all environment variables are correctly set
- **Photos not loading**: Verify Cloud Storage is enabled and photos are uploaded
- **RSVP/Messages not saving**: Check Firestore security rules and database setup

### Free Tier Limits:
- Firestore: 1 GiB stored, 50,000 reads/day, 20,000 writes/day
- Storage: 1 GB stored, 1 GB downloaded/day
- These limits are sufficient for a birthday party website

## Need Help?
Check the browser console (F12) for detailed error messages if something isn't working.
