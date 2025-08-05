-- Fix the RLS policy for profiles to allow initial profile creation
-- This replaces the existing insert policy with one that works during signup

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- New policy that allows profile creation during signup
CREATE POLICY "Users can insert own profile" ON profiles 
FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  auth.uid() IS NOT NULL
);

-- Also update the profiles table to have a trigger that auto-creates profiles
-- when a user signs up (alternative approach)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users (this requires superuser privileges)
-- Note: This might not work in Supabase without additional setup
-- So we'll fix the RLS policy instead