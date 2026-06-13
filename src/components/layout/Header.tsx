import { Link, useLocation } from "react-router-dom";
import { Cat, LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/useAuthSession";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isLoggedIn, displayLabel, logout } = useAuthSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/75 backdrop-blur-2xl border-b border-primary/15 shadow-[0_8px_32px_-12px_hsl(152_70%_38%/0.15)]"
          : "bg-background/40 backdrop-blur-xl border-b border-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
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
              <span className="text-sm text-muted-foreground flex items-center gap-1 px-3">
                <UserCircle className="w-4 h-4" /> {displayLabel}
              </span>
              <Button variant="outline" size="sm" className="rounded-full glass border-border/50 hover:border-destructive/50" onClick={logout}>
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

        {/* Mobile: only show Join CTA when logged out; profile lives in bottom nav */}
        <div className="md:hidden">
          {!isLoggedIn && (
            <Link to="/auth">
              <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary h-9 px-4 text-xs">
                Join
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
