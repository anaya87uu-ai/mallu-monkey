import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, Shield, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const features = [
  { icon: Video, title: "HD Video Chat", desc: "Crystal clear video & voice calls with strangers worldwide" },
  { icon: Shield, title: "Anonymous & Safe", desc: "No personal info required. Chat freely with full privacy" },
  { icon: Users, title: "Gender Filter", desc: "Choose to match with boys, girls, or anyone you prefer" },
  { icon: Zap, title: "Instant Skip", desc: "One tap to skip and connect with someone new instantly" },
];

const GlassOrb = ({ className }: { className?: string }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 ${className}`} />
);

const Index = () => {
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
  <div className="relative overflow-hidden">
    {/* Background orbs */}
    <GlassOrb className="w-96 h-96 bg-primary -top-48 -left-48 animate-float" />
    <GlassOrb className="w-80 h-80 bg-secondary top-1/3 -right-40 animate-float-delayed" />
    <GlassOrb className="w-64 h-64 bg-primary/50 bottom-20 left-1/4 animate-float" />

    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center justify-center px-4">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Meet Strangers.{" "}
            <span className="gradient-text">Make Memories.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Video chat with random people from around the world. Anonymous, instant, and unforgettable connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 h-14 glow-primary">
                Start Chatting <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="glass border-border/50 hover:border-primary/50 text-lg px-8 h-14">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="relative py-24 px-4">
      <div className="container max-w-5xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Why <span className="gradient-text">Mallu Monkey</span>?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center group hover:border-primary/30 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="relative py-24 px-4">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-10 md:p-16 text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="gradient-text">Connect</span>?
          </h2>
          <p className="text-muted-foreground mb-8">Jump in and start meeting new people right now. No signup required.</p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-10 h-14 glow-primary">
              Start Video Chat <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
  );
};

export default Index;
