import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuthSession = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Clean up any legacy guest data
    localStorage.removeItem("guest_user");

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
    setUser(null);
    toast.success("Logged out");
    navigate("/welcome");
  }, [navigate]);

  const isLoggedIn = !!user;
  const displayLabel =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "User";
  const isGuest = false;

  return { user, guestUser: null, isLoggedIn, displayLabel, isGuest, logout };
};
