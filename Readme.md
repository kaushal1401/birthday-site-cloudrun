# Birthday Site on Cloud Run 🎂

A modern, interactive baby birthday site featuring countdown timer, RSVP system, guest message wall, beautiful butterfly animations, and admin dashboard. Built with React, Material-UI, Firebase Firestore, and deployed on Google Cloud Run.

## ✨ Features

- **🕐 Birthday Countdown Timer** - Live countdown to September 24th, 2025
- **📝 RSVP System** - Guest confirmation with adult/children (5-10 years) options
- **💌 Guest Message Wall** - Interactive message board for birthday wishes
- **🦋 Butterfly Animations** - Beautiful floating butterfly animations
- **👑 Admin Dashboard** - Manage guests, view statistics, delete messages
- **📱 Responsive Design** - Works on all devices
- **🔥 Firebase Integration** - Real-time database with Firestore
- **☁️ Cloud Run Deployment** - Scalable, serverless hosting
- **🎨 Modern UI** - Dark theme with vibrant colors

## 🛠️ Tech Stack

- **Frontend**: React 18, Material-UI v5
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth (for admin features)
- **Hosting**: Google Cloud Run
- **Build**: Docker, Cloud Build
- **Styling**: Material-UI with custom theming

## 🚀 Quick Start

### Prerequisites

1. Google Cloud Platform account with billing enabled
2. Firebase project created
3. Node.js 18+ installed
4. Docker installed
5. Google Cloud SDK installed

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd birthday-site-cloudrun
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   a. Create a Firebase project at https://console.firebase.google.com
   
   b. Enable Firestore Database
   
   c. Create collections:
      - `rsvps` - for guest confirmations
      - `messages` - for guest messages
   
   d. Copy `.env.example` to `.env` and update with your Firebase config:
   ```bash
   cp .env.example .env
   ```
   
   e. Update `.env` with your Firebase project credentials

4. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read/write for RSVP and messages
       match /rsvps/{document} {
         allow read, write: if true;
       }
       match /messages/{document} {
         allow read, write: if true;
       }
     }
   }
   ```

5. **Test locally**
   ```bash
   npm start
   ```
   
   Visit http://localhost:3000 to see the app running.

## 🌐 Deployment to Cloud Run

### Option 1: Automated Deployment (Recommended)

1. **Setup Google Cloud**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Run deployment script**
   ```bash
   ./deploy.sh
   ```

This script will:
- Enable required Google Cloud APIs
- Build the Docker container
- Deploy to Cloud Run
- Configure the service

### Option 2: Manual Deployment

1. **Enable APIs**
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   ```

2. **Build and deploy**
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

3. **Access your site**
   
   Your site will be available at the Cloud Run service URL.

## 🎯 Configuration

### Environment Variables

Create a `.env` file with:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Custom Domain Setup

To use a custom domain:

1. **Map domain in Cloud Run**
   ```bash
   gcloud run domain-mappings create --service birthday-site --domain your-domain.com --region us-central1
   ```

2. **Update DNS records** as instructed by Google Cloud

## 👑 Admin Features

Access the admin dashboard by clicking the floating admin button (bottom-right corner).

**Admin capabilities:**
- View real-time guest statistics
- Manage RSVP list
- Delete inappropriate messages
- Search guests and messages
- View attendance breakdown (adults vs children)

## 📱 Components Overview

### 🕐 EventTimer
- Live countdown to birthday date
- Responsive design with time units
- Automatic timezone handling

### 📝 RSVPForm
- Guest name and email collection
- Adult/Child classification
- Age validation for children (5-10 years)
- Special message option
- Real-time form validation

### 💌 GuestMessageWall
- Real-time message display
- Animated message cards
- Guest type indicators
- Timestamp display
- Message posting form

### 👑 AdminDashboard
- Statistics overview
- Guest list management
- Message moderation
- Search functionality
- Delete capabilities

### 🦋 ButterflyAnimation
- CSS-based animations
- Multiple butterflies
- Smooth floating motion
- Non-intrusive design

## 🔧 Customization

The site is designed to be easily customizable:

1. **Change Birthday Date**: Update the date in `EventTimer.jsx`
2. **Modify Colors**: Edit the theme in `App.jsx`
3. **Update Content**: Modify text and labels throughout components
4. **Add Features**: Extend components or add new ones
5. **Database Structure**: Easily modify Firestore collections

## 📊 Monitoring & Analytics

- Cloud Run provides built-in monitoring
- Firebase console shows database usage
- Real-time user activity visible in admin dashboard

## 💰 Cost Optimization

This setup uses Google Cloud Free Tier resources:
- Cloud Run: 2 million requests/month free
- Firestore: 50K reads, 20K writes/day free
- Container Registry: 0.5GB storage free

## 🔒 Security

- Environment variables for sensitive config
- Nginx security headers
- Firebase security rules
- Input validation and sanitization

## 🆘 Troubleshooting

### Common Issues

1. **Firebase not connecting**: Check .env configuration
2. **Build failures**: Ensure all dependencies are installed
3. **Deployment errors**: Verify Google Cloud project setup
4. **Permission issues**: Check Firebase security rules

### Logs

View Cloud Run logs:
```bash
gcloud logs read --service birthday-site --region us-central1
```

## 📝 License

MIT License - feel free to use for your own celebrations!

## 🎉 Support

For issues or questions, please check:
1. Firebase console for database issues
2. Google Cloud Console for deployment issues
3. Browser developer tools for frontend issues

---

Made with ❤️ for special celebrations | Happy Birthday! 🎂🎈🎉