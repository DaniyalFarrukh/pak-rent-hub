-- Create listings table
CREATE TABLE public.listings (
  id bigserial PRIMARY KEY,
  owner uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text,
  description text,
  location text,
  price numeric(12,2),
  available boolean DEFAULT true,
  photos text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id bigserial PRIMARY KEY,
  listing_id bigint NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  reviewer uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Listings policies: public can view, only owner can modify
CREATE POLICY "Anyone can view available listings"
  ON public.listings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own listings"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own listings"
  ON public.listings FOR UPDATE
  USING (auth.uid() = owner);

CREATE POLICY "Users can delete their own listings"
  ON public.listings FOR DELETE
  USING (auth.uid() = owner);

-- Reviews policies: public can read, authenticated users can insert
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer);

-- Create storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings-photos', 'listings-photos', true);

-- Storage policies for listings-photos bucket
CREATE POLICY "Anyone can view listing photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings-photos');

CREATE POLICY "Authenticated users can upload listing photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listings-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own listing photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'listings-photos' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own listing photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listings-photos' AND auth.uid() = owner);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_listings_updated_at();