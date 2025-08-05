# Quick Fix for Profile Creation Issue

## Problem
The Row Level Security (RLS) policy is preventing profile creation during user authentication.

## Solution
Run this SQL command in your Supabase SQL Editor:

```sql
-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new policy that allows profile creation
CREATE POLICY "Users can insert own profile" ON profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Also make sure the select policy works
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT USING (auth.uid() = user_id);
```

## Steps:
1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left menu
3. Click "New query"
4. Copy and paste the SQL above
5. Click "Run"

This should fix the authentication issue and allow users to register properly!