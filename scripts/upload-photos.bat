@echo off
echo 🎂 Uploading Sample Photos to GCS Bucket
echo =========================================

set BUCKET_NAME=baby-birthday-photos

echo 📥 Downloading and uploading sample photos...

REM Create temp directory
if not exist temp_photos mkdir temp_photos

REM Download and upload baby photos
echo Downloading baby photo 1...
curl -L -o temp_photos\baby1.jpg "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&q=80"
gsutil cp temp_photos\baby1.jpg gs://%BUCKET_NAME%/baby-journey/newborn/photo_1.jpg

echo Downloading baby photo 2...
curl -L -o temp_photos\baby2.jpg "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80"
gsutil cp temp_photos\baby2.jpg gs://%BUCKET_NAME%/baby-journey/month_1/photo_1.jpg

echo Downloading birthday photo 1...
curl -L -o temp_photos\birthday1.jpg "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80"
gsutil cp temp_photos\birthday1.jpg gs://%BUCKET_NAME%/best-photos/precious_smiles/photo_1.jpg

echo Downloading family photo...
curl -L -o temp_photos\family1.jpg "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
gsutil cp temp_photos\family1.jpg gs://%BUCKET_NAME%/best-photos/family_moments/photo_1.jpg

echo Downloading baby photo 3...
curl -L -o temp_photos\baby3.jpg "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80"
gsutil cp temp_photos\baby3.jpg gs://%BUCKET_NAME%/baby-journey/month_2/photo_1.jpg

echo Setting bucket permissions...
gsutil iam ch allUsers:objectViewer gs://%BUCKET_NAME%

echo Cleaning up...
rmdir /s /q temp_photos

echo.
echo ✅ Sample photo upload complete!
echo.
echo 📋 Uploaded photos:
echo • baby-journey/newborn/photo_1.jpg
echo • baby-journey/month_1/photo_1.jpg  
echo • baby-journey/month_2/photo_1.jpg
echo • best-photos/precious_smiles/photo_1.jpg
echo • best-photos/family_moments/photo_1.jpg
echo.
echo 🌐 Test URL:
echo https://storage.googleapis.com/baby-birthday-photos/baby-journey/newborn/photo_1.jpg
