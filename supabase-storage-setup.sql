/*
  # Storage Setup for Car Images

  1. Create Bucket
    - Name: car-images
    - Public: true
    - File size limit: 5MB
    - Allowed MIME types: image/*

  2. Storage Policies
    - Authenticated users can upload
    - Public can view
    - Users can delete their own images
*/

-- Note: Create the bucket "car-images" in the Supabase Dashboard → Storage
-- Set it to PUBLIC and configure file size limit to 5MB

-- Storage Policy for uploads
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'car-images' AND
  auth.role() = 'authenticated'
);

-- Storage Policy for public access
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- Storage Policy for users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'car-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
