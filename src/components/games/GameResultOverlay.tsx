import { motion } from "framer-motion";
import { Trophy, Frown, Handshake, RotateCcw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameResultOverlayProps {
  result: "win" | "lose" | "draw";
  onPlayAgain: () => void;
  onLeave?: () => void;
  pointsEarned?: number;
}

const confettiColors = [
  "hsl(270 80% 65%)", // primary
  "hsl(190 90% 55%)", // secondary
  "hsl(45 100% 60%)", // gold
  "hsl(340 80% 60%)", // pink
  "hsl(120 60% 50%)", // green
];

const ConfettiPiece = ({ index }: { index: number }) => {
  const color = confettiColors[index % confettiColors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 0.5;
  const size = 4 + Math.random() * 6;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute rounded-sm"
      style={{
        left: `${left}%`,
        top: "-10px",
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        rotate: rotation,
      }}
      initial={{ y: -20, opacity: 1 }}
      animate={{
        y: 300,
        opacity: 0,
        rotate: rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
        x: (Math.random() - 0.5) * 100,
      }}
      transition={{
        duration: 1.5 + Math.random(),
        delay,
        ease: "easeOut",
      }}
    />
  );
};

const GameResultOverlay = ({ result, onPlayAgain, onLeave, pointsEarned }: GameResultOverlayProps) => {
  const config = {
    win: {
      icon: Trophy,
      title: "Victory! 🎉",
      subtitle: "You crushed it!",
      gradient: "from-yellow-500/20 via-primary/20 to-secondary/20",
      iconColor: "text-yellow-400",
      border: "border-yellow-500/30",
    },
    lose: {
      icon: Frown,
      title: "Defeated 😔",
      subtitle: "Better luck next time!",
      gradient: "from-destructive/10 via-muted/20 to-muted/10",
      iconColor: "text-destructive",
      border: "border-destructive/20",
    },
    draw: {
      icon: Handshake,
      title: "It's a Draw! 🤝",
      subtitle: "Evenly matched!",
      gradient: "from-muted/20 via-primary/10 to-secondary/10",
      iconColor: "text-muted-foreground",
      border: "border-border/30",
    },
  };

  const c = config[result];
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15 }}
      className={`relative overflow-hidden rounded-2xl border ${c.border} bg-gradient-to-br ${c.gradient} p-6 text-center`}
    >
      {/* Confetti for wins */}
      {result === "win" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: result === "win" ? [0, -10, 10, 0] : 0 }}
        transition={{ type: "spring", damping: 10, delay: 0.1 }}
      >
        <Icon className={`w-14 h-14 mx-auto ${c.iconColor}`} />
      </motion.div>

      <motion.h3
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-display text-xl font-bold mt-3"
      >
        {c.title}
      </motion.h3>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground"
      >
        {c.subtitle}
      </motion.p>

      {pointsEarned !== undefined && pointsEarned > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold"
        >
          +{pointsEarned} pts
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-2 justify-center mt-4"
      >
        <Button
          onClick={onPlayAgain}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary"
        >
          <RotateCcw className="w-4 h-4 mr-1" /> Play Again
        </Button>
        {onLeave && (
          <Button variant="outline" onClick={onLeave} className="glass border-border/50">
            <LogOut className="w-4 h-4 mr-1" /> Leave
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GameResultOverlay;
