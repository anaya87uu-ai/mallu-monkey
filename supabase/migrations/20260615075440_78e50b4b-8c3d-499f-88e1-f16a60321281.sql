
DROP POLICY IF EXISTS "Players can update active game rooms" ON public.game_rooms;

CREATE POLICY "Players can update active game rooms"
  ON public.game_rooms FOR UPDATE TO anon, authenticated
  USING (status <> 'finished');
