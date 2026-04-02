import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Gamepad2, Trophy, Gift, Clock, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getLevelInfo } from "@/lib/points";

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
      supabase.from("user_points").select("*").eq("user_id", session.user.id).maybeSingle().then(({ data }) => {
        if (data) setStats(data);
      });
      supabase.from("chat_stats").select("*").eq("user_id", session.user.id).maybeSingle().then(({ data }) => {
        if (data) setChatStats(data);
      });
    });
  }, [navigate]);

  const levelRaw = stats ? getLevelInfo(stats.total_points) : null;
  const level = {
    level: levelRaw?.current.level ?? 1,
    current: stats?.total_points ?? 0,
    needed: levelRaw?.next?.pointsNeeded ?? 100,
    progress: levelRaw?.progress ?? 0,
  };

  const quickActions = [
    { to: "/chat", icon: MessageCircle, label: "Start Chat", gradient: "from-primary to-secondary", desc: "Meet someone new" },
    { to: "/games", icon: Gamepad2, label: "Play Games", gradient: "from-emerald-500 to-teal-500", desc: "Earn points" },
    { to: "/leaderboards", icon: Trophy, label: "Leaderboards", gradient: "from-amber-500 to-orange-500", desc: "View rankings" },
    { to: "/games?tab=daily", icon: Gift, label: "Daily Reward", gradient: "from-pink-500 to-rose-500", desc: "Claim bonus" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 md:px-6 py-6 md:py-10 max-w-5xl mx-auto space-y-6 md:space-y-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold">
          Hey, <span className="gradient-text">{userName}</span> 👋
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">Ready to connect and play?</p>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Link to="/chat">
          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 glow-primary text-base">
            <MessageCircle className="w-5 h-5 mr-2" /> Start Video Chat
          </Button>
        </Link>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to}>
            <div className="glass-card p-4 md:p-6 hover:border-primary/30 transition-all group cursor-pointer h-full">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-display font-semibold text-sm">{action.label}</p>
              <p className="text-[11px] text-muted-foreground">{action.desc}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Level + Stats side-by-side on desktop */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
        {/* Level Card */}
        <div className="glass-card p-5 md:p-6">
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
          <div className="h-2 md:h-3 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${level.progress}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 text-right">{level.current}/{level.needed} XP</p>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="font-display font-semibold text-lg mb-3">Your Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Chats", value: chatStats?.total_chats ?? 0, icon: MessageCircle },
              { label: "Chat Time", value: `${Math.floor((chatStats?.total_chat_seconds ?? 0) / 60)}m`, icon: Clock },
              { label: "Games Won", value: stats?.games_won ?? 0, icon: Trophy },
              { label: "Games Played", value: stats?.games_played ?? 0, icon: Gamepad2 },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 md:p-6 text-center">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="font-display font-bold text-xl md:text-2xl">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default Index;
