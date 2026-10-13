import { motion } from "framer-motion";

type Cell = "X" | "O" | null;

interface GameBoardProps {
  board: Cell[];
  winLine: number[] | null;
  disabled: boolean;
  canPlay: boolean;
  onCellClick: (index: number) => void;
}

const GameBoard = ({ board, winLine, disabled, canPlay, onCellClick }: GameBoardProps) => {
  return (
    <div className="relative p-3">
      {/* Glow backdrop */}


      <div className="relative grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
        {board.map((cell, i) => {
          const isWinCell = winLine?.includes(i);
          const isEmpty = !cell;
          const isPlayable = isEmpty && canPlay && !disabled;

          return (
            <motion.button
              key={i}
              initial={false}
              whileTap={isPlayable ? { scale: 0.9 } : {}}
              whileHover={isPlayable ? { scale: 1.05 } : {}}
              onClick={() => onCellClick(i)}
              disabled={disabled || !!cell || !canPlay}
              className={`aspect-square rounded-lg text-3xl font-bold flex items-center justify-center transition-all duration-200 ${
                isWinCell
                  ? "bg-primary/25 border-2 border-primary shadow-none"
                  : cell
                  ? "glass-card border border-border/30"
                  : isPlayable
                  ? "glass border border-border/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                  : "glass border border-border/10 opacity-40"
              }`}
            >
              {cell === "X" && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="text-primary shadow-none"
                >
                  ✕
                </motion.span>
              )}
              {cell === "O" && (
                <motion.span
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="text-secondary-foreground shadow-none"
                >
                  ○
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
