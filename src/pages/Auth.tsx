import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cat, Mail, Lock, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("boy");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestGender, setGuestGender] = useState("boy");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName, gender },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Logged in!");
        navigate("/chat");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    toast.success(`Welcome, ${guestName.trim()}! Some features may be limited.`);
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
          <h1 className="font-display text-3xl font-bold">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {isSignup ? "Join Mallu Monkey and start connecting" : "Log in to continue chatting"}
          </p>
        </div>

        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            <motion.form
              key={isSignup ? "signup" : "login"}
              initial={{ opacity: 0, x: isSignup ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignup ? -20 : 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {isSignup && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                      className="pl-10 glass border-border/50 bg-muted/30 focus:border-primary/50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 glass border-border/50 bg-muted/30 focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="pl-10 glass border-border/50 bg-muted/30 focus:border-primary/50"
                  />
                </div>
              </div>

              {isSignup && (
                <div>
                  <label className="text-sm font-medium mb-3 block">I am a</label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                    <div className="flex-1">
                      <RadioGroupItem value="boy" id="boy" className="peer sr-only" />
                      <Label
                        htmlFor="boy"
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
                      <RadioGroupItem value="girl" id="girl" className="peer sr-only" />
                      <Label
                        htmlFor="girl"
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
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 glow-primary"
              >
                {loading ? "Please wait..." : isSignup ? "Create Account" : "Log In"}
              </Button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/30" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">or</span></div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowGuestForm(!showGuestForm)}
              className="w-full glass border-border/50 hover:border-primary/30 h-11"
            >
              <LogIn className="mr-2 w-4 h-4" /> Continue as Guest
            </Button>

            <AnimatePresence>
              {showGuestForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleGuest}
                  className="space-y-4 overflow-hidden"
                >
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
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-11 glow-primary"
                  >
                    Join as Guest
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary hover:underline font-medium">
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
