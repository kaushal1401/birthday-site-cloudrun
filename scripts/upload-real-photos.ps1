# PowerShell script to upload actual sample photos to GCS
Write-Host "🎂 Uploading Sample Photos to GCS Bucket"
Write-Host "========================================="

$BUCKET_NAME = "baby-birthday-photos"

# Check if bucket exists
Write-Host "Checking bucket access..."
$bucketCheck = gsutil ls gs://$BUCKET_NAME 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cannot access bucket. Please check permissions." -ForegroundColor Red
    exit 1
}

# Create a temporary directory for downloading photos
$tempDir = "temp_sample_photos"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host "📥 Downloading sample photos..."

# Sample photo URLs (actual baby/birthday photos from free sources)
$samplePhotos = @(
    @{
        url = "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&q=80"
        name = "baby_1.jpg"
        category = "baby-journey/newborn"
    },
    @{
        url = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80"
        name = "baby_2.jpg"
        category = "baby-journey/month_1"
    },
    @{
        url = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80"
        name = "birthday_1.jpg"
        category = "best-photos/precious_smiles"
    },
    @{
        url = "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
        name = "birthday_2.jpg"
        category = "best-photos/family_moments"
    },
    @{
        url = "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80"
        name = "baby_3.jpg"
        category = "baby-journey/month_2"
    },
    @{
        url = "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80"
        name = "family_1.jpg"
        category = "best-photos/milestone_celebrations"
    }
)

# Download photos
foreach ($photo in $samplePhotos) {
    try {
        Write-Host "Downloading $($photo.name)..." -ForegroundColor Yellow
        $filePath = Join-Path $tempDir $photo.name
        Invoke-WebRequest -Uri $photo.url -OutFile $filePath -UseBasicParsing
        
        if (Test-Path $filePath) {
            $fileSize = (Get-Item $filePath).Length
            Write-Host "✅ Downloaded $($photo.name) ($fileSize bytes)" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "❌ Failed to download $($photo.name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📤 Uploading photos to GCS..."

# Upload photos to GCS
foreach ($photo in $samplePhotos) {
    $localFile = Join-Path $tempDir $photo.name
    if (Test-Path $localFile) {
        $gcsPath = "gs://$BUCKET_NAME/$($photo.category)/photo_1.jpg"
        
        Write-Host "Uploading to $gcsPath..." -ForegroundColor Yellow
        
        try {
            gsutil cp $localFile $gcsPath
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Uploaded $($photo.name)" -ForegroundColor Green
            } else {
                Write-Host "❌ Failed to upload $($photo.name)" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "❌ Upload error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Make sure bucket is publicly readable
Write-Host ""
Write-Host "🔓 Setting bucket permissions..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Clean up temp directory
Write-Host ""
Write-Host "🧹 Cleaning up..."
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}

Write-Host ""
Write-Host "✅ Sample photo upload complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Uploaded photos:"
Write-Host "• baby-journey/newborn/photo_1.jpg"
Write-Host "• baby-journey/month_1/photo_1.jpg"
Write-Host "• baby-journey/month_2/photo_1.jpg"
Write-Host "• best-photos/precious_smiles/photo_1.jpg"
Write-Host "• best-photos/family_moments/photo_1.jpg"
Write-Host "• best-photos/milestone_celebrations/photo_1.jpg"
Write-Host ""
Write-Host "🌐 Test URLs:"
Write-Host "https://storage.googleapis.com/baby-birthday-photos/baby-journey/newborn/photo_1.jpg"
Write-Host "https://storage.googleapis.com/baby-birthday-photos/best-photos/precious_smiles/photo_1.jpg"
