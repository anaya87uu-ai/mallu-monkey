
-- User points and progression table
CREATE TABLE public.user_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  total_points integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  games_won integer NOT NULL DEFAULT 0,
  games_played integer NOT NULL DEFAULT 0,
  login_streak integer NOT NULL DEFAULT 0,
  last_daily_claim timestamp with time zone,
  badges text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read user_points" ON public.user_points
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own points" ON public.user_points
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own points" ON public.user_points
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
