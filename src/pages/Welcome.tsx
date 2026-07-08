import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  HelpCircle,
  Check,
  X,
  Star,
  Quote,
  Mic,
  Phone,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


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

      {/* ============ LIVE STATS STRIP ============ */}
      <section className="relative z-10 px-5 pb-20 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LiveStat icon={Users} value={2481} suffix="" label="online right now" tint="primary" />
          <LiveStat icon={MessageCircle} value={18420} suffix="" label="chats today" tint="accent" />
          <LiveStat icon={Globe2} value={127} suffix="+" label="countries connected" tint="secondary" />
        </div>
      </section>

      {/* ============ PRODUCT PREVIEW CAROUSEL ============ */}
      <section className="relative z-10 px-5 pb-20 max-w-6xl mx-auto w-full">
        <div className="text-center md:text-left">
          <SectionEyebrow>Product tour</SectionEyebrow>
          <SectionTitle>See it in action</SectionTitle>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl">
            A peek at the interface — video matching, live text, mini-games, and one-tap skip.
          </p>
        </div>
        <PreviewCarousel />
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="relative z-10 px-5 pb-20 max-w-6xl mx-auto w-full">
        <div className="text-center md:text-left">
          <SectionEyebrow>Loved by users</SectionEyebrow>
          <SectionTitle>What people are saying</SectionTitle>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-8 grid md:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map((t) => (
            <Testimonial key={t.name} {...t} />
          ))}
        </motion.div>
      </section>

      {/* ============ COMPARISON TABLE ============ */}
      <section className="relative z-10 px-5 pb-20 max-w-5xl mx-auto w-full">
        <div className="text-center md:text-left">
          <SectionEyebrow>Why Mallu Monkey</SectionEyebrow>
          <SectionTitle>Better than the rest</SectionTitle>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl">
            A side-by-side look at what makes us different from other random chat sites.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mt-8 glass-card-lg overflow-hidden"
        >
          <div className="hidden md:grid grid-cols-4 border-b border-border/50 bg-primary/5">
            <div className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Feature</div>
            <div className="p-4 text-center text-sm font-display font-extrabold text-primary">
              Mallu Monkey
            </div>
            <div className="p-4 text-center text-sm font-semibold text-muted-foreground">Omegle</div>
            <div className="p-4 text-center text-sm font-semibold text-muted-foreground">Chatroulette</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={`md:grid md:grid-cols-4 border-b border-border/30 last:border-0 p-4 md:p-0 ${
                i % 2 === 1 ? "md:bg-muted/20" : ""
              }`}
            >
              <div className="md:p-4 text-sm font-semibold text-foreground">{row.feature}</div>
              <div className="md:p-4 flex md:justify-center items-center gap-2 mt-2 md:mt-0 bg-primary/5 md:bg-primary/10 rounded-lg md:rounded-none px-3 py-2 md:px-4">
                <span className="md:hidden text-[10px] font-bold uppercase text-primary">Mallu</span>
                <CompareCell value={row.us} highlight />
              </div>
              <div className="md:p-4 flex md:justify-center items-center gap-2 mt-1 md:mt-0 px-3 py-2 md:px-4">
                <span className="md:hidden text-[10px] font-bold uppercase text-muted-foreground">Omegle</span>
                <CompareCell value={row.omegle} />
              </div>
              <div className="md:p-4 flex md:justify-center items-center gap-2 mt-1 md:mt-0 px-3 py-2 md:px-4">
                <span className="md:hidden text-[10px] font-bold uppercase text-muted-foreground">Chatroulette</span>
                <CompareCell value={row.chatroulette} />
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ============ FAQ ============ */}

      <section id="faq" className="relative z-10 px-5 pb-20 max-w-4xl mx-auto w-full">
        <div className="text-center md:text-left">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <SectionTitle>Questions, answered</SectionTitle>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl">
            Everything you need to know about matching, safety, and what happens if things go wrong.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mt-8 grid md:grid-cols-2 gap-6 md:gap-8"
        >
          {FAQ_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <group.icon className="w-4 h-4" />
                </div>
                <h3 className="font-display text-base font-bold">{group.title}</h3>
              </div>
              <Accordion type="single" collapsible className="glass-card px-4 md:px-5">
                {group.items.map((item, i) => (
                  <AccordionItem
                    key={item.q}
                    value={`${group.title}-${i}`}
                    className="border-border/50 last:border-0"
                  >
                    <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </motion.div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          Still stuck?{" "}
          <Link to="/contact" className="text-primary font-semibold hover:underline">
            Contact our team
          </Link>
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

const FAQ_GROUPS: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { q: string; a: string }[];
}[] = [
  {
    title: "How matching works",
    icon: Zap,
    items: [
      {
        q: "How does Mallu Monkey pair me with a stranger?",
        a: "When you enter the lobby with your camera and mic on, our matchmaker looks for another user who's also waiting. Pairing is random and usually takes less than 3 seconds. Once matched, a peer-to-peer WebRTC video call opens directly between the two browsers.",
      },
      {
        q: "Can I pick who I get matched with?",
        a: "No — matches are fully random by design. That's what keeps every conversation fresh and anonymous. You can skip anytime and be re-matched instantly.",
      },
      {
        q: "Why do I need to grant camera and mic access?",
        a: "Both are required to enter the matching queue. Without an active camera and mic, we can't verify you're a real person on the other end, which keeps the experience safe for everyone.",
      },
      {
        q: "What happens when I tap Skip?",
        a: "The current call ends immediately, the stranger is notified, and you're put back into the queue. You'll usually be matched with someone new within a few seconds.",
      },
      {
        q: "Can I get matched with the same person twice?",
        a: "It's rare but possible. With thousands online at any moment, the odds are low — and skipping again puts you right back in the queue.",
      },
    ],
  },
  {
    title: "Safety & moderation",
    icon: ShieldCheck,
    items: [
      {
        q: "Is Mallu Monkey safe to use?",
        a: "Yes. We enforce a strict 18+ policy, run AI-based nudity detection on every video stream every few seconds, and moderators review reports 24/7. Calls are peer-to-peer and not recorded by us.",
      },
      {
        q: "Do you record video or audio?",
        a: "No. Video and audio flow directly between users over encrypted WebRTC. We don't store call content on our servers.",
      },
      {
        q: "How does nudity detection work?",
        a: "A frame from your video is sampled every few seconds and analyzed by an on-platform AI classifier. If explicit content is detected, the call ends instantly and the offending account is flagged for moderator review.",
      },
      {
        q: "How do I report someone?",
        a: "Tap the flag icon during any call. Pick a reason (nudity, harassment, minor, spam, other) and submit. Reports reach our moderators in real time and are usually actioned within minutes.",
      },
      {
        q: "Is my identity shared with strangers?",
        a: "No. Strangers only see an auto-generated display name and a country flag based on IP geolocation. Your Google email, real name, and account details are never shown.",
      },
    ],
  },
  {
    title: "Bans & account issues",
    icon: Flag,
    items: [
      {
        q: "What can get me banned?",
        a: "Nudity or sexual content, harassment, hate speech, threats, sharing another person's private info, appearing under 18, or repeated abuse reports. Serious violations result in an immediate permanent ban.",
      },
      {
        q: "How long do bans last?",
        a: "First-time minor violations can be temporary (24h–7 days). Repeated or serious violations — especially nudity, minors on camera, or threats — are permanent and cannot be appealed.",
      },
      {
        q: "I was banned by mistake. Can I appeal?",
        a: "Yes. Use the Contact page to submit an appeal with your account name and the approximate time of the ban. A human moderator will review the flagged evidence and respond.",
      },
      {
        q: "Can I create a new account after a ban?",
        a: "No. Ban evasion is against our terms. We detect and re-ban new accounts that appear to belong to previously banned users.",
      },
      {
        q: "What if a stranger did something illegal?",
        a: "Report them immediately using the flag icon and, for serious matters, contact your local authorities. We cooperate with valid law-enforcement requests.",
      },
    ],
  },
  {
    title: "Account & privacy",
    icon: HelpCircle,
    items: [
      {
        q: "Why do I need to sign in with Google?",
        a: "Google sign-in lets us block ban evasion and enforce the 18+ rule without collecting passwords. We only use your Google profile to create your account — never to post or read anything on your behalf.",
      },
      {
        q: "Is Mallu Monkey free?",
        a: "Yes, 100% free. No hidden fees, no premium tier, no ads inside calls.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Head to the Contact page and request account deletion — we'll remove your profile, points, and chat stats within a few days.",
      },
      {
        q: "Do you work on mobile?",
        a: "Yes. Mallu Monkey works in any modern mobile browser (Chrome, Safari, Firefox) with a camera and mic. No app install needed.",
      },
    ],
  },
];

/* ---------- Live Stats ---------- */

const AnimatedNumber = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1400, bounce: 0 });
  const rounded = useTransform(spring, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const LiveStat = ({
  icon: Icon,
  value,
  suffix,
  label,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix?: string;
  label: string;
  tint: "primary" | "accent" | "secondary";
}) => {
  const tintCls =
    tint === "primary"
      ? "bg-primary/10 text-primary"
      : tint === "accent"
      ? "bg-accent/20 text-accent-foreground"
      : "bg-secondary/40 text-secondary-foreground";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="glass-card p-5 md:p-6 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tintCls}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <div className="font-display text-2xl md:text-3xl font-extrabold text-foreground leading-none">
          <AnimatedNumber value={value} />
          {suffix}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
      <span className="ml-auto flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Live
      </span>
    </motion.div>
  );
};

/* ---------- Preview Carousel ---------- */

const PREVIEWS = [
  { title: "Video match", subtitle: "HD peer-to-peer video with a real person", icon: Video, accent: "from-primary/30 to-accent/20" },
  { title: "Live text chat", subtitle: "Side chat while you're on video", icon: MessageCircle, accent: "from-accent/30 to-primary/10" },
  { title: "Mini-games", subtitle: "Play Tic-Tac-Toe with your match", icon: Gamepad2, accent: "from-secondary/40 to-primary/20" },
  { title: "One-tap skip", subtitle: "Next stranger in under 3 seconds", icon: SkipForward, accent: "from-primary/25 to-secondary/30" },
];

const PreviewCarousel = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % PREVIEWS.length), 4000);
    return () => clearInterval(id);
  }, []);
  const p = PREVIEWS[index];
  const Icon = p.icon;
  return (
    <div className="mt-8">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card-lg p-4 md:p-6"
      >
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${p.accent} aspect-[16/9] md:aspect-[21/9]`}>
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-background/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-background/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-background/40" />
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-background/50 backdrop-blur-sm text-[10px] font-bold">
            <Wifi className="w-3 h-3 text-primary" /> Connected
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-background/70 backdrop-blur-md text-primary flex items-center justify-center shadow-xl mb-4">
              <Icon className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="font-display text-xl md:text-2xl font-extrabold text-foreground">{p.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">{p.subtitle}</p>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 rounded-full bg-background/60 backdrop-blur-sm border border-border/50">
            <span className="w-7 h-7 rounded-full bg-background/70 flex items-center justify-center">
              <Mic className="w-3.5 h-3.5 text-foreground/70" />
            </span>
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <SkipForward className="w-3.5 h-3.5" />
            </span>
            <span className="w-7 h-7 rounded-full bg-destructive/80 text-destructive-foreground flex items-center justify-center">
              <Phone className="w-3.5 h-3.5 rotate-[135deg]" />
            </span>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
          {PREVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show preview ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* ---------- Testimonials ---------- */

const TESTIMONIALS = [
  { quote: "Way better than the old random chat sites — actually feels safe and the video is crystal clear.", name: "Aarav", country: "🇮🇳", rating: 5 },
  { quote: "The mini-games make it so easy to break the ice. Made real friends across three continents already.", name: "Sofia", country: "🇧🇷", rating: 5 },
  { quote: "One-tap skip is genius. Moderation is legit — I reported someone once and they were gone in minutes.", name: "Kenji", country: "🇯🇵", rating: 5 },
];

const Testimonial = ({
  quote,
  name,
  country,
  rating,
}: {
  quote: string;
  name: string;
  country: string;
  rating: number;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }}
    className="glass-card p-5 md:p-6 flex flex-col h-full"
  >
    <Quote className="w-6 h-6 text-primary/40 mb-3" />
    <p className="text-sm md:text-base text-foreground/90 leading-relaxed flex-1">"{quote}"</p>
    <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/40">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-bold text-sm">
          {name[0]}
        </div>
        <div>
          <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
            {name} <span className="text-base leading-none">{country}</span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ---------- Comparison Table ---------- */

type CompareValue = boolean | string;

const COMPARISON: { feature: string; us: CompareValue; omegle: CompareValue; chatroulette: CompareValue }[] = [
  { feature: "HD video chat", us: true, omegle: false, chatroulette: true },
  { feature: "AI nudity moderation", us: true, omegle: false, chatroulette: false },
  { feature: "Free forever, no ads in calls", us: true, omegle: true, chatroulette: false },
  { feature: "Instant sign-in (no forms)", us: true, omegle: true, chatroulette: false },
  { feature: "Built-in mini-games", us: true, omegle: false, chatroulette: false },
  { feature: "24/7 human moderation", us: true, omegle: false, chatroulette: false },
  { feature: "Works on mobile browsers", us: true, omegle: true, chatroulette: true },
  { feature: "18+ enforced entry", us: true, omegle: false, chatroulette: false },
];

const CompareCell = ({ value, highlight = false }: { value: CompareValue; highlight?: boolean }) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className={`w-5 h-5 ${highlight ? "text-primary" : "text-primary/70"}`} strokeWidth={3} />
    ) : (
      <X className="w-5 h-5 text-muted-foreground/50" strokeWidth={2.5} />
    );
  }
  return <span className={`text-xs font-semibold ${highlight ? "text-primary" : "text-muted-foreground"}`}>{value}</span>;
};

export default Welcome;

