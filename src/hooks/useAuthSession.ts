import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GuestUser {
  name: string;
  gender?: string;
}

export const useAuthSession = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("guest_user");
    if (stored) {
      try {
        setGuestUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            display_name: session.user.user_metadata?.display_name,
          }),
        );
        localStorage.removeItem("guest_user");
        setGuestUser(null);
      } else {
        localStorage.removeItem("user");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            display_name: session.user.user_metadata?.display_name,
          }),
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    localStorage.removeItem("guest_user");
    setGuestUser(null);
    setUser(null);
    toast.success("Logged out");
    navigate("/welcome");
  }, [navigate]);

  const isLoggedIn = !!user || !!guestUser;
  const displayLabel =
    user?.user_metadata?.display_name || user?.email || guestUser?.name || "Guest";
  const isGuest = !user && !!guestUser;

  return { user, guestUser, isLoggedIn, displayLabel, isGuest, logout };
};
