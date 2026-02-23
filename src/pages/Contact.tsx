import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
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
    <div className="relative overflow-hidden">
      <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-15 bg-secondary -top-36 -left-36 animate-float" />
      <div className="absolute w-60 h-60 rounded-full blur-3xl opacity-15 bg-primary bottom-20 right-0 animate-float-delayed" />

      <section className="relative py-24 px-4">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-muted-foreground">Have a question or feedback? We'd love to hear from you.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                <Input required placeholder="Your name" className="glass border-border/50 bg-muted/30 focus:border-primary/50" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                <Input required type="email" placeholder="you@example.com" className="glass border-border/50 bg-muted/30 focus:border-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
              <Textarea required placeholder="Tell us what's on your mind..." rows={5} className="glass border-border/50 bg-muted/30 focus:border-primary/50 resize-none" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-base glow-primary"
            >
              {loading ? "Sending..." : <>Send Message <Send className="ml-2 w-4 h-4" /></>}
            </Button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
