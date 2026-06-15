
-- Tighten profiles SELECT: only owners and admins can read profile rows
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Tighten game_rooms UPDATE/INSERT
DROP POLICY IF EXISTS "Anyone can update game rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Anyone can insert game rooms" ON public.game_rooms;

-- Allow inserts but require a non-empty player_x_id
CREATE POLICY "Anyone can create game rooms"
  ON public.game_rooms FOR INSERT TO anon, authenticated
  WITH CHECK (player_x_id IS NOT NULL AND length(player_x_id) > 0);

-- Allow updates only while a game is still in progress (prevents rewriting finished games)
CREATE POLICY "Players can update active game rooms"
  ON public.game_rooms FOR UPDATE TO anon, authenticated
  USING (status <> 'finished')
  WITH CHECK (true);
