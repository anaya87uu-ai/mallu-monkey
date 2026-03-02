
-- Create trigger to auto-assign admin role for demo account
CREATE OR REPLACE FUNCTION public.assign_demo_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'demo@admin.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Drop if exists, then create trigger on auth.users
DROP TRIGGER IF EXISTS on_demo_admin_created ON auth.users;
CREATE TRIGGER on_demo_admin_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_demo_admin();
