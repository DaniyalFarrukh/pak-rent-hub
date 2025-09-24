-- Fix security vulnerability: Restrict profile access to own profile only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new secure policy that only allows users to view their own profile
CREATE POLICY "Users can only view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);