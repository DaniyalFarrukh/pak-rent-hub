-- Update the function to set search_path (fixing security warning)
CREATE OR REPLACE FUNCTION public.update_listings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;