import { Users, Flag, Settings } from "lucide-react";

interface AdminStatsProps {
  userCount: number;
  pendingReports: number;
  settingsCount: number;
}

const AdminStats = ({ userCount, pendingReports, settingsCount }: AdminStatsProps) => {
  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "text-primary", bg: "from-mint/60 to-card" },
    { label: "Pending Reports", value: pendingReports, icon: Flag, color: "text-destructive", bg: "from-destructive/15 to-card" },
    { label: "Settings", value: settingsCount, icon: Settings, color: "text-accent", bg: "from-accent/15 to-card" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`glass-card p-5 bg-gradient-to-br ${stat.bg} hover:shadow-[0_8px_24px_-8px_hsl(152_70%_38%/0.25)] transition-shadow`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-background/70 border border-border/40 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
