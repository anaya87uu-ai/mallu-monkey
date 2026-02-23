import { motion } from "framer-motion";
import { Video, Users, SkipForward, Shield, Heart, Globe } from "lucide-react";

const steps = [
  { icon: Video, title: "1. Hit Start", desc: "Click 'Start Chatting' and grant camera/mic access." },
  { icon: Users, title: "2. Get Matched", desc: "We instantly pair you with a random stranger online." },
  { icon: SkipForward, title: "3. Chat or Skip", desc: "Talk, text, or skip to meet someone new." },
];

const guidelines = [
  { icon: Shield, title: "Be Respectful", desc: "Treat everyone with kindness and respect." },
  { icon: Heart, title: "Stay Appropriate", desc: "No nudity, harassment, or hate speech." },
  { icon: Globe, title: "Have Fun", desc: "Make friends from around the world!" },
];

const About = () => (
  <div className="relative overflow-hidden">
    <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-15 bg-primary -top-40 right-0 animate-float" />
    <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-15 bg-secondary bottom-40 -left-32 animate-float-delayed" />

    <section className="relative py-24 px-4">
      <div className="container max-w-3xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">Mallu Monkey</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Mallu Monkey is a modern video chat platform that connects you with random strangers for spontaneous, anonymous conversations. No profiles, no algorithms — just real human connections.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="relative py-16 px-4">
      <div className="container max-w-4xl">
        <h2 className="font-display text-3xl font-bold text-center mb-12">
          How It <span className="gradient-text">Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-5">
                <s.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="relative py-16 px-4">
      <div className="container max-w-4xl">
        <h2 className="font-display text-3xl font-bold text-center mb-12">
          Community <span className="gradient-text">Guidelines</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guidelines.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                <g.icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{g.title}</h3>
              <p className="text-sm text-muted-foreground">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
