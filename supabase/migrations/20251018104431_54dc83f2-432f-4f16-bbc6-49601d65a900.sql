-- Fix search_path for the rating calculation function
CREATE OR REPLACE FUNCTION public.calculate_listing_rating(listing_id bigint)
RETURNS DECIMAL(3, 2)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(AVG(rating), 0)::DECIMAL(3, 2)
  FROM public.reviews
  WHERE reviews.listing_id = $1
$$;