/*
  # Create FAQ Table

  1. New Tables
    - `faqs`
      - `id` (uuid, primary key) - Unique identifier for each FAQ
      - `question` (text, not null) - The FAQ question
      - `answer` (text, not null) - The FAQ answer
      - `category` (text) - Category for grouping FAQs (e.g., 'pricing', 'platform', 'workers')
      - `display_order` (integer, not null, default 0) - Order in which FAQs should be displayed
      - `is_active` (boolean, not null, default true) - Whether the FAQ is visible
      - `created_at` (timestamptz, default now()) - When the FAQ was created
      - `updated_at` (timestamptz, default now()) - When the FAQ was last updated

  2. Security
    - Enable RLS on `faqs` table
    - Add policy for public read access (FAQs are public information)
    - Add policy for authenticated admin users to manage FAQs (future admin panel)

  3. Notes
    - FAQs are publicly readable without authentication
    - Only authenticated users can modify FAQs (for future admin panel)
    - Display order allows flexible reordering of FAQs
*/

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQs are publicly readable"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert FAQs"
  ON faqs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update FAQs"
  ON faqs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete FAQs"
  ON faqs
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_is_active ON faqs(is_active);