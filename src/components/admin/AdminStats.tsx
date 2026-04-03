import { Users, Flag, Settings } from "lucide-react";

interface AdminStatsProps {
  userCount: number;
  pendingReports: number;
  settingsCount: number;
}

const AdminStats = ({ userCount, pendingReports, settingsCount }: AdminStatsProps) => {
  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "text-primary", bg: "from-primary/20 to-primary/5" },
    { label: "Pending Reports", value: pendingReports, icon: Flag, color: "text-destructive", bg: "from-destructive/20 to-destructive/5" },
    { label: "Settings", value: settingsCount, icon: Settings, color: "text-secondary", bg: "from-secondary/20 to-secondary/5" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`glass-card p-5 bg-gradient-to-br ${stat.bg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center ${stat.color}`}>
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
