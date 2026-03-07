import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Gift, Star, Trophy, Zap, Users, Bot, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTicTacToe } from "@/hooks/useTicTacToe";
import { useMultiplayerTicTacToe } from "@/hooks/useMultiplayerTicTacToe";
import {
  claimDailyReward,
  getOrCreateUserPoints,
  addPoints,
  getLevelInfo,
  BADGES,
  POINT_VALUES,
} from "@/lib/points";
import { Progress } from "@/components/ui/progress";

/* ─── Player Avatar ─── */
const PlayerAvatar = ({ name, symbol, isActive, size = "md" }: { name: string; symbol: "X" | "O"; isActive: boolean; size?: "sm" | "md" }) => {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`flex items-center gap-2 transition-all ${isActive ? "scale-105" : "opacity-60"}`}>
      <div className={`${sizeClass} rounded-full flex items-center justify-center font-bold ${
        symbol === "X"
          ? "bg-primary/20 text-primary border-2 border-primary/40"
          : "bg-secondary/20 text-secondary border-2 border-secondary/40"
      } ${isActive ? "ring-2 ring-offset-2 ring-offset-background ring-primary/50 animate-pulse" : ""}`}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="text-left">
        <p className={`font-semibold text-xs leading-tight ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{name}</p>
        <p className={`text-[10px] ${symbol === "X" ? "text-primary" : "text-secondary"}`}>
          {symbol === "X" ? "✕" : "○"}
        </p>
      </div>
    </div>
  );
};

/* ─── Turn Timer ─── */
const TurnTimer = ({ seconds, total }: { seconds: number; total: number }) => {
  const pct = (seconds / total) * 100;
  const isLow = seconds <= 5;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-display font-bold text-lg transition-all ${
        isLow ? "border-destructive text-destructive animate-pulse" : "border-primary/40 text-foreground"
      }`}>
        {seconds}
      </div>
      <div className="w-16 h-1 rounded-full bg-muted/50 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ─── Multiplayer TicTacToe ─── */
