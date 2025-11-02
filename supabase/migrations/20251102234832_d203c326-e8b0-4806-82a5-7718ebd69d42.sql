-- Create chats table to store conversation threads
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id BIGINT REFERENCES public.listings(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(listing_id, renter_id, owner_id)
);

-- Create chat_messages table to store individual chat messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  message TEXT NOT NULL,
  read_status BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats table
CREATE POLICY "Users can view their own chats"
ON public.chats
FOR SELECT
USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Authenticated users can create chats"
ON public.chats
FOR INSERT
WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update their own chats"
ON public.chats
FOR UPDATE
USING (auth.uid() = renter_id OR auth.uid() = owner_id);

-- RLS Policies for chat_messages table
CREATE POLICY "Users can view messages in their chats"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chats
    WHERE chats.id = chat_messages.chat_id
    AND (chats.renter_id = auth.uid() OR chats.owner_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their chats"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.chats
    WHERE chats.id = chat_messages.chat_id
    AND (chats.renter_id = auth.uid() OR chats.owner_id = auth.uid())
  )
);

CREATE POLICY "Users can update read status"
ON public.chat_messages
FOR UPDATE
USING (auth.uid() = receiver_id);

-- Create indexes for better performance
CREATE INDEX idx_chats_renter ON public.chats(renter_id);
CREATE INDEX idx_chats_owner ON public.chats(owner_id);
CREATE INDEX idx_chats_listing ON public.chats(listing_id);
CREATE INDEX idx_chat_messages_chat ON public.chat_messages(chat_id);
CREATE INDEX idx_chat_messages_created ON public.chat_messages(created_at DESC);

-- Create function to update chats updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_chat_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chats
  SET updated_at = now()
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update chat timestamp when new message is sent
CREATE TRIGGER update_chat_timestamp_trigger
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_timestamp();

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;