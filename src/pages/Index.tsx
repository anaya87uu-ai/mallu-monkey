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
    <div className="min-h-[calc(100vh-4rem)] px-4 md:px-6 py-8 md:py-12 max-w-6xl mx-auto space-y-8 md:space-y-10">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-1">Welcome back</p>
        <h1 className="display-lg text-foreground">
          Hey, <span className="gradient-text">{userName}</span> 👋
        </h1>
        <p className="text-muted-foreground text-base">Ready to connect and play?</p>
      </motion.div>

      {/* Hero CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Link to="/chat">
          <div className="glass-panel relative overflow-hidden p-6 md:p-8 group cursor-pointer">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight mb-1">Start a video chat</h2>
                <p className="text-sm text-muted-foreground">Meet someone new in seconds</p>
              </div>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary h-12 px-6 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 mr-2" /> Start
              </Button>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {quickActions.map((action, i) => (
          <Link key={action.to} to={action.to}>
            <motion.div whileHover={{ y: -4 }} transition={{ delay: i * 0.03 }} className="glass-card-lg p-5 group cursor-pointer h-full">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-display font-semibold text-sm text-foreground tracking-tight">{action.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{action.desc}</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Level + Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
        {/* Level Card */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-display font-bold text-base text-foreground">Level {level.level}</p>
                <p className="text-xs text-muted-foreground">{stats?.total_points ?? 0} points</p>
              </div>
            </div>
            {stats?.login_streak ? (
              <div className="flex items-center gap-1 text-xs text-primary font-semibold px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-3.5 h-3.5" />
                {stats.login_streak} day streak
              </div>
            ) : null}
          </div>
          <div className="h-2.5 rounded-full bg-muted/60 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${level.progress}%` }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_hsl(var(--primary))]"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-right">{level.current}/{level.needed} XP</p>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="font-display font-semibold text-lg mb-3 text-foreground tracking-tight">Your Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Chats", value: chatStats?.total_chats ?? 0, icon: MessageCircle },
              { label: "Chat Time", value: `${Math.floor((chatStats?.total_chat_seconds ?? 0) / 60)}m`, icon: Clock },
              { label: "Games Won", value: stats?.games_won ?? 0, icon: Trophy },
              { label: "Games Played", value: stats?.games_played ?? 0, icon: Gamepad2 },
            ].map((stat) => (
              <motion.div key={stat.label} whileHover={{ y: -2 }} className="glass-card-lg p-5 text-center">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="font-display font-bold text-2xl text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
