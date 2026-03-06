import { motion } from "framer-motion";
import { Trophy, Construction } from "lucide-react";

const Leaderboards = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 glow-primary">
          <Trophy className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">Leaderboards</h1>
        <div className="glass-card p-8 space-y-4">
          <Construction className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Leaderboards are coming soon! Compete with others and climb the ranks.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboards;
