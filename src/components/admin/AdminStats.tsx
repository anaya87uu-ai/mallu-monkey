import { Users, Flag, Settings, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface AdminStatsProps {
  userCount: number;
  pendingReports: number;
  settingsCount: number;
}

const AdminStats = ({ userCount, pendingReports, settingsCount }: AdminStatsProps) => {
  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "text-primary", iconBg: "from-primary to-accent" },
    { label: "Pending Reports", value: pendingReports, icon: Flag, color: "text-destructive", iconBg: "from-destructive to-orange-500" },
    { label: "Settings", value: settingsCount, icon: Settings, color: "text-foreground", iconBg: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i + 0.15 }}
          whileHover={{ y: -3 }}
          className="glass-card-lg p-6 relative overflow-hidden group"
        >
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/8 blur-2xl group-hover:bg-primary/15 transition-colors" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{stat.label}</p>
              <p className="font-display text-4xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                <TrendingUp className="w-3 h-3" /> Live
              </div>
            </div>
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center text-white shadow-lg shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
