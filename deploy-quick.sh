#!/bin/bash

# Quick deploy script for birthday site with GCS integration

echo "🎂 Deploying Kashvi's Birthday Site to Cloud Run..."

# Build the project
echo "📦 Building the project..."
npm run build

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy birthday-site \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)"

echo "✅ Deployment completed!"

# Get the service URL
SERVICE_URL=$(gcloud run services describe birthday-site --region=us-central1 --format='value(status.url)')
echo "🌐 Your birthday site is live at: $SERVICE_URL"

# Optional: Open in browser (uncomment if desired)
# echo "🎉 Opening birthday site..."
# start "$SERVICE_URL" # For Windows
# open "$SERVICE_URL" # For macOS
# xdg-open "$SERVICE_URL" # For Linux
