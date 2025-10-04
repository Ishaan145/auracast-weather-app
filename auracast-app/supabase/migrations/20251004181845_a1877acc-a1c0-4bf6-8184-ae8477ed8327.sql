-- Fix email exposure vulnerability by restricting profiles table SELECT policy
-- Users should only be able to view their own profile, not all profiles

-- Drop the insecure policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Also allow unauthenticated users to view profiles (if needed for public features)
-- Remove this policy if your app doesn't need public profile viewing
CREATE POLICY "Public can view basic profile info"
ON public.profiles
FOR SELECT
TO anon
USING (false);  -- Set to false by default for maximum security, change if needed