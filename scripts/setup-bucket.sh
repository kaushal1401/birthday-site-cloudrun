#!/bin/bash
# Script to set up GCS bucket for birthday photos

BUCKET_NAME="baby-birthday-photos"
PROJECT_ID="your-project-id"  # Replace with your actual project ID

echo "Setting up GCS bucket: $BUCKET_NAME"

# Create bucket (if it doesn't exist)
gsutil mb -p $PROJECT_ID gs://$BUCKET_NAME

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Create folder structure
echo "Creating folder structure..."

# Baby journey folders
for i in {0..12}; do
    if [ $i -eq 0 ]; then
        folder="newborn"
    else
        folder="month_$i"
    fi
    echo "Creating baby-journey/$folder/"
    gsutil cp /dev/null gs://$BUCKET_NAME/baby-journey/$folder/.keep
done

# Best photos folders
folders=("precious_smiles" "first_steps" "family_moments" "milestone_celebrations" "adorable_poses" "sweet_dreams")
for folder in "${folders[@]}"; do
    echo "Creating best-photos/$folder/"
    gsutil cp /dev/null gs://$BUCKET_NAME/best-photos/$folder/.keep
done

echo "Bucket setup complete!"
echo "Bucket URL: https://storage.googleapis.com/$BUCKET_NAME"
echo ""
echo "To upload photos:"
echo "gsutil cp your-photo.jpg gs://$BUCKET_NAME/baby-journey/newborn/"
echo "gsutil cp your-photo.jpg gs://$BUCKET_NAME/best-photos/precious_smiles/"
