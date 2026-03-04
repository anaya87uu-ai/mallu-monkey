import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cat, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState("");
  const [guestGender, setGuestGender] = useState("boy");

  useEffect(() => {
    const stored = localStorage.getItem("guest_user");
    if (stored) navigate("/chat", { replace: true });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/chat", { replace: true });
    });
  }, [navigate]);

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
            <Cat className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">Join the Chat</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your name to start connecting
          </p>
        </div>

        <div className="glass-card p-8">
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
                  className="pl-10 glass border-border/50 bg-muted/30 focus:border-primary/50"
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
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 glow-primary"
            >
              Start Chatting
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
