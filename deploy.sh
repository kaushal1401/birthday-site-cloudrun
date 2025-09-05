#!/bin/bash

# Kashvi's First Birthday Site Deployment Script for Google Cloud Platform
# This script deploys to Cloud Run with service name: kashvifirstbirthday

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVICE_NAME="kashvifirstbirthday"
REGION="us-central1"
PLATFORM="managed"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required commands exist
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI not found. Please install Google Cloud SDK."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm not found. Please install Node.js."
        exit 1
    fi
    
    print_success "All dependencies found!"
}

# Get project configuration
get_project_config() {
    print_status "Getting project configuration..."
    
    # Get current project
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    
    if [ -z "$PROJECT_ID" ]; then
        print_error "No active Google Cloud project found."
        print_status "Please run: gcloud auth login && gcloud config set project YOUR_PROJECT_ID"
        exit 1
    fi
    
    print_success "Using project: $PROJECT_ID"
    
    # Set region (default to us-central1)
    REGION=${REGION:-us-central1}
    print_success "Using region: $REGION"
}

# Enable required APIs
enable_apis() {
    print_status "Enabling required Google Cloud APIs..."
    
    gcloud services enable run.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    
    print_success "APIs enabled!"
}

# Build and deploy
deploy() {
    print_status "Starting deployment..."
    
    # Submit build to Cloud Build
    print_status "Building application with Cloud Build..."
    gcloud builds submit --config cloudbuild.yaml .
    
    print_success "Deployment completed!"
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe birthday-site --region=$REGION --format="value(status.url)")
    print_success "Service deployed at: $SERVICE_URL"
}

# Main deployment function
main() {
    echo "🎂 Birthday Site Deployment Script 🎂"
    echo "======================================"
    
    check_dependencies
    get_project_config
    enable_apis
    deploy
    
    echo ""
    print_success "🎉 Deployment completed successfully! 🎉"
    print_status "Your birthday site is now available at: $SERVICE_URL"
    print_warning "Don't forget to:"
    echo "  1. Update Firebase configuration in .env file"
    echo "  2. Set up Firestore database rules"
    echo "  3. Configure custom domain if needed"
}

# Run main function
main "$@"