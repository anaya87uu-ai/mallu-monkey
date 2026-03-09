import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemoryMatch } from "@/hooks/useMemoryMatch";
import GameResultOverlay from "./GameResultOverlay";

interface MemoryMatchGameProps {
  userId: string | null;
  mode: "solo" | "bot";
}

const MemoryMatchGame = ({ userId, mode }: MemoryMatchGameProps) => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const game = useMemoryMatch(mode, difficulty);

  const getResult = (): "win" | "lose" | "draw" | null => {
    if (!game.gameOver) return null;
    if (game.winner === "player") return "win";
    if (game.winner === "bot") return "lose";
    return "draw";
  };

  const result = getResult();

  return (
    <div className="space-y-4">
      {/* Difficulty */}
      {mode === "bot" && (
        <div className="flex gap-2 justify-center">
          {(["easy", "medium", "hard"] as const).map((d) => (
            <Button
              key={d}
              size="sm"
              variant={difficulty === d ? "default" : "outline"}
              onClick={() => { setDifficulty(d); game.reset(); }}
              className={`transition-all ${
                difficulty === d
                  ? "bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20"
                  : "glass border-border/50 hover:border-primary/30"
              }`}
            >
              {d === "easy" ? "🟢" : d === "medium" ? "🟡" : "🔴"} {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>
      )}

      {/* Score bar */}
      <div className="flex items-center justify-between px-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold">You: {game.matches}</span>
        </div>
        <span className="text-xs text-muted-foreground">Turns: {game.turns}</span>
        {mode === "bot" && (
          <div className="flex items-center gap-2">
            <span className="text-secondary font-bold">Bot: {game.botMatches}</span>
          </div>
        )}
      </div>

      {/* Turn indicator */}
      {mode === "bot" && !game.gameOver && (
        <div className={`text-center text-xs font-semibold py-1 rounded-lg ${
          game.isPlayerTurn ? "text-primary bg-primary/10" : "text-secondary bg-secondary/10"
        }`}>
          {game.isPlayerTurn ? "⚡ Your turn!" : "🤖 Bot is thinking…"}
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-4 gap-2">
        {game.cards.map((card, i) => (
          <motion.button
            key={card.id}
            onClick={() => game.flipCard(i)}
            whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
            className={`aspect-square rounded-xl text-2xl font-bold flex items-center justify-center transition-all duration-300 ${
              card.matched
                ? "bg-primary/20 border border-primary/30 scale-95"
                : card.flipped
                ? "bg-accent border border-accent-foreground/20"
                : "bg-muted/40 border border-border/30 hover:border-primary/40 cursor-pointer"
            }`}
            disabled={card.flipped || card.matched || game.gameOver || (!game.isPlayerTurn && mode === "bot")}
          >
            <motion.span
              initial={false}
              animate={{ rotateY: card.flipped || card.matched ? 0 : 180, opacity: card.flipped || card.matched ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {card.flipped || card.matched ? card.emoji : ""}
            </motion.span>
            {!card.flipped && !card.matched && (
              <span className="text-muted-foreground/30 text-lg">?</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Reset */}
      <div className="text-center">
        <Button variant="outline" size="sm" onClick={game.reset} className="glass border-border/50">
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> New Game
        </Button>
      </div>

      {result && (
        <GameResultOverlay
          result={result}
          onPlayAgain={game.reset}
          pointsEarned={result === "win" ? 50 : result === "draw" ? 10 : 0}
        />
      )}
    </div>
  );
};

export default MemoryMatchGame;
