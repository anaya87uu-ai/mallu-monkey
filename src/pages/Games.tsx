import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Gift, Star, Trophy, Zap, Users, Bot } from "lucide-react";
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
import PlayerAvatar from "@/components/games/PlayerAvatar";
import TurnTimer from "@/components/games/TurnTimer";
import GameBoard from "@/components/games/GameBoard";
import GameResultOverlay from "@/components/games/GameResultOverlay";

/* ─── Multiplayer TicTacToe ─── */
const MultiplayerTicTacToeGame = ({ userId, userName }: { userId: string; userName: string }) => {
  const mp = useMultiplayerTicTacToe(userId, userName);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    if (mp.status === "finished" && mp.winner) {
      if (mp.winner === mp.mySymbol) {
        setPointsEarned(POINT_VALUES.game_win);
        if (userId && !userId.startsWith("guest_")) {
          addPoints(userId, POINT_VALUES.game_win, ["gamer", "winner"]);
        }
      } else if (mp.winner === "draw") {
        setPointsEarned(POINT_VALUES.game_play);
      } else {
        setPointsEarned(0);
      }
    }
  }, [mp.status, mp.winner, mp.mySymbol, userId]);

  if (mp.status === "idle") {
    return (
      <div className="text-center space-y-5 py-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center mx-auto"
        >
          <Users className="w-10 h-10 text-primary" />
        </motion.div>
        <div>
          <h3 className="font-display text-xl font-bold">Play Online</h3>
          <p className="text-sm text-muted-foreground mt-1">Challenge a real player in real-time!</p>
        </div>
        <Button
          onClick={mp.findGame}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary px-10"
        >
          <Users className="w-5 h-5 mr-2" /> Find Opponent
        </Button>
      </div>
    );
  }

  if (mp.status === "searching") {
    return (
      <div className="text-center space-y-5 py-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-20 h-20 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center mx-auto"
        >
          <Gamepad2 className="w-10 h-10 text-primary" />
        </motion.div>
        <div>
          <h3 className="font-display text-xl font-bold">Finding opponent…</h3>
          <p className="text-sm text-muted-foreground mt-1">Waiting for another player to join</p>
        </div>
        <motion.div
          className="flex justify-center gap-1"
          initial="start"
          animate="end"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
        <Button variant="outline" size="sm" onClick={mp.leaveGame} className="glass border-border/50">
          Cancel
        </Button>
      </div>
    );
  }

  const getResult = (): "win" | "lose" | "draw" | null => {
    if (!mp.gameOver || !mp.winner) return null;
    if (mp.winner === mp.mySymbol) return "win";
    if (mp.winner === "draw") return "draw";
    return "lose";
  };

  const result = getResult();

  return (
    <div className="space-y-5">
      {/* Player bar */}
      <div className="flex items-center justify-between px-2">
        <PlayerAvatar
          name={mp.myName}
          symbol={mp.mySymbol!}
          isActive={mp.currentTurn === mp.mySymbol && !mp.gameOver}
        />
        {mp.status === "playing" && !mp.gameOver && (
          <TurnTimer seconds={mp.turnTimer} total={mp.TURN_TIME} />
        )}
        {mp.gameOver && (
          <div className="w-14 h-14 rounded-full bg-muted/30 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        <PlayerAvatar
          name={mp.opponent?.name || "…"}
          symbol={mp.mySymbol === "X" ? "O" : "X"}
          isActive={mp.currentTurn !== mp.mySymbol && !mp.gameOver}
        />
      </div>

      {/* Turn indicator */}
      {!mp.gameOver && (
        <motion.div
          key={mp.currentTurn}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-sm font-semibold py-1.5 rounded-lg ${
            mp.currentTurn === mp.mySymbol
              ? "text-primary bg-primary/10"
              : "text-muted-foreground bg-muted/20"
          }`}
        >
          {mp.currentTurn === mp.mySymbol ? "⚡ Your turn!" : `⏳ ${mp.opponent?.name}'s turn…`}
        </motion.div>
      )}

      {/* Board */}
      <GameBoard
        board={mp.board}
        winLine={mp.winLine}
        disabled={mp.gameOver}
        canPlay={mp.currentTurn === mp.mySymbol}
        onCellClick={(i) => mp.makeMove(i)}
      />

      {/* Result */}
      {result && (
        <GameResultOverlay
          result={result}
          onPlayAgain={mp.findGame}
          onLeave={mp.leaveGame}
          pointsEarned={pointsEarned}
        />
      )}
    </div>
  );
};

/* ─── Bot TicTacToe ─── */
const TicTacToeGame = ({ userId }: { userId: string | null }) => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const { board, play, reset, gameOver, result } = useTicTacToe(difficulty);
  const [lastResult, setLastResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    if (gameOver && result.winner) {
      if (result.winner === "X") setLastResult("win");
      else if (result.winner === "O") setLastResult("lose");
      else setLastResult("draw");
    } else {
      setLastResult(null);
    }
  }, [gameOver, result.winner]);

  const handlePlay = async (index: number) => {
    const res = play(index);
    if (res && userId) {
      if (res.winner === "X") {
        setPointsEarned(POINT_VALUES.game_win);
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
      } else if (res.winner === "O") {
        setPointsEarned(POINT_VALUES.game_play);
        const { data } = await supabase.from("user_points").select("games_played").eq("user_id", userId).single();
        if (data) {
          const newPlayed = (data.games_played || 0) + 1;
          const badges: string[] = [];
          if (newPlayed >= 5) badges.push("gamer");
          await supabase.from("user_points").update({ games_played: newPlayed }).eq("user_id", userId);
          if (badges.length) await addPoints(userId, POINT_VALUES.game_play, badges);
          else await addPoints(userId, POINT_VALUES.game_play);
        }
      } else if (res.winner === "draw") {
        setPointsEarned(POINT_VALUES.game_play);
        await addPoints(userId, POINT_VALUES.game_play);
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Difficulty selector */}
      <div className="flex gap-2 justify-center">
        {(["easy", "medium", "hard"] as const).map((d) => (
          <Button
            key={d}
            size="sm"
            variant={difficulty === d ? "default" : "outline"}
            onClick={() => { setDifficulty(d); reset(); setLastResult(null); }}
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

      {/* Player bar for bot mode */}
      <div className="flex items-center justify-between px-2">
        <PlayerAvatar name="You" symbol="X" isActive={!gameOver} />
        <div className="text-xs text-muted-foreground font-medium px-3 py-1 rounded-full bg-muted/20">
          vs
        </div>
        <PlayerAvatar name="Bot" symbol="O" isActive={false} />
      </div>

      <GameBoard
        board={board}
        winLine={result.line || null}
        disabled={gameOver}
        canPlay={!gameOver}
        onCellClick={handlePlay}
      />

      {lastResult && (
        <GameResultOverlay
          result={lastResult}
          onPlayAgain={() => { reset(); setLastResult(null); }}
          pointsEarned={pointsEarned}
        />
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
            {selectedGame === "select" ? (
              <>
                {/* Game Selection Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "tictactoe" as GameType, icon: Gamepad2, name: "Tic Tac Toe", desc: "Classic 3×3 strategy game", color: "from-primary to-secondary" },
                    { id: "memory" as GameType, icon: Brain, name: "Memory Match", desc: "Flip cards & find matching pairs", color: "from-violet-500 to-pink-500" },
                    { id: "coloring" as GameType, icon: Palette, name: "Coloring Race", desc: "Race to fill the grid with your color", color: "from-emerald-500 to-cyan-500" },
                  ].map((g) => (
                    <motion.button
                      key={g.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedGame(g.id)}
                      className="glass-card p-4 rounded-2xl flex items-center gap-4 text-left transition-all hover:border-primary/30"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center shrink-0`}>
                        <g.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-bold">{g.name}</h3>
                        <p className="text-xs text-muted-foreground">{g.desc}</p>
                      </div>
                      <span className="text-muted-foreground text-lg">→</span>
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Back + Mode selector */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedGame("select")} className="gap-1">
                    <ChevronLeft className="w-4 h-4" /> Games
                  </Button>
                  <div className="flex-1" />
                  <Button
                    size="sm"
                    variant={gameMode === "multiplayer" ? "default" : "outline"}
                    onClick={() => setGameMode("multiplayer")}
                    className={`transition-all text-xs ${
                      gameMode === "multiplayer"
                        ? "bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20"
                        : "glass border-border/50"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 mr-1" /> Online
                  </Button>
                  <Button
                    size="sm"
                    variant={gameMode === "bot" ? "default" : "outline"}
                    onClick={() => setGameMode("bot")}
                    className={`transition-all text-xs ${
                      gameMode === "bot"
                        ? "bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20"
                        : "glass border-border/50"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 mr-1" /> Bot
                  </Button>
                </div>

                <div className="glass-card p-6 space-y-4 rounded-2xl">
                  {/* Tic Tac Toe */}
                  {selectedGame === "tictactoe" && (
                    <>
                      <div className="text-center">
                        <h3 className="font-display text-xl font-bold">Tic Tac Toe</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {gameMode === "multiplayer" ? "Challenge real players online!" : "Beat the bot to earn points!"}
                        </p>
                      </div>
                      {gameMode === "multiplayer" && currentUserId ? (
                        <MultiplayerTicTacToeGame userId={currentUserId} userName={currentUserName} />
                      ) : gameMode === "bot" ? (
                        <TicTacToeGame userId={user?.id || null} />
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-muted-foreground">Please log in to play multiplayer</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Memory Match */}
                  {selectedGame === "memory" && (
                    <>
                      <div className="text-center">
                        <h3 className="font-display text-xl font-bold">Memory Match</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {gameMode === "bot" ? "Outsmart the bot — find pairs faster!" : "Find all matching pairs!"}
                        </p>
                      </div>
                      <MemoryMatchGame userId={user?.id || null} mode={gameMode === "bot" ? "bot" : "solo"} />
                    </>
                  )}

                  {/* Coloring Race */}
                  {selectedGame === "coloring" && (
                    <>
                      <div className="text-center">
                        <h3 className="font-display text-xl font-bold">Coloring Race</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {gameMode === "bot" ? "Race the bot to claim the most cells!" : "Color the grid as fast as you can!"}
                        </p>
                      </div>
                      <ColoringRaceGame userId={user?.id || null} mode={gameMode === "bot" ? "bot" : "solo"} />
                    </>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="daily" className="mt-0">
            <div className="glass-card p-6 space-y-4 text-center rounded-2xl">
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
            <div className="glass-card p-6 rounded-2xl">
              <div className="grid grid-cols-2 gap-3">
                {BADGES.map((badge) => {
                  const earned = earnedBadges.includes(badge.id);
                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.03 }}
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
