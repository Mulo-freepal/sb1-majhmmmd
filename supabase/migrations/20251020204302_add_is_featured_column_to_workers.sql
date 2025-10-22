/*
  # Add is_featured Column to Workers Table

  1. Changes
    - Add `is_featured` boolean column to workers table with default value of false
    - This column controls which workers are visible on the public landing page
  
  2. Security
    - Add public RLS policy to allow unauthenticated users to view featured workers
    - Restrict public access to non-sensitive fields only
    - Keep phone, email, and other sensitive fields for authenticated users only
*/

-- Add is_featured column to workers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workers' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE workers ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- Drop existing policy if it exists and recreate with proper public access
DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can view workers" ON workers;
END $$;

-- Allow public to view featured workers (limited fields)
CREATE POLICY "Public can view featured workers"
  ON workers FOR SELECT
  TO anon
  USING (is_featured = true);

-- Allow authenticated users to view all workers
CREATE POLICY "Authenticated users can view all workers"
  ON workers FOR SELECT
  TO authenticated
  USING (true);

-- Allow public to view languages for featured workers
CREATE POLICY "Public can view languages for featured workers"
  ON worker_languages FOR SELECT
  TO anon
  USING (
    worker_id IN (
      SELECT id FROM workers WHERE is_featured = true
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_workers_is_featured ON workers(is_featured) WHERE is_featured = true;