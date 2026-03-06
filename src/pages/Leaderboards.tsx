import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, MessageCircle, Flame, Medal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface ChatStat {
  id: string;
  user_id: string;
  display_name: string | null;
  total_chats: number;
  total_chat_seconds: number;
  longest_chat_seconds: number;
}

const formatTime = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
};

const rankColors = [
  "from-yellow-400 to-amber-500",
  "from-slate-300 to-slate-400",
  "from-orange-400 to-orange-600",
];

const rankIcons = ["🥇", "🥈", "🥉"];

const LeaderboardRow = ({
  stat,
  rank,
  valueKey,
  formatValue,
}: {
  stat: ChatStat;
  rank: number;
  valueKey: keyof ChatStat;
  formatValue: (val: number) => string;
}) => {
  const isTop3 = rank < 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        isTop3
          ? "glass-card border border-primary/20"
          : "hover:bg-muted/30"
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
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          isTop3
            ? `bg-gradient-to-br ${rankColors[rank]} text-white`
            : "bg-muted/50 text-muted-foreground"
        }`}
      >
        {(stat.display_name || "?")[0].toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isTop3 ? "text-foreground" : "text-foreground/80"}`}>
          {stat.display_name || "Anonymous"}
        </p>
      </div>

      <div className={`text-right shrink-0 ${isTop3 ? "text-primary font-bold" : "text-muted-foreground font-medium"}`}>
        <span className="text-sm">{formatValue(stat[valueKey] as number)}</span>
      </div>
    </motion.div>
  );
};

const Leaderboards = () => {
  const [stats, setStats] = useState<ChatStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("chats");

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("chat_stats")
        .select("*")
        .order("total_chats", { ascending: false })
        .limit(50);

      if (!error && data) {
        setStats(data as ChatStat[]);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const sortedStats = [...stats].sort((a, b) => {
    if (tab === "chats") return b.total_chats - a.total_chats;
    if (tab === "time") return b.total_chat_seconds - a.total_chat_seconds;
    return b.longest_chat_seconds - a.longest_chat_seconds;
  });

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
          <p className="text-muted-foreground mt-1 text-sm">Top chatters on mallumonkey.xyz</p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full glass border border-border/30 mb-4">
            <TabsTrigger value="chats" className="flex-1 gap-1.5 text-xs">
              <MessageCircle className="w-3.5 h-3.5" /> Most Chats
            </TabsTrigger>
            <TabsTrigger value="time" className="flex-1 gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5" /> Total Time
            </TabsTrigger>
            <TabsTrigger value="longest" className="flex-1 gap-1.5 text-xs">
              <Flame className="w-3.5 h-3.5" /> Longest Chat
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sortedStats.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <Medal className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No stats yet. Start chatting to appear on the leaderboard!</p>
            </div>
          ) : (
            <>
              <TabsContent value="chats" className="space-y-1 mt-0">
                {sortedStats.map((stat, i) => (
                  <LeaderboardRow
                    key={stat.id}
                    stat={stat}
                    rank={i}
                    valueKey="total_chats"
                    formatValue={(v) => `${v} chats`}
                  />
                ))}
              </TabsContent>
              <TabsContent value="time" className="space-y-1 mt-0">
                {sortedStats.map((stat, i) => (
                  <LeaderboardRow
                    key={stat.id}
                    stat={stat}
                    rank={i}
                    valueKey="total_chat_seconds"
                    formatValue={formatTime}
                  />
                ))}
              </TabsContent>
              <TabsContent value="longest" className="space-y-1 mt-0">
                {sortedStats.map((stat, i) => (
                  <LeaderboardRow
                    key={stat.id}
                    stat={stat}
                    rank={i}
                    valueKey="longest_chat_seconds"
                    formatValue={formatTime}
                  />
                ))}
              </TabsContent>
            </>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Leaderboards;
