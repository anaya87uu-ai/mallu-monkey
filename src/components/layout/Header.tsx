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
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [guestUser, setGuestUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("guest_user");
    if (stored) setGuestUser(JSON.parse(stored));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify({ id: session.user.id, email: session.user.email, display_name: session.user.user_metadata?.display_name }));
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

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", onScroll);
    };
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/75 backdrop-blur-2xl border-b border-primary/15 shadow-[0_8px_32px_-12px_hsl(152_70%_38%/0.15)]"
          : "bg-background/40 backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary transition-all group-hover:scale-110 group-hover:rotate-3">
            <Cat className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg gradient-text tracking-tight">Mallu Monkey</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 glass-panel py-1 px-1 rounded-full">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                location.pathname === link.to
                  ? "text-primary-foreground bg-primary shadow-sm glow-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {user ? (
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-foreground hover:bg-mint/40">
                    <UserCircle className="w-4 h-4 mr-1.5" />
                    {displayLabel}
                  </Button>
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground flex items-center gap-1 px-3">
                  <UserCircle className="w-4 h-4" /> {displayLabel}
                </span>
              )}
              <Button variant="outline" size="sm" className="rounded-full glass border-border/50 hover:border-destructive/50" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" /> Log Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary px-5">
                Join Chat
              </Button>
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <button className="text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="container px-4 pb-4 pt-2 flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-mint/30"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-2">
                {isLoggedIn ? (
                  <Button variant="outline" className="w-full rounded-xl glass border-border/50" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                    <LogOut className="w-4 h-4 mr-1" /> Log Out
                  </Button>
                ) : (
                  <Link to="/auth" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full rounded-xl bg-primary text-primary-foreground glow-primary">Join Chat</Button>
                  </Link>
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
