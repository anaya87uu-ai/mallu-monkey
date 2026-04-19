import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, Shield, Users, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const features = [
  { icon: Video, title: "HD Video Chat", desc: "Crystal clear video & voice with people worldwide." },
  { icon: Shield, title: "Anonymous & Safe", desc: "No personal info required. Real privacy, real talk." },
  { icon: Users, title: "Gender Filter", desc: "Match with boys, girls, or anyone you prefer." },
  { icon: Zap, title: "Instant Skip", desc: "One tap to skip and meet someone new." },
];

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
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-4 pt-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-8 text-xs font-medium text-primary"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Live · meet someone new in seconds
          </motion.div>

          <h1 className="display-xl mb-6 text-foreground">
            Meet Strangers.<br />
            <span className="gradient-text">Make Memories.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Video chat with random people from around the world. Anonymous, instant, and unforgettable connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 h-13 glow-primary transition-all hover:-translate-y-0.5 hover:scale-[1.02]">
                Start Chatting <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="ghost" className="rounded-full text-base px-8 h-13 hover:bg-mint/40">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-4">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Why us</p>
            <h2 className="display-lg text-foreground">
              Built for <span className="gradient-text">real connection</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="glass-card-lg p-7 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform glow-primary">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative">
              <h2 className="display-lg mb-4 text-foreground">
                Ready to <span className="gradient-text">connect</span>?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">Jump in and start meeting new people right now. No signup required.</p>
              <Link to="/auth">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base px-10 h-13 glow-primary transition-all hover:-translate-y-0.5">
                  Start Video Chat <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
