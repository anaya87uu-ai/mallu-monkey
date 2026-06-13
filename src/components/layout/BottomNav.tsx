import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { UserCircle, Gamepad2, Trophy, MessageCircle, Home } from "lucide-react";
import ProfileDrawer from "./ProfileDrawer";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/leaderboards", label: "Ranks", icon: Trophy },
];

const BottomNav = () => {
  const location = useLocation();
  const [meOpen, setMeOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pt-2"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
      >
        <div className="glass-panel flex items-stretch justify-around h-16 rounded-2xl px-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 rounded-xl transition-all min-w-0 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                    isActive ? "bg-primary/15 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]" : ""
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? "scale-110 drop-shadow-[0_0_6px_hsl(var(--primary))]" : ""
                    }`}
                  />
                </div>
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMeOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 rounded-xl transition-all min-w-0 ${
              meOpen ? "text-primary" : "text-muted-foreground active:text-foreground"
            }`}
            aria-label="Profile menu"
          >
            <div
              className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                meOpen ? "bg-primary/15 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]" : ""
              }`}
            >
              <UserCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium leading-none">Me</span>
          </button>
        </div>
      </nav>
      <ProfileDrawer open={meOpen} onOpenChange={setMeOpen} />
    </>
  );
};

export default BottomNav;
