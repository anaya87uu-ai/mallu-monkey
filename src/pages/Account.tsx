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

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-15 bg-primary -top-40 -right-40 animate-float" />
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-15 bg-secondary bottom-0 -left-32 animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 glow-primary">
            <User className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground mt-2 text-sm">Manage your profile</p>
        </div>

        <div className="glass-card p-8 space-y-6">
          {/* Email (read-only) */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={user?.email || ""}
                disabled
                className="pl-10 glass border-border/50 bg-muted/30 opacity-70"
              />
            </div>
          </div>

          {/* Display Name */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Display Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="pl-10 glass border-border/50 bg-muted/30 focus:border-primary/50"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Gender</Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
              <div className="flex-1">
                <RadioGroupItem value="boy" id="acc-boy" className="peer sr-only" />
                <Label
                  htmlFor="acc-boy"
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${
                    gender === "boy"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 glass text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  👦 Boy
                </Label>
              </div>
              <div className="flex-1">
                <RadioGroupItem value="girl" id="acc-girl" className="peer sr-only" />
                <Label
                  htmlFor="acc-girl"
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${
                    gender === "girl"
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-border/50 glass text-muted-foreground hover:border-secondary/30"
                  }`}
                >
                  👧 Girl
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Account Info */}
          <div className="p-3 rounded-xl border border-border/30 bg-muted/20 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
            </div>
            {profile?.is_banned && (
              <div className="flex items-center gap-2 text-xs text-destructive">
                <Shield className="w-3.5 h-3.5" />
                Account restricted
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-11 glow-primary"
            >
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="glass border-border/50 hover:border-destructive/50 h-11"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
