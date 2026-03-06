import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, MessageCircle, Flame, Medal, Star, Gamepad2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { getLevelInfo, LEVELS } from "@/lib/points";

interface PointsStat {
  id: string;
  user_id: string;
  display_name: string | null;
  total_points: number;
  level: number;
  games_won: number;
  games_played: number;
  login_streak: number;
  badges: string[];
}

const rankColors = [
  "from-yellow-400 to-amber-500",
  "from-slate-300 to-slate-400",
  "from-orange-400 to-orange-600",
];

const rankIcons = ["🥇", "🥈", "🥉"];

const LeaderboardRow = ({
  stat,
  rank,
  valueLabel,
}: {
  stat: PointsStat;
  rank: number;
  valueLabel: string;
}) => {
  const isTop3 = rank < 3;
  const levelInfo = getLevelInfo(stat.total_points);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        isTop3 ? "glass-card border border-primary/20" : "hover:bg-muted/30"
      }`}
    >
      <div className="w-8 h-8 flex items-center justify-center shrink-0">
        {isTop3 ? (
          <span className="text-xl">{rankIcons[rank]}</span>
        ) : (
          <span className="text-sm font-bold text-muted-foreground">#{rank + 1}</span>
        )}
      </div>

      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 relative ${
          isTop3
            ? `bg-gradient-to-br ${rankColors[rank]} text-white`
            : "bg-muted/50 text-muted-foreground"
        }`}
      >
        {(stat.display_name || "?")[0].toUpperCase()}
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border border-border/30 flex items-center justify-center text-[8px] font-bold">
          {stat.level}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isTop3 ? "text-foreground" : "text-foreground/80"}`}>
          {stat.display_name || "Anonymous"}
        </p>
        <p className="text-[10px] text-muted-foreground">{levelInfo.current.name}</p>
      </div>

      <div className={`text-right shrink-0 ${isTop3 ? "text-primary font-bold" : "text-muted-foreground font-medium"}`}>
        <span className="text-sm">{valueLabel}</span>
      </div>
    </motion.div>
  );
};

const Leaderboards = () => {
  const [stats, setStats] = useState<PointsStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("points");

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("user_points")
        .select("*")
        .order("total_points", { ascending: false })
        .limit(50);

      if (!error && data) {
        setStats(data as unknown as PointsStat[]);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const sortedStats = [...stats].sort((a, b) => {
    if (tab === "points") return b.total_points - a.total_points;
    if (tab === "wins") return b.games_won - a.games_won;
    return b.login_streak - a.login_streak;
  });

  const getValueLabel = (stat: PointsStat) => {
    if (tab === "points") return `${stat.total_points} pts`;
    if (tab === "wins") return `${stat.games_won} wins`;
    return `${stat.login_streak} 🔥`;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-8 pb-20 overflow-hidden">
      <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-10 bg-primary -top-40 -right-40 animate-float" />
      <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-10 bg-secondary bottom-0 -left-32 animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 glow-primary">
            <Trophy className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">Leaderboards</h1>
          <p className="text-muted-foreground mt-1 text-sm">Top players on mallumonkey.xyz</p>
        </div>

        {/* Level guide */}
        <div className="glass-card p-3 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {LEVELS.map((l) => (
              <div key={l.level} className="flex flex-col items-center shrink-0 min-w-[48px]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {l.level}
                </div>
                <span className="text-[8px] text-muted-foreground mt-0.5">{l.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full glass border border-border/30 mb-4">
            <TabsTrigger value="points" className="flex-1 gap-1.5 text-xs">
              <Star className="w-3.5 h-3.5" /> Points
            </TabsTrigger>
            <TabsTrigger value="wins" className="flex-1 gap-1.5 text-xs">
              <Gamepad2 className="w-3.5 h-3.5" /> Game Wins
            </TabsTrigger>
            <TabsTrigger value="streak" className="flex-1 gap-1.5 text-xs">
              <Flame className="w-3.5 h-3.5" /> Streaks
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sortedStats.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <Medal className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No stats yet. Start playing to appear on the leaderboard!</p>
            </div>
          ) : (
            ["points", "wins", "streak"].map((t) => (
              <TabsContent key={t} value={t} className="space-y-1 mt-0">
                {sortedStats.map((stat, i) => (
                  <LeaderboardRow
                    key={stat.id}
                    stat={stat}
                    rank={i}
                    valueLabel={getValueLabel(stat)}
                  />
                ))}
              </TabsContent>
            ))
          )}
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Leaderboards;
