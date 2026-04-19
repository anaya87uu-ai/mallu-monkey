import { motion } from "framer-motion";
import { Mail, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative">
      <section className="relative py-20 px-4">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 glow-primary">
              <MessageCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="display-lg text-foreground mb-3">
              Get in <span className="gradient-text">touch</span>
            </h1>
            <p className="text-muted-foreground text-lg">Have a question or feedback? We'd love to hear from you.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit}
            className="glass-panel p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Name</label>
                <Input required placeholder="Your name" className="h-12 rounded-xl bg-background/60 border-border/60 focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                <Input required type="email" placeholder="you@example.com" className="h-12 rounded-xl bg-background/60 border-border/60 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Message</label>
              <Textarea required placeholder="Tell us what's on your mind..." rows={5} className="rounded-xl bg-background/60 border-border/60 focus:border-primary resize-none" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base glow-primary transition-all hover:-translate-y-0.5"
            >
              {loading ? "Sending..." : <>Send Message <Send className="ml-2 w-4 h-4" /></>}
            </Button>
          </motion.form>

          <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> We typically reply within 24 hours
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
