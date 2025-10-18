-- Add latitude and longitude columns to listings table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for location-based queries
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings(latitude, longitude);

-- Add rating column if it doesn't exist
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 0;

-- Create computed column for average rating from reviews
CREATE OR REPLACE FUNCTION public.calculate_listing_rating(listing_id bigint)
RETURNS DECIMAL(3, 2)
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(AVG(rating), 0)::DECIMAL(3, 2)
  FROM public.reviews
  WHERE reviews.listing_id = $1
$$;

-- Enable realtime for listings table
ALTER PUBLICATION supabase_realtime ADD TABLE listings;