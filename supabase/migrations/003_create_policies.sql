-- Complete RLS and Storage Policies
-- Run this in Supabase SQL Editor

-- Storage Policies for gallery bucket
-- Allow public uploads
CREATE POLICY "Public Access" ON storage.objects
FOR ALL TO anon, authenticated
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');

-- Allow anyone to read from gallery
CREATE POLICY "Public Read" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'gallery');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated Delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'gallery');
