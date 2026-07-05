
-- 1. Improve handle_new_user to prefer full_name / name from OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  resolved_name TEXT;
BEGIN
  resolved_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'name', ''),
    NULLIF(NEW.raw_user_meta_data->>'display_name', ''),
    split_part(COALESCE(NEW.email,''), '@', 1),
    'User'
  );

  INSERT INTO public.profiles (user_id, display_name, gender)
  VALUES (
    NEW.id,
    resolved_name,
    COALESCE(NEW.raw_user_meta_data->>'gender', 'boy')
  )
  ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name;

  INSERT INTO public.user_points (user_id, display_name)
  VALUES (NEW.id, resolved_name)
  ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name;

  RETURN NEW;
END;
$$;

-- 2. Backfill display_name across profiles, user_points, chat_stats from auth.users metadata
WITH src AS (
  SELECT
    u.id AS user_id,
    COALESCE(
      NULLIF(u.raw_user_meta_data->>'full_name', ''),
      NULLIF(u.raw_user_meta_data->>'name', ''),
      NULLIF(u.raw_user_meta_data->>'display_name', ''),
      split_part(COALESCE(u.email,''), '@', 1),
      'User'
    ) AS resolved_name
  FROM auth.users u
)
UPDATE public.profiles p
SET display_name = s.resolved_name
FROM src s
WHERE p.user_id = s.user_id
  AND (p.display_name IS NULL OR p.display_name IN ('User','Anonymous','App','') OR p.display_name = 'F');

WITH src AS (
  SELECT p.user_id, p.display_name FROM public.profiles p
)
UPDATE public.user_points up
SET display_name = s.display_name
FROM src s
WHERE up.user_id = s.user_id
  AND (up.display_name IS NULL OR up.display_name IN ('Anonymous','User','App',''));

UPDATE public.chat_stats cs
SET display_name = p.display_name
FROM public.profiles p
WHERE cs.user_id = p.user_id
  AND (cs.display_name IS NULL OR cs.display_name IN ('Anonymous','User','App',''));

-- 3. Trigger: keep display_name in user_points & chat_stats in sync when profile changes
CREATE OR REPLACE FUNCTION public.sync_display_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.user_points SET display_name = NEW.display_name WHERE user_id = NEW.user_id;
  UPDATE public.chat_stats SET display_name = NEW.display_name WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_display_name ON public.profiles;
CREATE TRIGGER trg_sync_display_name
AFTER UPDATE OF display_name ON public.profiles
FOR EACH ROW
WHEN (OLD.display_name IS DISTINCT FROM NEW.display_name)
EXECUTE FUNCTION public.sync_display_name();
