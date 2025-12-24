-- =============================================
-- USER PROFILES TABLE FOR EMAIL LOOKUP
-- =============================================
-- This table stores public user information and enables
-- email-based user lookup for adding members to groups

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all profiles (needed for member search)
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Profiles are created automatically on signup (via trigger)
CREATE POLICY "Profiles are created on signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- TRIGGER TO AUTO-CREATE PROFILE ON USER SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-populate profiles table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- BACKFILL EXISTING USERS
-- =============================================
-- This will create profiles for any existing users
-- Run this after creating the table

INSERT INTO public.profiles (id, email, full_name)
SELECT 
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    split_part(email, '@', 1)
  ) as full_name
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PROFILES TABLE CREATED SUCCESSFULLY
-- =============================================
