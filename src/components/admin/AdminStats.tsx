import { Users, Flag, Settings, ShieldOff, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface AdminStatsProps {
  userCount: number;
  activeCount: number;
  pendingReports: number;
  bannedCount: number;
}

const AdminStats = ({ userCount, activeCount, pendingReports, bannedCount }: AdminStatsProps) => {
  const stats = [
    { label: "Total Users", value: userCount, icon: Users, iconBg: "from-primary to-accent" },
    { label: "Active 24h", value: activeCount, icon: Activity, iconBg: "from-emerald-500 to-teal-500" },
    { label: "Pending Reports", value: pendingReports, icon: Flag, iconBg: "from-destructive to-orange-500" },
    { label: "Banned", value: bannedCount, icon: ShieldOff, iconBg: "from-slate-500 to-slate-700" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 * i + 0.1 }}
          whileHover={{ y: -3 }}
          className="glass-card-lg p-4 sm:p-5 relative overflow-hidden group"
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/8 blur-2xl group-hover:bg-primary/15 transition-colors" />
          <div className="relative flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 truncate">{stat.label}</p>
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">{stat.value}</p>
            </div>
            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center text-white shadow-lg shrink-0`}>
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
