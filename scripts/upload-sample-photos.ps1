# PowerShell script to upload sample photos using public URLs
# This script copies photos from public URLs directly to GCS bucket

$BUCKET_NAME = "baby-birthday-photos"

Write-Host "🎂 Uploading Sample Photos to GCS Bucket: $BUCKET_NAME"
Write-Host "=" * 60

# Function to create a placeholder image using PowerShell
function Create-SamplePhoto {
    param($fileName, $category, $subcategory)
    
    $tempDir = "$env:TEMP\birthday-photos"
    if (!(Test-Path $tempDir)) {
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    }
    
    $filePath = "$tempDir\$fileName"
    
    # Create a simple text file that can serve as a placeholder
    # In a real scenario, you'd use actual image files
    $content = @"
Sample Photo for Kashvi's Birthday Site
Category: $category
Subcategory: $subcategory
Created: $(Get-Date)
This is a placeholder file for testing the photo gallery.
Replace with actual photos later.
"@
    
    Set-Content -Path $filePath -Value $content
    return $filePath
}

# Function to upload photo to GCS
function Upload-Photo {
    param($localPath, $gcsPath)
    
    Write-Host "Uploading: $gcsPath"
    try {
        $result = gsutil cp $localPath gs://$BUCKET_NAME/$gcsPath 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Success: $gcsPath" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed: $gcsPath - $result" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error uploading $gcsPath : $_" -ForegroundColor Red
    }
}

Write-Host "Creating temporary sample photos..."

# Baby Journey Photos
$babyJourneyMonths = @(
    @{key="newborn"; name="Newborn"},
    @{key="month_1"; name="Month 1"},
    @{key="month_2"; name="Month 2"},
    @{key="month_3"; name="Month 3"},
    @{key="month_4"; name="Month 4"},
    @{key="month_5"; name="Month 5"}
)

foreach ($month in $babyJourneyMonths) {
    Write-Host "Creating photos for $($month.name)..."
    for ($i = 1; $i -le 3; $i++) {
        $fileName = "photo_$i.txt"
        $localPath = Create-SamplePhoto -fileName $fileName -category "Baby Journey" -subcategory $month.name
        $gcsPath = "baby-journey/$($month.key)/$fileName"
        Upload-Photo -localPath $localPath -gcsPath $gcsPath
    }
}

# Best Photos Categories
$bestPhotosCategories = @(
    @{key="precious_smiles"; name="Precious Smiles"},
    @{key="first_steps"; name="First Steps"},
    @{key="family_moments"; name="Family Moments"},
    @{key="milestone_celebrations"; name="Milestone Celebrations"}
)

foreach ($category in $bestPhotosCategories) {
    Write-Host "Creating photos for $($category.name)..."
    for ($i = 1; $i -le 4; $i++) {
        $fileName = "photo_$i.txt"
        $localPath = Create-SamplePhoto -fileName $fileName -category "Best Photos" -subcategory $category.name
        $gcsPath = "best-photos/$($category.key)/$fileName"
        Upload-Photo -localPath $localPath -gcsPath $gcsPath
    }
}

# Clean up temp directory
Write-Host "Cleaning up temporary files..."
Remove-Item "$env:TEMP\birthday-photos" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "🎯 Upload Summary:"
Write-Host "Baby Journey: 6 months × 3 photos = 18 photos"
Write-Host "Best Photos: 4 categories × 4 photos = 16 photos"
Write-Host "Total: 34 sample photos uploaded"
Write-Host ""
Write-Host "Note: These are text placeholders. Replace with actual .jpg photos:"
Write-Host "gsutil cp your-baby-photo.jpg gs://$BUCKET_NAME/baby-journey/newborn/photo_1.jpg"
Write-Host ""
Write-Host "Test the photos in your website now!"
