-- Rename posts table to items for clarity
ALTER TABLE public.posts RENAME TO items;

-- Add status column if it doesn't have proper values
ALTER TABLE public.items 
  ALTER COLUMN status SET DEFAULT 'draft';

-- Create item_photos table
CREATE TABLE public.item_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create pricing table
CREATE TABLE public.pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  daily_price numeric,
  weekly_price numeric,
  monthly_price numeric,
  currency text NOT NULL DEFAULT 'PKR',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(item_id)
);

-- Create availability table
CREATE TABLE public.availability (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  available_from date NOT NULL,
  available_to date NOT NULL,
  rules text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.item_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for item_photos
CREATE POLICY "Photos are viewable by everyone"
ON public.item_photos FOR SELECT
USING (true);

CREATE POLICY "Users can add photos to their own items"
ON public.item_photos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.items
    WHERE items.id = item_photos.item_id
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete photos from their own items"
ON public.item_photos FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.items
    WHERE items.id = item_photos.item_id
    AND items.user_id = auth.uid()
  )
);

-- RLS Policies for pricing
CREATE POLICY "Pricing is viewable by everyone"
ON public.pricing FOR SELECT
USING (true);

CREATE POLICY "Users can set pricing for their own items"
ON public.pricing FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.items
    WHERE items.id = pricing.item_id
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update pricing for their own items"
ON public.pricing FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.items
    WHERE items.id = pricing.item_id
    AND items.user_id = auth.uid()
  )
);

-- RLS Policies for availability
CREATE POLICY "Availability is viewable by everyone"
ON public.availability FOR SELECT
USING (true);

CREATE POLICY "Users can set availability for their own items"
ON public.availability FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.items
    WHERE items.id = availability.item_id
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update availability for their own items"
ON public.availability FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.items
    WHERE items.id = availability.item_id
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete availability for their own items"
ON public.availability FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.items
    WHERE items.id = availability.item_id
    AND items.user_id = auth.uid()
  )
);

-- Create storage bucket for item photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-photos', 'item-photos', true);

-- Storage policies for item photos
CREATE POLICY "Item photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'item-photos');

CREATE POLICY "Authenticated users can upload item photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'item-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own item photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'item-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own item photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'item-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for better performance
CREATE INDEX idx_item_photos_item_id ON public.item_photos(item_id);
CREATE INDEX idx_pricing_item_id ON public.pricing(item_id);
CREATE INDEX idx_availability_item_id ON public.availability(item_id);
CREATE INDEX idx_items_user_id ON public.items(user_id);
CREATE INDEX idx_items_status ON public.items(status);