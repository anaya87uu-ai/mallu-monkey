import { motion } from "framer-motion";
import { Video, Users, SkipForward, Shield, Heart, Globe, Sparkles } from "lucide-react";

const steps = [
  { icon: Video, title: "Hit Start", desc: "Click 'Start Chatting' and grant camera/mic access." },
  { icon: Users, title: "Get Matched", desc: "We instantly pair you with a random stranger online." },
  { icon: SkipForward, title: "Chat or Skip", desc: "Talk, text, or skip to meet someone new." },
];

const guidelines = [
  { icon: Shield, title: "Be Respectful", desc: "Treat everyone with kindness and respect." },
  { icon: Heart, title: "Stay Appropriate", desc: "No nudity, harassment, or hate speech." },
  { icon: Globe, title: "Have Fun", desc: "Make friends from around the world!" },
];

const About = () => (
  <div className="relative">
    <section className="relative pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="container max-w-3xl text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-6 text-xs font-medium text-primary">
          <Sparkles className="w-3.5 h-3.5" /> About us
        </div>
        <h1 className="display-lg mb-6 text-foreground">
          Real people. <span className="gradient-text">Real moments.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Mallu Monkey is a modern video chat platform that connects you with random strangers for spontaneous, anonymous conversations. No profiles, no algorithms — just real human connections.
        </p>
      </motion.div>
    </section>

    <section className="relative py-12 px-4">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">How it works</p>
          <h2 className="display-lg text-foreground">Three taps to <span className="gradient-text">connect</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card-lg p-8 text-center relative"
            >
              <div className="absolute top-4 right-5 font-display text-5xl font-bold text-primary/10">
                {i + 1}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5 glow-primary">
                <s.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2 text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="relative py-16 px-4">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Community</p>
          <h2 className="display-lg text-foreground">Be a <span className="gradient-text">good human</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {guidelines.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card-lg p-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-mint border border-primary/20 flex items-center justify-center mb-4">
                <g.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{g.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
