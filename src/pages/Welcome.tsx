import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Video,
  Gamepad2,
  ArrowRight,
  MessageCircle,
  SkipForward,
  Globe2,
  Users,
  Sparkles,
  ShieldCheck,
  Eye,
  Flag,
  UserCheck,
  Zap,
  PlayCircle,
} from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("guest_user");
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/chat", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="relative overflow-hidden">
      {/* Floating decorative orbs */}
      <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-96 -left-16 w-64 h-64 rounded-full bg-accent/20 blur-3xl animate-float-delayed" />
      <div className="pointer-events-none absolute top-[140vh] right-0 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float" />

      {/* ============ HERO ============ */}
      <section className="relative z-10 px-5 pt-8 pb-16 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-card border border-primary/25 rounded-full shadow-sm mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            2,481 Live Now
          </span>
        </motion.div>

        <div className="grid md:grid-cols-[1.15fr_1fr] gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="display-xl font-display font-extrabold text-foreground"
            >
              Meet Strangers.
              <br />
              <span className="gradient-text">Make Memories.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed font-medium max-w-xl"
            >
              Video chat with random people from around the world. Anonymous,
              instant, and unforgettable connections — right in your browser.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center"
            >
              <Link to="/auth" className="block">
                <button className="w-full sm:w-auto px-7 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-primary/30 active:scale-[0.98] hover:scale-[1.02] transition-transform">
                  Sign in with Google
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </Link>
              <a
                href="#how"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-sm text-foreground/80 hover:text-foreground border border-border bg-card/60 hover:bg-card flex items-center justify-center gap-2 transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                See how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 18+ only
              </span>
              <span className="w-px h-3 bg-border" />
              <span>Moderated 24/7</span>
              <span className="w-px h-3 bg-border" />
              <span>Anonymous</span>
              <span className="w-px h-3 bg-border" />
              <span>Free forever</span>
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="relative hidden md:block"
          >
            <div className="glass-card-lg p-5 aspect-[4/5] max-w-sm mx-auto relative overflow-hidden">
              <div className="absolute inset-5 rounded-2xl bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/40" />
              <div className="absolute top-8 left-8 flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
              </div>
              {/* PiP local cam */}
              <div className="absolute bottom-8 right-8 w-24 h-32 rounded-xl bg-gradient-to-br from-forest to-primary/60 border-2 border-background/80 shadow-xl" />
              {/* Floating chat bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-10 left-8 px-3 py-2 rounded-2xl rounded-bl-sm bg-background/90 backdrop-blur-sm border border-border text-xs font-medium max-w-[60%] shadow-md"
              >
                Hey! Where are you from? 👋
              </motion.div>
              {/* Sparkle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ BENTO GRID ============ */}
      <section className="relative z-10 px-5 pb-20 max-w-6xl mx-auto w-full">
        <SectionEyebrow>What you get</SectionEyebrow>
        <SectionTitle>Everything for a great chat</SectionTitle>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 auto-rows-[130px] md:auto-rows-[150px] gap-3 md:gap-4"
        >
          {/* Large: HD video */}
          <BentoTile className="col-span-2 row-span-2 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
            <div className="flex flex-col h-full justify-between">
              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold">HD Video Chat</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Crystal-clear, instant matches with real people, right in your browser.
                </p>
              </div>
            </div>
          </BentoTile>

          {/* Tall: Live stats */}
          <BentoTile className="col-span-2 md:col-span-1 row-span-2">
            <div className="flex flex-col h-full justify-between">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent-foreground flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <Stat number="2,481" label="online now" />
                <Stat number="18k" label="chats today" />
                <Stat number="120+" label="countries" />
              </div>
            </div>
          </BentoTile>

          {/* Small: Skip */}
          <BentoTile>
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
              <SkipForward className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold">One-tap Skip</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Next stranger fast</p>
          </BentoTile>

          {/* Wide: Games */}
          <BentoTile className="col-span-2 md:col-span-2 bg-gradient-to-r from-accent/15 to-transparent">
            <div className="flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base md:text-lg font-bold">Play together</h3>
                <p className="text-xs text-muted-foreground">Tic-Tac-Toe & more, live</p>
              </div>
            </div>
          </BentoTile>

          {/* Small: Text chat */}
          <BentoTile>
            <div className="w-10 h-10 rounded-lg bg-secondary/40 text-secondary-foreground flex items-center justify-center mb-2">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold">Live Text</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Chat while you video</p>
          </BentoTile>

          {/* Medium: Global */}
          <BentoTile className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Globe2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base md:text-lg font-bold">Global reach</h3>
                <div className="flex gap-1.5 mt-1.5 text-lg">
                  <span>🇮🇳</span><span>🇺🇸</span><span>🇧🇷</span><span>🇯🇵</span><span>🇩🇪</span><span>🇦🇪</span>
                </div>
              </div>
            </div>
          </BentoTile>

          {/* Small: Instant */}
          <BentoTile>
            <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold">Instant match</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Under 3 seconds</p>
          </BentoTile>
        </motion.div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="relative z-10 px-5 pb-20 max-w-6xl mx-auto w-full">
        <SectionEyebrow>How it works</SectionEyebrow>
        <SectionTitle>Three taps to your first chat</SectionTitle>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-10 grid md:grid-cols-3 gap-6 md:gap-4 relative"
        >
          {/* connecting line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <Step
            n="1"
            icon={UserCheck}
            title="Sign in with Google"
            desc="One tap, no forms, no email required. You're in."
          />
          <Step
            n="2"
            icon={Zap}
            title="Get matched instantly"
            desc="Our matchmaker pairs you with someone new in seconds."
          />
          <Step
            n="3"
            icon={MessageCircle}
            title="Chat, play, skip"
            desc="Talk, play games, or skip to the next stranger anytime."
          />
        </motion.div>
      </section>

      {/* ============ SAFETY ============ */}
      <section className="relative z-10 px-5 pb-20 max-w-6xl mx-auto w-full">
        <div className="glass-card-lg p-6 md:p-10 bg-primary/5">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            <div>
              <SectionEyebrow>Safety first</SectionEyebrow>
              <SectionTitle>Safe by design</SectionTitle>
              <p className="mt-4 text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                We built Mallu Monkey with strict guardrails so you can meet new people
                without the noise. Reports are actioned within minutes.
              </p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              className="space-y-3"
            >
              <SafetyPill
                icon={ShieldCheck}
                title="18+ only"
                desc="Age-gated entry with terms acceptance"
              />
              <SafetyPill
                icon={Eye}
                title="AI nudity detection"
                desc="Video frames scanned automatically every few seconds"
              />
              <SafetyPill
                icon={Flag}
                title="One-tap report"
                desc="Reports reach our moderators in real time"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative z-10 px-5 pb-24 max-w-3xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="display-lg font-display font-extrabold">
            Your next chat is <span className="gradient-text">one tap away.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Join thousands online right now. No downloads, no signups beyond Google.
          </p>
          <Link to="/auth" className="inline-block mt-8">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-primary/30 active:scale-[0.98] hover:scale-[1.02] transition-transform">
              Sign in with Google
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </Link>
          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
            <span>Moderated 24/7</span>
            <span className="w-px h-3 bg-border" />
            <span>Anonymous</span>
            <span className="w-px h-3 bg-border" />
            <span>Free forever</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

/* ---------- helpers ---------- */

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
    <span className="w-6 h-px bg-primary/60" />
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="display-lg font-display font-extrabold mt-3 max-w-2xl">{children}</h2>
);

const BentoTile = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }}
    className={`glass-card p-4 md:p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const Stat = ({ number, label }: { number: string; label: string }) => (
  <div>
    <div className="font-display text-lg font-extrabold text-foreground leading-none">
      {number}
    </div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
      {label}
    </div>
  </div>
);

const Step = ({
  n,
  icon: Icon,
  title,
  desc,
}: {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }}
    className="relative text-center md:text-left"
  >
    <div className="relative inline-flex items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
        <Icon className="w-7 h-7" />
      </div>
      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card border-2 border-primary text-primary font-display font-bold text-sm flex items-center justify-center shadow">
        {n}
      </span>
    </div>
    <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto md:mx-0">{desc}</p>
  </motion.div>
);

const SafetyPill = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: 20 },
      show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    }}
    className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-colors"
  >
    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-sm font-bold text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </div>
  </motion.div>
);

export default Welcome;
