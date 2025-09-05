# PowerShell script to set up GCS bucket for birthday photos

$BUCKET_NAME = "baby-birthday-photos"
$PROJECT_ID = "your-project-id"  # Replace with your actual project ID

Write-Host "Setting up GCS bucket: $BUCKET_NAME"

# Create bucket (if it doesn't exist)
gsutil mb -p $PROJECT_ID gs://$BUCKET_NAME

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Create folder structure
Write-Host "Creating folder structure..."

# Baby journey folders
$months = @("newborn", "month_1", "month_2", "month_3", "month_4", "month_5", "month_6", "month_7", "month_8", "month_9", "month_10", "month_11", "month_12")
foreach ($month in $months) {
    Write-Host "Creating baby-journey/$month/"
    # Create a temporary file and upload it to create the folder
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value ""
    gsutil cp $tempFile gs://$BUCKET_NAME/baby-journey/$month/.keep
    Remove-Item $tempFile
}

# Best photos folders
$categories = @("precious_smiles", "first_steps", "family_moments", "milestone_celebrations", "adorable_poses", "sweet_dreams")
foreach ($category in $categories) {
    Write-Host "Creating best-photos/$category/"
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value ""
    gsutil cp $tempFile gs://$BUCKET_NAME/best-photos/$category/.keep
    Remove-Item $tempFile
}

Write-Host "Bucket setup complete!"
Write-Host "Bucket URL: https://storage.googleapis.com/$BUCKET_NAME"
Write-Host ""
Write-Host "To upload photos:"
Write-Host "gsutil cp your-photo.jpg gs://$BUCKET_NAME/baby-journey/newborn/"
Write-Host "gsutil cp your-photo.jpg gs://$BUCKET_NAME/best-photos/precious_smiles/"

Write-Host ""
Write-Host "Example photo upload commands:"
Write-Host "gsutil cp C:\path\to\baby-photo.jpg gs://$BUCKET_NAME/baby-journey/newborn/photo_1.jpg"
Write-Host "gsutil cp C:\path\to\family-photo.jpg gs://$BUCKET_NAME/best-photos/family_moments/photo_1.jpg"
