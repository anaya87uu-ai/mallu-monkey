import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, MessageCircle, Flame, Medal, Star, Gamepad2, Wifi } from "lucide-react";
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

interface ChatStat {
  id: string;
  user_id: string;
  display_name: string | null;
  total_chats: number;
  total_chat_seconds: number;
  longest_chat_seconds: number;
}

const rankColors = [
  "from-yellow-400 to-amber-500",
  "from-slate-300 to-slate-400",
  "from-orange-400 to-orange-600",
];

const rankIcons = ["🥇", "🥈", "🥉"];

const LeaderboardRow = ({
  name,
  level,
  totalPoints,
  rank,
  valueLabel,
}: {
  name: string;
  level: number;
  totalPoints: number;
  rank: number;
  valueLabel: string;
}) => {
  const isTop3 = rank < 3;
  const levelInfo = getLevelInfo(totalPoints);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        isTop3 ? "glass-card border border-primary/30 bg-mint/30" : "hover:bg-mint/40"
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
        {(name || "?")[0].toUpperCase()}
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border border-border/30 flex items-center justify-center text-[8px] font-bold">
          {level}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isTop3 ? "text-foreground" : "text-foreground/80"}`}>
          {name || "Anonymous"}
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
  const [chatStats, setChatStats] = useState<ChatStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("points");
  const [isLive, setIsLive] = useState(false);

  const fetchAll = async () => {
    const [pointsRes, chatRes] = await Promise.all([
      supabase.from("user_points").select("*").order("total_points", { ascending: false }).limit(50),
      supabase.from("chat_stats").select("*").order("total_chats", { ascending: false }).limit(50),
    ]);
    if (pointsRes.data) setStats(pointsRes.data as unknown as PointsStat[]);
    if (chatRes.data) setChatStats(chatRes.data as unknown as ChatStat[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();

    // Realtime subscriptions
    const channel = supabase
      .channel("leaderboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_points" }, () => {
        fetchAll();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_stats" }, () => {
        fetchAll();
      })
      .subscribe((status) => {
        setIsLive(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getSortedStats = () => {
    if (tab === "points") return [...stats].sort((a, b) => b.total_points - a.total_points);
    if (tab === "wins") return [...stats].sort((a, b) => b.games_won - a.games_won);
    if (tab === "streak") return [...stats].sort((a, b) => b.login_streak - a.login_streak);
    return [];
  };

  const getSortedChatStats = () => {
    if (tab === "chats") return [...chatStats].sort((a, b) => b.total_chats - a.total_chats);
    if (tab === "chattime") return [...chatStats].sort((a, b) => b.total_chat_seconds - a.total_chat_seconds);
    return [];
  };

  const isChatTab = tab === "chats" || tab === "chattime";
  const sortedPoints = getSortedStats();
  const sortedChat = getSortedChatStats();

  const getValueLabel = (stat: PointsStat) => {
    if (tab === "points") return `${stat.total_points} pts`;
    if (tab === "wins") return `${stat.games_won} wins`;
    return `${stat.login_streak} 🔥`;
  };

  const getChatValueLabel = (stat: ChatStat) => {
    if (tab === "chats") return `${stat.total_chats} chats`;
    return `${Math.floor(stat.total_chat_seconds / 60)}m`;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 glow-primary"
          >
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="display-lg gradient-text">Leaderboards</h1>
          <p className="text-muted-foreground mt-1 text-sm">Top players on mallumonkey.xyz</p>
          {isLive && (
            <div className="inline-flex items-center justify-center gap-1.5 mt-3 text-xs text-primary font-medium px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Wifi className="w-3.5 h-3.5" />
              <span>Live</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>
          )}
        </div>

        {/* Level guide */}
        <div className="glass-card p-3 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {LEVELS.map((l) => (
              <div key={l.level} className="flex flex-col items-center shrink-0 min-w-[48px]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {l.level}
                </div>
                <span className="text-[8px] text-muted-foreground mt-0.5">{l.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full glass border border-border/30 mb-4 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="points" className="flex-1 gap-1 text-[11px] px-2">
              <Star className="w-3 h-3" /> Points
            </TabsTrigger>
            <TabsTrigger value="wins" className="flex-1 gap-1 text-[11px] px-2">
              <Gamepad2 className="w-3 h-3" /> Wins
            </TabsTrigger>
            <TabsTrigger value="streak" className="flex-1 gap-1 text-[11px] px-2">
              <Flame className="w-3 h-3" /> Streaks
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex-1 gap-1 text-[11px] px-2">
              <MessageCircle className="w-3 h-3" /> Chats
            </TabsTrigger>
            <TabsTrigger value="chattime" className="flex-1 gap-1 text-[11px] px-2">
              <Clock className="w-3 h-3" /> Time
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !isChatTab && sortedPoints.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <Medal className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No stats yet. Start playing to appear!</p>
            </div>
          ) : isChatTab && sortedChat.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <Medal className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No chat stats yet. Start chatting!</p>
            </div>
          ) : (
            <>
              {["points", "wins", "streak"].map((t) => (
                <TabsContent key={t} value={t} className="space-y-1 mt-0">
                  {sortedPoints.map((stat, i) => (
                    <LeaderboardRow
                      key={stat.id}
                      name={stat.display_name || "Anonymous"}
                      level={stat.level}
                      totalPoints={stat.total_points}
                      rank={i}
                      valueLabel={getValueLabel(stat)}
                    />
                  ))}
                </TabsContent>
              ))}
              {["chats", "chattime"].map((t) => (
                <TabsContent key={t} value={t} className="space-y-1 mt-0">
                  {sortedChat.map((stat, i) => (
                    <LeaderboardRow
                      key={stat.id}
                      name={stat.display_name || "Anonymous"}
                      level={1}
                      totalPoints={0}
                      rank={i}
                      valueLabel={getChatValueLabel(stat)}
                    />
                  ))}
                </TabsContent>
              ))}
            </>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Leaderboards;
