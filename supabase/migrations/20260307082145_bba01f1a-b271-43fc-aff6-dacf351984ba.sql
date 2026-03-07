
CREATE TABLE public.game_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_x_id text NOT NULL,
  player_x_name text NOT NULL DEFAULT 'Player X',
  player_o_id text,
  player_o_name text DEFAULT 'Player O',
  board text[] NOT NULL DEFAULT ARRAY[NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL]::text[],
  current_turn text NOT NULL DEFAULT 'X',
  winner text,
  status text NOT NULL DEFAULT 'waiting',
  turn_started_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read game rooms" ON public.game_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can insert game rooms" ON public.game_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update game rooms" ON public.game_rooms FOR UPDATE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
