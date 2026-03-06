import { Link, useLocation } from "react-router-dom";
import { UserCircle, Gamepad2, Trophy, MessageCircle } from "lucide-react";

const navItems = [
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/leaderboards", label: "Leaders", icon: Trophy },
  { to: "/account", label: "Account", icon: UserCircle },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/30 md:hidden">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_6px_hsl(var(--primary))]" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
