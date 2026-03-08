import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface TurnTimerProps {
  seconds: number;
  total: number;
}

const TurnTimer = ({ seconds, total }: TurnTimerProps) => {
  const pct = (seconds / total) * 100;
  const isLow = seconds <= 5;
  const isCritical = seconds <= 3;

  // SVG circle progress
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 52 52">
          <circle
            cx="26" cy="26" r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
          />
          <motion.circle
            cx="26" cy="26" r={radius}
            fill="none"
            stroke={isCritical ? "hsl(var(--destructive))" : isLow ? "hsl(350 80% 60%)" : "hsl(var(--primary))"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transition={{ duration: 0.5, ease: "linear" }}
          />
        </svg>
        <motion.div
          className={`absolute inset-0 flex items-center justify-center font-display font-bold text-lg ${
            isCritical ? "text-destructive" : isLow ? "text-orange-400" : "text-foreground"
          }`}
          animate={isCritical ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {seconds}
        </motion.div>
      </div>
      {isLow && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-destructive font-semibold"
        >
          Hurry up!
        </motion.p>
      )}
    </div>
  );
};

export default TurnTimer;