const MultiplayerTicTacToeGame = ({ userId, userName }: { userId: string; userName: string }) => {
  const mp = useMultiplayerTicTacToe(userId, userName);

  useEffect(() => {
    if (mp.status === "finished" && mp.winner) {
      if (mp.winner === mp.mySymbol) {
        toast.success("🎉 You won!");
        if (userId && !userId.startsWith("guest_")) {
          addPoints(userId, POINT_VALUES.game_win, ["gamer", "winner"]);
        }
      } else if (mp.winner === "draw") {
        toast("🤝 It's a draw!");
      } else {
        toast.error("You lost! Try again 💪");
      }
    }
  }, [mp.status, mp.winner, mp.mySymbol, userId]);

  if (mp.status === "idle") {
    return (
      <div className="text-center space-y-4 py-4">
        <Users className="w-12 h-12 text-primary mx-auto" />
        <h3 className="font-display text-lg font-bold">Play Online</h3>
        <p className="text-xs text-muted-foreground">Challenge a real player in real-time!</p>
        <Button
          onClick={mp.findGame}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-11 px-8 glow-primary"
        >
          <Users className="w-4 h-4 mr-2" /> Find Opponent
        </Button>
      </div>
    );
  }

  if (mp.status === "searching") {
    return (
      <div className="text-center space-y-4 py-8">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Gamepad2 className="w-12 h-12 text-primary mx-auto" />
        </motion.div>
        <h3 className="font-display text-lg font-bold">Finding opponent...</h3>
        <p className="text-xs text-muted-foreground">Waiting for another player to join</p>
        <Button variant="outline" size="sm" onClick={mp.leaveGame} className="glass border-border/50">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Player bar */}
      <div className="flex items-center justify-between">
        <PlayerAvatar
          name={mp.myName}
          symbol={mp.mySymbol!}
          isActive={mp.currentTurn === mp.mySymbol}
        />
        {mp.status === "playing" && !mp.gameOver && (
          <TurnTimer seconds={mp.turnTimer} total={mp.TURN_TIME} />
        )}
        <PlayerAvatar
          name={mp.opponent?.name || "..."}
          symbol={mp.mySymbol === "X" ? "O" : "X"}
          isActive={mp.currentTurn !== mp.mySymbol}
        />
      </div>

      {/* Turn indicator */}
      {!mp.gameOver && (
        <p className={`text-center text-xs font-medium ${
          mp.currentTurn === mp.mySymbol ? "text-primary" : "text-muted-foreground"
        }`}>
          {mp.currentTurn === mp.mySymbol ? "Your turn!" : `${mp.opponent?.name}'s turn...`}
        </p>
      )}

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {mp.board.map((cell, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => mp.makeMove(i)}
            disabled={mp.gameOver || !!cell || mp.currentTurn !== mp.mySymbol}
            className={`aspect-square rounded-xl text-2xl font-bold flex items-center justify-center transition-all ${
              mp.winLine?.includes(i)
                ? "bg-primary/30 border-2 border-primary"
                : cell
                ? "glass-card border border-border/30"
                : mp.currentTurn === mp.mySymbol && !mp.gameOver
                ? "glass border border-border/20 hover:border-primary/40 cursor-pointer"
                : "glass border border-border/20 opacity-60"
            }`}
          >
            {cell === "X" && <span className="text-primary">✕</span>}
            {cell === "O" && <span className="text-secondary">○</span>}
          </motion.button>
        ))}
      </div>

      {/* Result */}
      {mp.gameOver && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <p className="text-sm font-medium">
            {mp.winner === mp.mySymbol ? "🎉 You won!" : mp.winner === "draw" ? "🤝 Draw!" : "😔 You lost!"}
          </p>
          <div className="flex gap-2 justify-center">
            <Button size="sm" onClick={mp.findGame} className="bg-gradient-to-r from-primary to-secondary">
              Play Again
            </Button>
            <Button size="sm" variant="outline" onClick={mp.leaveGame} className="glass border-border/50">
              Leave
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ─── Bot TicTacToe (existing) ─── */
const TicTacToeGame = ({ userId }: { userId: string | null }) => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const { board, play, reset, gameOver, result } = useTicTacToe(difficulty);

  const handlePlay = async (index: number) => {
    const res = play(index);
    if (res && userId) {
      if (res.winner === "X") {
        await addPoints(userId, POINT_VALUES.game_win, ["gamer"]);
        const { data } = await supabase.from("user_points").select("games_won, games_played").eq("user_id", userId).single();
        if (data) {
          const newWon = (data.games_won || 0) + 1;
          const newPlayed = (data.games_played || 0) + 1;
          const badges: string[] = [];
          if (newWon >= 3) badges.push("winner");
          if (newWon >= 10) badges.push("champion");
          if (newPlayed >= 5) badges.push("gamer");
          await supabase.from("user_points").update({ games_won: newWon, games_played: newPlayed }).eq("user_id", userId);
          if (badges.length) await addPoints(userId, 0, badges);
        }
        toast.success(`You win! +${POINT_VALUES.game_win} points 🎉`);
      } else if (res.winner === "O") {
        const { data } = await supabase.from("user_points").select("games_played").eq("user_id", userId).single();
        if (data) {
          const newPlayed = (data.games_played || 0) + 1;
          const badges: string[] = [];
          if (newPlayed >= 5) badges.push("gamer");
          await supabase.from("user_points").update({ games_played: newPlayed }).eq("user_id", userId);
          if (badges.length) await addPoints(userId, POINT_VALUES.game_play, badges);
          else await addPoints(userId, POINT_VALUES.game_play);
        }
        toast.error("Bot wins! Try again 💪");
      } else if (res.winner === "draw") {
        await addPoints(userId, POINT_VALUES.game_play);
        toast("It's a draw!");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {(["easy", "medium", "hard"] as const).map((d) => (
          <Button
            key={d}
            size="sm"
            variant={difficulty === d ? "default" : "outline"}
            onClick={() => { setDifficulty(d); reset(); }}
            className={difficulty === d ? "bg-gradient-to-r from-primary to-secondary" : "glass border-border/50"}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePlay(i)}
            disabled={gameOver || !!cell}
            className={`aspect-square rounded-xl text-2xl font-bold flex items-center justify-center transition-all ${
              result.line?.includes(i)
                ? "bg-primary/30 border-2 border-primary"
                : cell
                ? "glass-card border border-border/30"
                : "glass border border-border/20 hover:border-primary/40 cursor-pointer"
            }`}
          >
            {cell === "X" && <span className="text-primary">✕</span>}
            {cell === "O" && <span className="text-secondary">○</span>}
          </motion.button>
        ))}
      </div>

      {gameOver && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-sm font-medium mb-2">
            {result.winner === "X" ? "🎉 You won!" : result.winner === "O" ? "🤖 Bot won!" : "🤝 Draw!"}
          </p>
          <Button size="sm" onClick={reset} className="bg-gradient-to-r from-primary to-secondary">
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

/* ─── Main Games Page ─── */
const Games = () => {
  const [user, setUser] = useState<any>(null);
  const [guestUser, setGuestUser] = useState<any>(null);
  const [userPoints, setUserPoints] = useState<any>(null);
  const [claiming, setClaiming] = useState(false);
  const [gameMode, setGameMode] = useState<"bot" | "multiplayer">("multiplayer");

  useEffect(() => {
    const load = async () => {
      const guest = localStorage.getItem("guest_user");
      if (guest) {
        setGuestUser(JSON.parse(guest));
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const pts = await getOrCreateUserPoints(session.user.id, session.user.user_metadata?.display_name);
        setUserPoints(pts);
      }
    };
    load();
  }, []);

  const handleDailyClaim = async () => {
    if (!user) {
      toast.error("Please log in to claim rewards");
      return;
    }
    setClaiming(true);
    const result = await claimDailyReward(user.id);
    if (result.success) {
      toast.success(result.message);
      const pts = await getOrCreateUserPoints(user.id);
      setUserPoints(pts);
    } else {
      toast.error(result.message);
    }
    setClaiming(false);
  };

  const levelInfo = userPoints ? getLevelInfo(userPoints.total_points || 0) : null;
  const earnedBadges = (userPoints?.badges as string[]) || [];

  const currentUserId = user?.id || (guestUser ? `guest_${guestUser.name}` : null);
  const currentUserName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || guestUser?.name || "Player";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-8 pb-20 overflow-hidden">
      <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-10 bg-primary -top-40 -right-40 animate-float" />
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-10 bg-secondary bottom-0 -left-32 animate-float-delayed" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 glow-primary">
            <Gamepad2 className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">Games & Rewards</h1>
          <p className="text-muted-foreground mt-1 text-sm">Play games, earn points, climb the ranks!</p>
        </div>

        {/* Stats Bar */}
        {userPoints && levelInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {levelInfo.current.level}
                </div>
                <div>
                  <p className="text-sm font-semibold">{levelInfo.current.name}</p>
                  <p className="text-[10px] text-muted-foreground">{userPoints.total_points} pts</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {userPoints.games_won}W</span>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> {userPoints.login_streak}🔥</span>
              </div>
            </div>
            {levelInfo.next && (
              <div>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Lvl {levelInfo.current.level}</span>
                  <span>Lvl {levelInfo.next.level} ({levelInfo.next.pointsNeeded} pts)</span>
                </div>
                <Progress value={levelInfo.progress} className="h-1.5" />
              </div>
            )}
          </motion.div>
        )}

        <Tabs defaultValue="games" className="w-full">
          <TabsList className="w-full glass border border-border/30 mb-4">
            <TabsTrigger value="games" className="flex-1 gap-1.5 text-xs">
              <Gamepad2 className="w-3.5 h-3.5" /> Games
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex-1 gap-1.5 text-xs">
              <Gift className="w-3.5 h-3.5" /> Daily
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex-1 gap-1.5 text-xs">
              <Star className="w-3.5 h-3.5" /> Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="mt-0 space-y-4">
            {/* Mode Selector */}
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                variant={gameMode === "multiplayer" ? "default" : "outline"}
                onClick={() => setGameMode("multiplayer")}
                className={gameMode === "multiplayer" ? "bg-gradient-to-r from-primary to-secondary" : "glass border-border/50"}
              >
                <Users className="w-4 h-4 mr-1" /> Multiplayer
              </Button>
              <Button
                size="sm"
                variant={gameMode === "bot" ? "default" : "outline"}
                onClick={() => setGameMode("bot")}
                className={gameMode === "bot" ? "bg-gradient-to-r from-primary to-secondary" : "glass border-border/50"}
              >
                <Bot className="w-4 h-4 mr-1" /> vs Bot
              </Button>
            </div>

            <div className="glass-card p-6 space-y-4">
              <div className="text-center">
                <h3 className="font-display text-lg font-bold">Tic Tac Toe</h3>
                <p className="text-xs text-muted-foreground">
                  {gameMode === "multiplayer" ? "Challenge real players online!" : "Beat the bot to earn points!"}
                </p>
              </div>
              {gameMode === "multiplayer" && currentUserId ? (
                <MultiplayerTicTacToeGame userId={currentUserId} userName={currentUserName} />
              ) : gameMode === "bot" ? (
                <TicTacToeGame userId={user?.id || null} />
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Please log in to play multiplayer</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="daily" className="mt-0">
            <div className="glass-card p-6 space-y-4 text-center">
              <Gift className="w-12 h-12 text-primary mx-auto" />
              <h3 className="font-display text-lg font-bold">Daily Reward</h3>
              <p className="text-sm text-muted-foreground">
                Claim your daily points! Maintain your streak for bonus rewards.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="glass p-3 rounded-xl text-center">
                  <p className="text-2xl font-bold text-primary">25</p>
                  <p className="text-[10px] text-muted-foreground">Base Points</p>
                </div>
                <span className="text-muted-foreground">+</span>
                <div className="glass p-3 rounded-xl text-center">
                  <p className="text-2xl font-bold text-secondary">×🔥</p>
                  <p className="text-[10px] text-muted-foreground">Streak Bonus</p>
                </div>
              </div>
              <Button
                onClick={handleDailyClaim}
                disabled={claiming || !user}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-11 glow-primary"
              >
                <Gift className="w-4 h-4 mr-2" />
                {claiming ? "Claiming..." : user ? "Claim Daily Reward" : "Log in to Claim"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-0">
            <div className="glass-card p-6">
              <div className="grid grid-cols-2 gap-3">
                {BADGES.map((badge) => {
                  const earned = earnedBadges.includes(badge.id);
                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        earned
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/20 opacity-50 grayscale"
                      }`}
                    >
                      <span className="text-2xl">{badge.emoji}</span>
                      <p className="text-xs font-semibold mt-1">{badge.name}</p>
                      <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Games;
