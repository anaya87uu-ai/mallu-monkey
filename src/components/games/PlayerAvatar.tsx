import { motion } from "framer-motion";

interface PlayerAvatarProps {
  name: string;
  symbol: "X" | "O";
  isActive: boolean;
  score?: number;
}

const PlayerAvatar = ({ name, symbol, isActive, score }: PlayerAvatarProps) => {
  return (
    <motion.div
      animate={isActive ? { scale: 1.05 } : { scale: 1, opacity: 0.6 }}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
            symbol === "X"
              ? "bg-primary/20 text-primary border-2 border-primary/50"
              : "bg-secondary/20 text-secondary border-2 border-secondary/50"
          } ${isActive ? "ring-2 ring-offset-2 ring-offset-background ring-primary/60" : ""}`}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        {isActive && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </div>
      <div className="text-center">
        <p className={`font-semibold text-xs leading-tight truncate max-w-[80px] ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
          {name}
        </p>
        <span className={`text-[10px] font-bold ${symbol === "X" ? "text-primary" : "text-secondary"}`}>
          {symbol === "X" ? "✕" : "○"}
        </span>
        {score !== undefined && (
          <p className="text-[10px] text-muted-foreground">{score} pts</p>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerAvatar;
