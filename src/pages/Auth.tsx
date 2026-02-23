import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cat, Mail, Lock, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("boy");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success(isSignup ? "Account created! Check your email to verify." : "Logged in!");
      setLoading(false);
    }, 1000);
  };

  const handleGuest = () => {
    toast.success("Joined as guest! Some features may be limited.");
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
                    <Input required placeholder="Your display name" className="pl-10 glass border-border/50 bg-muted/30 focus:border-primary/50" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input required type="email" placeholder="you@example.com" className="pl-10 glass border-border/50 bg-muted/30 focus:border-primary/50" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input required type="password" placeholder="••••••••" className="pl-10 glass border-border/50 bg-muted/30 focus:border-primary/50" />
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
              onClick={handleGuest}
              className="w-full glass border-border/50 hover:border-primary/30 h-11"
            >
              <LogIn className="mr-2 w-4 h-4" /> Continue as Guest
            </Button>
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
