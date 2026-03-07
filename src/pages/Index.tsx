import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Gamepad2, Trophy, Gift, TrendingUp, Clock, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getLevelInfo, LEVELS } from "@/lib/points";

const Index = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [chatStats, setChatStats] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const guest = localStorage.getItem("guest_user");
    if (guest) {
      const g = JSON.parse(guest);
      setIsGuest(true);
      setUserName(g.name || "Guest");
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/welcome", { replace: true });
        return;
      }
      setUserName(session.user.user_metadata?.display_name || session.user.email || "User");
      // Fetch points
      supabase.from("user_points").select("*").eq("user_id", session.user.id).maybeSingle().then(({ data }) => {
        if (data) setStats(data);
      });
      // Fetch chat stats
      supabase.from("chat_stats").select("*").eq("user_id", session.user.id).maybeSingle().then(({ data }) => {
        if (data) setChatStats(data);
      });
    });
  }, [navigate]);

  const level = stats ? getLevelInfo(stats.total_points) : { level: 1, current: 0, needed: 100, progress: 0 };

  const quickActions = [
    { to: "/chat", icon: MessageCircle, label: "Start Chat", gradient: "from-primary to-secondary", desc: "Meet someone new" },
    { to: "/games", icon: Gamepad2, label: "Play Games", gradient: "from-emerald-500 to-teal-500", desc: "Earn points" },
    { to: "/leaderboards", icon: Trophy, label: "Leaderboards", gradient: "from-amber-500 to-orange-500", desc: "View rankings" },
    { to: "/games?tab=daily", icon: Gift, label: "Daily Reward", gradient: "from-pink-500 to-rose-500", desc: "Claim bonus" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-6 space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          Hey, <span className="gradient-text">{userName}</span> 👋
        </h1>
        <p className="text-muted-foreground text-sm">Ready to connect and play?</p>
      </motion.div>

      {/* Level Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm">Level {level.level}</p>
              <p className="text-xs text-muted-foreground">{stats?.total_points ?? 0} points</p>
            </div>
          </div>
          {stats?.login_streak ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-primary" />
              {stats.login_streak} day streak
            </div>
          ) : null}
        </div>
        <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level.progress}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 text-right">{level.current}/{level.needed} XP</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to}>
            <div className="glass-card p-4 hover:border-primary/30 transition-all group cursor-pointer h-full">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-display font-semibold text-sm">{action.label}</p>
              <p className="text-[11px] text-muted-foreground">{action.desc}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display font-semibold text-lg mb-3">Your Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Chats", value: chatStats?.total_chats ?? 0, icon: MessageCircle },
            { label: "Chat Time", value: `${Math.floor((chatStats?.total_chat_seconds ?? 0) / 60)}m`, icon: Clock },
            { label: "Games Won", value: stats?.games_won ?? 0, icon: Trophy },
            { label: "Games Played", value: stats?.games_played ?? 0, icon: Gamepad2 },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="font-display font-bold text-xl">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 text-center">
        <h2 className="font-display text-xl font-bold mb-2">Ready to <span className="gradient-text">Chat</span>?</h2>
        <p className="text-muted-foreground text-sm mb-4">Meet new people and earn points!</p>
        <Link to="/chat">
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 px-8 glow-primary">
            <MessageCircle className="w-5 h-5 mr-2" /> Start Video Chat
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Index;
