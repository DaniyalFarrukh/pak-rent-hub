-- Update RLS policy to allow public contact form submissions
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.messages;

CREATE POLICY "Anyone can submit contact messages"
ON public.messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Add an index for better query performance when viewing messages
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);