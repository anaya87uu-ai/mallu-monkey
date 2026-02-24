import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const AGE_KEY = "mallu_monkey_age_verified";

const AgeGate = ({ children }: { children: React.ReactNode }) => {
  const [verified, setVerified] = useState(() => {
    // Check localStorage synchronously to avoid flash
    try {
      return localStorage.getItem(AGE_KEY) === "true";
    } catch {
      return false;
    }
  });


  const handleAgree = () => {
    localStorage.setItem(AGE_KEY, "true");
    setVerified(true);
  };

  if (verified) return <>{children}</>;

  return (
    <>
      {children}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative glass-card p-8 md:p-10 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-5 glow-primary">
              <ShieldCheck className="w-8 h-8 text-primary-foreground" />
            </div>

            <h2 className="font-display text-2xl font-bold mb-2">Age Verification</h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Mallu Monkey is intended for users who are <strong className="text-foreground">18 years or older</strong>. 
              By continuing, you confirm that you meet the age requirement and agree to our{" "}
              <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a>.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAgree}
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary text-base font-semibold"
              >
                I am 18+ — Enter
              </Button>
              <a
                href="https://www.youtube.com/kids"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                I am under 18 — Leave
              </a>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AgeGate;
