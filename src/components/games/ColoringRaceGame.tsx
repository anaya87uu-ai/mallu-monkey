import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useColoringRace } from "@/hooks/useColoringRace";
import GameResultOverlay from "./GameResultOverlay";

interface ColoringRaceGameProps {
  userId: string | null;
  mode: "solo" | "bot";
}

const ColoringRaceGame = ({ userId, mode }: ColoringRaceGameProps) => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const game = useColoringRace(mode, difficulty);

  const getResult = (): "win" | "lose" | "draw" | null => {
    if (!game.gameOver) return null;
    if (game.winner === "player") return "win";
    if (game.winner === "bot") return "lose";
    return "draw";
  };

  const result = getResult();
  const totalCells = game.gridSize * game.gridSize;

  if (!game.isRunning && !game.gameOver) {
    return (
      <div className="text-center space-y-5 py-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center mx-auto"
        >
          <Palette className="w-10 h-10 text-primary" />
        </motion.div>
        <div>
          <h3 className="font-display text-xl font-bold">Coloring Race</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "bot" ? "Race the bot to color the most cells!" : "Color the entire grid as fast as you can!"}
          </p>
        </div>

        {mode === "bot" && (
          <div className="flex gap-2 justify-center">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={difficulty === d ? "default" : "outline"}
                onClick={() => setDifficulty(d)}
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

        <Button
          onClick={game.startGame}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary px-10"
        >
          <Play className="w-5 h-5 mr-2" /> Start Race
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timer & Score */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-primary font-bold">You: {game.playerScore}</span>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-mono font-bold ${game.timeLeft <= 5 ? "text-destructive animate-pulse" : "text-foreground"}`}>
            {game.timeLeft}s
          </span>
        </div>
        {mode === "bot" && <span className="text-secondary font-bold">Bot: {game.botScore}</span>}
      </div>

      {/* Progress bars */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-primary w-8">You</span>
          <Progress value={(game.playerScore / totalCells) * 100} className="h-2 flex-1" />
        </div>
        {mode === "bot" && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-secondary w-8">Bot</span>
            <Progress value={(game.botScore / totalCells) * 100} className="h-2 flex-1" />
          </div>
        )}
      </div>

      {/* Grid */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${game.gridSize}, 1fr)` }}
      >
        {game.grid.map((cell, i) => (
          <motion.button
            key={i}
            onClick={() => game.colorCell(i)}
            whileTap={cell === null ? { scale: 0.9 } : {}}
            className={`aspect-square rounded-lg transition-all duration-150 ${
              cell === "player"
                ? "bg-primary shadow-md shadow-primary/20"
                : cell === "bot"
                ? "bg-secondary shadow-md shadow-secondary/20"
                : "bg-muted/30 border border-border/30 hover:border-primary/50 cursor-pointer active:bg-primary/20"
            }`}
            disabled={cell !== null || game.gameOver}
          />
        ))}
      </div>

      {result && (
        <GameResultOverlay
          result={result}
          onPlayAgain={game.startGame}
          pointsEarned={result === "win" ? 50 : result === "draw" ? 10 : 0}
        />
      )}
    </div>
  );
};

export default ColoringRaceGame;
