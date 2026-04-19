import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Save, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("boy");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUser(session.user);
      setDisplayName(session.user.user_metadata?.display_name || "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || session.user.user_metadata?.display_name || "");
        setGender(data.gender || "boy");
      }
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: displayName, gender },
      });
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: displayName, gender })
        .eq("user_id", user.id);
      if (profileError) throw profileError;

      localStorage.setItem("user", JSON.stringify({ id: user.id, email: user.email, display_name: displayName }));
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initial = (displayName || user?.email || "?")[0]?.toUpperCase();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto space-y-6"
      >
        {/* Profile header */}
        <div className="glass-panel p-8 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent p-[3px]">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center font-display text-3xl font-bold text-foreground">
                  {initial}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold border-2 border-card">
                LVL 1
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">{displayName || "Anonymous"}</h1>
            <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Identity */}
        <div className="glass-panel p-7 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Identity</p>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="pl-10 h-11 rounded-xl bg-muted/40 border-border/50 opacity-70"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                    className="pl-10 h-11 rounded-xl bg-background/60 border-border/60 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="grid grid-cols-2 gap-3">
                  <div>
                    <RadioGroupItem value="boy" id="acc-boy" className="peer sr-only" />
                    <Label
                      htmlFor="acc-boy"
                      className={`flex items-center justify-center gap-2 h-11 rounded-xl cursor-pointer transition-all border ${
                        gender === "boy"
                          ? "border-primary bg-primary/10 text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]"
                          : "border-border/50 bg-background/40 text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      👦 Boy
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="girl" id="acc-girl" className="peer sr-only" />
                    <Label
                      htmlFor="acc-girl"
                      className={`flex items-center justify-center gap-2 h-11 rounded-xl cursor-pointer transition-all border ${
                        gender === "girl"
                          ? "border-primary bg-primary/10 text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]"
                          : "border-border/50 bg-background/40 text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      👧 Girl
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="divider-soft" />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
            </span>
            {profile?.is_banned && (
              <span className="flex items-center gap-1.5 text-destructive font-medium">
                <Shield className="w-3.5 h-3.5" /> Restricted
              </span>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 glow-primary transition-all hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Danger zone */}
        <div className="glass-panel p-6 border border-destructive/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-destructive mb-3">Danger zone</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display font-semibold text-sm text-foreground">Sign out</p>
              <p className="text-xs text-muted-foreground">You can sign back in anytime.</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
            >
              <LogOut className="w-4 h-4 mr-1.5" /> Log out
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
