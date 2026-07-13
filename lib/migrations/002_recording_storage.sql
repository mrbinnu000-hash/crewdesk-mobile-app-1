-- CreateRecordingStorageBucket
-- Sets up Supabase Storage for call recordings

-- This migration creates a storage bucket for call recordings.
-- Note: Storage buckets must be created via the Supabase dashboard.
-- This file documents the setup steps.

-- MANUAL SETUP REQUIRED:
-- 1. Go to Supabase Dashboard → Storage
-- 2. Create new bucket named "recordings"
-- 3. Set privacy to PRIVATE
-- 4. Add the following policies:

-- Policy 1: Allow authenticated users to upload recordings to their business folder
-- CREATE POLICY "Users can upload recordings to their business"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'recordings' AND
--   (storage.foldername(name))[1] = (
--     SELECT business_id FROM profiles WHERE id = auth.uid()
--   )
-- );

-- Policy 2: Allow authenticated users to read recordings from their business folder
-- CREATE POLICY "Users can read recordings from their business"
-- ON storage.objects
-- FOR SELECT
-- TO authenticated
-- USING (
--   bucket_id = 'recordings' AND
--   (storage.foldername(name))[1] = (
--     SELECT business_id FROM profiles WHERE id = auth.uid()
--   )
-- );

-- Policy 3: Allow authenticated users to delete recordings from their business folder
-- CREATE POLICY "Users can delete recordings from their business"
-- ON storage.objects
-- FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'recordings' AND
--   (storage.foldername(name))[1] = (
--     SELECT business_id FROM profiles WHERE id = auth.uid()
--   )
-- );

-- Bucket Structure:
-- recordings/
--   {business_id}/
--     {call_id}.mp3

-- Example path:
-- recordings/550e8400-e29b-41d4-a716-446655440000/call_12345.mp3

-- File Format:
-- - Format: MP3 (audio/mpeg)
-- - Max size: 100MB per file
-- - Retention: Customer configurable (recommend 90 days)

-- Access:
-- - Via signed URLs (1 hour expiry by default)
-- - Only accessible by users in the same business
-- - Download via `/api/recordings/download?callId={id}`

-- Security:
-- - Private bucket (no public access)
-- - RLS policies enforce business isolation
-- - Signed URLs prevent unauthorized access
-- - URL expiry prevents long-term sharing

-- Monitoring:
-- - Check bucket size in Storage dashboard
-- - Monitor download patterns
-- - Set up alerts for storage quota
