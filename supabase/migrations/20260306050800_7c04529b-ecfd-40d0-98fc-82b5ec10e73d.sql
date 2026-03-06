
-- Chat stats table for leaderboard tracking
CREATE TABLE public.chat_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_name text,
  total_chats integer NOT NULL DEFAULT 0,
  total_chat_seconds integer NOT NULL DEFAULT 0,
  longest_chat_seconds integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.chat_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can read leaderboard
CREATE POLICY "Anyone can read chat_stats" ON public.chat_stats
  FOR SELECT TO authenticated USING (true);

-- Users can insert their own stats
CREATE POLICY "Users can insert own stats" ON public.chat_stats
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Users can update their own stats
CREATE POLICY "Users can update own stats" ON public.chat_stats
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Allow anon to read for public leaderboard
CREATE POLICY "Public can read chat_stats" ON public.chat_stats
  FOR SELECT TO anon USING (true);
