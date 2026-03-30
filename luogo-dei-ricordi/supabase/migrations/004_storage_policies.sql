-- Storage Policies for gallery bucket
-- First drop existing policies if any
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- Allow public uploads
CREATE POLICY "Public Access" ON storage.objects
FOR ALL TO anon, authenticated
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');
