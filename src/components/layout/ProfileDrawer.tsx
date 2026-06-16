import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Info, Mail, FileText, Lock, UserCircle, LogIn } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const links = [
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
  { to: "/privacy", label: "Privacy", icon: Lock },
  { to: "/terms", label: "Terms", icon: FileText },
];

const ProfileDrawer = ({ open, onOpenChange }: Props) => {
  const { isLoggedIn, displayLabel, logout } = useAuthSession();
  const { isAdmin } = useAdminAuth();
  const initial = (displayLabel || "?")[0].toUpperCase();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background/80 backdrop-blur-2xl border-t border-primary/20 max-h-[85vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-display font-bold text-xl glow-primary shrink-0">
              {isLoggedIn ? initial : <UserCircle className="w-7 h-7" />}
            </div>
            <div className="text-left min-w-0">
              <DrawerTitle className="font-display text-lg truncate">
                {isLoggedIn ? displayLabel : "Not signed in"}
              </DrawerTitle>
              <DrawerDescription className="text-xs">
                {isLoggedIn ? "Signed in with Google" : "Sign in to save points & streaks"}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-2 grid grid-cols-2 gap-2">
          {links.map((l) => (
            <DrawerClose asChild key={l.to}>
              <Link
                to={l.to}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl glass border border-border/40 hover:border-primary/40 hover:bg-mint/30 transition-all text-sm font-medium text-foreground"
              >
                <l.icon className="w-4 h-4 text-primary" /> {l.label}
              </Link>
            </DrawerClose>
          ))}
          {isAdmin && (
            <DrawerClose asChild>
              <Link
                to="/admin"
                className="col-span-2 flex items-center gap-2.5 px-3 py-3 rounded-xl glass border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all text-sm font-semibold text-primary"
              >
                <Shield className="w-4 h-4" /> Admin Dashboard
              </Link>
            </DrawerClose>
          )}
        </div>

        <DrawerFooter className="pt-2 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          {isLoggedIn ? (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                logout();
              }}
              className="w-full h-12 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </Button>
          ) : (
            <DrawerClose asChild>
              <Link to="/auth" className="block">
                <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground glow-primary">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </Button>
              </Link>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProfileDrawer;
