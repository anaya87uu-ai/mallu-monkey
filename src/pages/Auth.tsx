import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cat, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const Auth = () => {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState("");
  const [guestGender, setGuestGender] = useState("boy");
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("guest_user");
    if (stored) navigate("/chat", { replace: true });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/chat", { replace: true });
    });
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      toast.success("Signed in with Google!");
      navigate("/chat");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    localStorage.setItem("guest_user", JSON.stringify({ name: guestName.trim(), gender: guestGender }));
    toast.success(`Welcome, ${guestName.trim()}!`);
    navigate("/chat", { state: { guestName: guestName.trim(), guestGender } });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-background via-mint/40 to-background">
      <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-30 bg-primary/40 -top-40 -right-40 animate-float" />
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-30 bg-mint bottom-0 -left-32 animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 glow-primary">
            <Cat className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-forest">Join the Chat</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your name to start connecting
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_20px_60px_-20px_hsl(152_70%_38%/0.2)]">
          <form onSubmit={handleGuest} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  className="pl-10 bg-mint/40 border-border focus:border-primary focus:bg-card transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">I am a</label>
              <RadioGroup value={guestGender} onValueChange={setGuestGender} className="flex gap-4">
                <div className="flex-1">
                  <RadioGroupItem value="boy" id="guest-boy" className="peer sr-only" />
                  <Label
                    htmlFor="guest-boy"
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${
                      guestGender === "boy"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 glass text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    👦 Boy
                  </Label>
                </div>
                <div className="flex-1">
                  <RadioGroupItem value="girl" id="guest-girl" className="peer sr-only" />
                  <Label
                    htmlFor="guest-girl"
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${
                      guestGender === "girl"
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border/50 glass text-muted-foreground hover:border-secondary/30"
                    }`}
                  >
                    👧 Girl
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 glow-primary transition-transform hover:-translate-y-0.5"
            >
              Start Chatting
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 gap-3 bg-card border-primary/30 text-forest hover:bg-mint hover:border-primary/60 hover:-translate-y-0.5 transition-all"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Sign in with Google
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
