import { Link, useLocation, useNavigate } from "react-router-dom";
import { Cat, Menu, X, LogOut, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [guestUser, setGuestUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for guest user
    const stored = localStorage.getItem("guest_user");
    if (stored) setGuestUser(JSON.parse(stored));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify({ id: session.user.id, email: session.user.email, display_name: session.user.user_metadata?.display_name }));
        // Clear guest if logged in with real account
        localStorage.removeItem("guest_user");
        setGuestUser(null);
      } else {
        localStorage.removeItem("user");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify({ id: session.user.id, email: session.user.email, display_name: session.user.user_metadata?.display_name }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    localStorage.removeItem("guest_user");
    setGuestUser(null);
    toast.success("Logged out");
    navigate("/");
  };

  const isLoggedIn = !!user || !!guestUser;
  const displayLabel = user?.user_metadata?.display_name || user?.email || guestUser?.name || "Guest";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary transition-all group-hover:scale-110">
            <Cat className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">Mallu Monkey</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {user ? (
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <UserCircle className="w-4 h-4 mr-1" />
                    {displayLabel}
                  </Button>
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <UserCircle className="w-4 h-4" /> {displayLabel}
                </span>
              )}
              <Button variant="outline" size="sm" className="glass border-border/50 hover:border-destructive/50" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" /> Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="glass border-border/50 hover:border-primary/50">
                  Log In
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/30"
          >
            <div className="container px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-2">
                {isLoggedIn ? (
                  <Button variant="outline" className="w-full glass border-border/50" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                    <LogOut className="w-4 h-4 mr-1" /> Log Out
                  </Button>
                ) : (
                  <>
                    <Link to="/auth" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full glass border-border/50">Log In</Button>
                    </Link>
                    <Link to="/auth?mode=signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
