/*
  # PAZZLE Platform Database Schema

  1. New Tables
    - `employers`
      - `id` (uuid, primary key) - Unique employer identifier
      - `user_id` (uuid) - Links to auth.users
      - `company_name` (text) - Company name
      - `company_verified` (boolean) - Verification status
      - `contact_email` (text) - Company contact email
      - `contact_phone` (text) - Company phone number
      - `role` (text) - Role: admin, recruiter, viewer
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `workers`
      - `id` (uuid, primary key) - Unique worker identifier
      - `profile_picture_url` (text) - Profile image URL
      - `full_name` (text) - Worker's full name
      - `gender` (text) - Gender
      - `date_of_birth` (date) - Date of birth
      - `email` (text) - Contact email
      - `phone` (text) - Contact phone
      - `location` (text) - Current location/address
      - `availability` (text) - Availability status
      - `current_status` (text) - Employment status
      - `created_at` (timestamptz) - Profile creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `work_experience`
      - `id` (uuid, primary key) - Unique experience entry
      - `worker_id` (uuid) - Links to workers table
      - `employer` (text) - Previous employer name
      - `role` (text) - Job title/role
      - `duties` (text) - Job responsibilities
      - `start_date` (date) - Employment start date
      - `end_date` (date) - Employment end date (null if current)
      - `created_at` (timestamptz) - Entry creation timestamp

    - `worker_languages`
      - `id` (uuid, primary key) - Unique language entry
      - `worker_id` (uuid) - Links to workers table
      - `language` (text) - Language name
      - `proficiency` (text) - Proficiency level: native, fluent, intermediate, basic
      - `created_at` (timestamptz) - Entry creation timestamp

    - `worker_skills`
      - `id` (uuid, primary key) - Unique skill entry
      - `worker_id` (uuid) - Links to workers table
      - `skill` (text) - Skill name
      - `certification` (text) - Related certification (if any)
      - `created_at` (timestamptz) - Entry creation timestamp

    - `worker_references`
      - `id` (uuid, primary key) - Unique reference entry
      - `worker_id` (uuid) - Links to workers table
      - `contact_name` (text) - Reference contact name
      - `position` (text) - Reference position/title
      - `phone` (text) - Reference phone number
      - `email` (text) - Reference email
      - `created_at` (timestamptz) - Entry creation timestamp

    - `shortlisted_workers`
      - `id` (uuid, primary key) - Unique shortlist entry
      - `employer_id` (uuid) - Links to employers table
      - `worker_id` (uuid) - Links to workers table
      - `notes` (text) - Employer notes about worker
      - `created_at` (timestamptz) - Shortlist timestamp

    - `contact_requests`
      - `id` (uuid, primary key) - Unique contact request
      - `employer_id` (uuid) - Links to employers table
      - `worker_id` (uuid) - Links to workers table
      - `message` (text) - Initial contact message
      - `status` (text) - Status: pending, approved, rejected
      - `created_at` (timestamptz) - Request timestamp

  2. Security
    - Enable RLS on all tables
    - Employers can read all worker data
    - Employers can only modify their own data
    - Workers data managed via backend feed (service role)
    - Shortlists and contact requests restricted to owner
*/

-- Create employers table
CREATE TABLE IF NOT EXISTS employers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  company_verified boolean DEFAULT false,
  contact_email text NOT NULL,
  contact_phone text,
  role text DEFAULT 'recruiter' CHECK (role IN ('admin', 'recruiter', 'viewer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_picture_url text,
  full_name text NOT NULL,
  gender text,
  date_of_birth date,
  email text,
  phone text,
  location text,
  availability text,
  current_status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work_experience table
CREATE TABLE IF NOT EXISTS work_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
  employer text NOT NULL,
  role text NOT NULL,
  duties text,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Create worker_languages table
CREATE TABLE IF NOT EXISTS worker_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
  language text NOT NULL,
  proficiency text CHECK (proficiency IN ('native', 'fluent', 'intermediate', 'basic')),
  created_at timestamptz DEFAULT now()
);

-- Create worker_skills table
CREATE TABLE IF NOT EXISTS worker_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
  skill text NOT NULL,
  certification text,
  created_at timestamptz DEFAULT now()
);

-- Create worker_references table
CREATE TABLE IF NOT EXISTS worker_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
  contact_name text NOT NULL,
  position text,
  phone text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Create shortlisted_workers table
CREATE TABLE IF NOT EXISTS shortlisted_workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE NOT NULL,
  worker_id uuid REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employer_id, worker_id)
);

-- Create contact_requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE NOT NULL,
  worker_id uuid REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlisted_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Employers policies
CREATE POLICY "Employers can view own profile"
  ON employers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Employers can update own profile"
  ON employers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employers can insert own profile"
  ON employers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Workers policies (read-only for authenticated employers)
CREATE POLICY "Authenticated users can view workers"
  ON workers FOR SELECT
  TO authenticated
  USING (true);

-- Work experience policies
CREATE POLICY "Authenticated users can view work experience"
  ON work_experience FOR SELECT
  TO authenticated
  USING (true);

-- Worker languages policies
CREATE POLICY "Authenticated users can view languages"
  ON worker_languages FOR SELECT
  TO authenticated
  USING (true);

-- Worker skills policies
CREATE POLICY "Authenticated users can view skills"
  ON worker_skills FOR SELECT
  TO authenticated
  USING (true);

-- Worker references policies
CREATE POLICY "Authenticated users can view references"
  ON worker_references FOR SELECT
  TO authenticated
  USING (true);

-- Shortlisted workers policies
CREATE POLICY "Employers can view own shortlist"
  ON shortlisted_workers FOR SELECT
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM employers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can add to shortlist"
  ON shortlisted_workers FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id IN (
      SELECT id FROM employers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can remove from shortlist"
  ON shortlisted_workers FOR DELETE
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM employers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update shortlist notes"
  ON shortlisted_workers FOR UPDATE
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM employers WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    employer_id IN (
      SELECT id FROM employers WHERE user_id = auth.uid()
    )
  );

-- Contact requests policies
CREATE POLICY "Employers can view own contact requests"
  ON contact_requests FOR SELECT
  TO authenticated
  USING (
    employer_id IN (
      SELECT id FROM employers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can create contact requests"
  ON contact_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id IN (
      SELECT id FROM employers WHERE user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_employers_user_id ON employers(user_id);
CREATE INDEX IF NOT EXISTS idx_work_experience_worker_id ON work_experience(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_languages_worker_id ON worker_languages(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_skills_worker_id ON worker_skills(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_references_worker_id ON worker_references(worker_id);
CREATE INDEX IF NOT EXISTS idx_shortlisted_workers_employer_id ON shortlisted_workers(employer_id);
CREATE INDEX IF NOT EXISTS idx_shortlisted_workers_worker_id ON shortlisted_workers(worker_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_employer_id ON contact_requests(employer_id);
CREATE INDEX IF NOT EXISTS idx_workers_full_name ON workers(full_name);
CREATE INDEX IF NOT EXISTS idx_workers_location ON workers(location);