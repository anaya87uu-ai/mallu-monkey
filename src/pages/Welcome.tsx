import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, Gamepad2, ArrowRight, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const guest = localStorage.getItem("guest_user");
    if (guest) {
      navigate("/chat", { replace: true });
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/chat", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex flex-col overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute -top-24 -right-12 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <main className="relative z-10 flex-1 px-5 pt-6 pb-24 max-w-md md:max-w-2xl mx-auto w-full">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-card border border-primary/20 rounded-full shadow-sm mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            2,481 Live Now
          </span>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4 mb-10"
        >
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-foreground leading-[1.05] tracking-tight">
            Meet Strangers.
            <br />
            <span className="text-primary">Make Memories.</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed pr-4 font-medium max-w-xl">
            Video chat with random people from around the world. Anonymous, instant, and unforgettable connections.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-10"
        >
          <FeatureCard
            icon={Video}
            title="Video Chat"
            desc="HD instant matches"
            iconClass="bg-primary/10 text-primary"
          />
          <FeatureCard
            icon={Gamepad2}
            title="Play Games"
            desc="Tic-Tac-Toe & more"
            iconClass="bg-accent/15 text-accent-foreground"
          />
          <FeatureCard
            icon={MessageCircle}
            title="Live Chat"
            desc="Text while you video"
            iconClass="bg-secondary/15 text-secondary-foreground"
          />
          <FeatureCard
            icon={ArrowRight}
            title="One Tap Skip"
            desc="Next stranger fast"
            iconClass="bg-primary/10 text-primary"
          />
        </motion.div>

        {/* CTA Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <Link to="/auth" className="block">
            <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform">
              Start Chatting
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </Link>
          <Link to="/auth" className="block">
            <button className="w-full py-3 text-muted-foreground hover:text-foreground font-bold text-sm transition-colors">
              Sign Up Free
            </button>
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-10 flex items-center justify-center gap-4 text-[11px] text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 18+ only
          </span>
          <span className="w-px h-3 bg-border" />
          <span>Moderated 24/7</span>
          <span className="w-px h-3 bg-border" />
          <span>Anonymous</span>
        </motion.div>
      </main>
    </div>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  desc,
  iconClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  iconClass: string;
}) => (
  <div className="bg-card p-4 rounded-2xl border border-border/60 shadow-sm">
    <div className={`w-10 h-10 ${iconClass} rounded-lg flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-sm font-bold text-foreground">{title}</h3>
    <p className="text-[11px] text-muted-foreground mt-1">{desc}</p>
  </div>
);

export default Welcome;
