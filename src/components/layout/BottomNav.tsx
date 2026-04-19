import { Link, useLocation } from "react-router-dom";
import { UserCircle, Gamepad2, Trophy, MessageCircle, Home } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/leaderboards", label: "Leaders", icon: Trophy },
  { to: "/account", label: "Account", icon: UserCircle },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <div className="glass-panel flex items-center justify-around h-14 rounded-2xl px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 drop-shadow-[0_0_6px_hsl(var(--primary))]" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
