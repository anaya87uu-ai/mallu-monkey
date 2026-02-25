import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, Flag, Settings, Ban, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  gender: string | null;
  is_banned: boolean;
  created_at: string;
}

interface Report {
  id: string;
  reporter_id: string | null;
  reported_user_id: string;
  reason: string;
  status: string;
  created_at: string;
}

interface SiteSetting {
  id: string;
  key: string;
  value: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Access denied");
      navigate("/");
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    const [profilesRes, reportsRes, settingsRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("reports").select("*").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("*"),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (reportsRes.data) setReports(reportsRes.data);
    if (settingsRes.data) setSettings(settingsRes.data as unknown as SiteSetting[]);
    setLoading(false);
  };

  const toggleBan = async (profile: Profile) => {
    const newBanned = !profile.is_banned;
    const { error } = await supabase
      .from("profiles")
      .update({ is_banned: newBanned, banned_at: newBanned ? new Date().toISOString() : null })
      .eq("id", profile.id);
    if (error) {
      toast.error("Failed to update user");
      return;
    }
    toast.success(newBanned ? "User banned" : "User unbanned");
    setProfiles((prev) =>
      prev.map((p) => (p.id === profile.id ? { ...p, is_banned: newBanned } : p))
    );
  };

  const resolveReport = async (reportId: string, status: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("reports")
      .update({ status, resolved_by: session?.user?.id, resolved_at: new Date().toISOString() })
      .eq("id", reportId);
    if (error) {
      toast.error("Failed to update report");
      return;
    }
    toast.success(`Report ${status}`);
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
  };

  const updateSetting = async (setting: SiteSetting, newValue: string) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: JSON.stringify(newValue) })
      .eq("id", setting.id);
    if (error) {
      toast.error("Failed to update setting");
      return;
    }
    toast.success("Setting updated");
    setSettings((prev) =>
      prev.map((s) => (s.id === setting.id ? { ...s, value: newValue } : s))
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingReports = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage users, reports & settings</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Users", value: profiles.length, icon: Users, color: "text-primary" },
            { label: "Pending Reports", value: pendingReports, icon: Flag, color: "text-destructive" },
            { label: "Settings", value: settings.length, icon: Settings, color: "text-secondary" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="users">
          <TabsList className="glass w-full mb-6">
            <TabsTrigger value="users" className="flex-1 gap-2">
              <Users className="w-4 h-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 gap-2">
              <Flag className="w-4 h-4" /> Reports
              {pendingReports > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">{pendingReports}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 gap-2">
              <Settings className="w-4 h-4" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-3">
            {profiles.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users yet</p>
            ) : (
              profiles.map((profile) => (
                <div key={profile.id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold">
                      {profile.gender === "girl" ? "👧" : "👦"}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{profile.display_name || "Anonymous"}</p>
                      <p className="text-muted-foreground text-xs">
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {profile.is_banned && (
                      <Badge variant="destructive" className="text-xs">Banned</Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={profile.is_banned ? "outline" : "destructive"}
                    onClick={() => toggleBan(profile)}
                    className="gap-1"
                  >
                    <Ban className="w-3 h-3" />
                    {profile.is_banned ? "Unban" : "Ban"}
                  </Button>
                </div>
              ))
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reports</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="glass-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{report.reason}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {new Date(report.created_at).toLocaleDateString()} ·{" "}
                        <Badge variant={report.status === "pending" ? "secondary" : report.status === "resolved" ? "default" : "outline"} className="text-xs">
                          {report.status}
                        </Badge>
                      </p>
                    </div>
                    {report.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => resolveReport(report.id, "resolved")} className="gap-1">
                          <CheckCircle className="w-3 h-3" /> Resolve
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => resolveReport(report.id, "dismissed")} className="gap-1 text-muted-foreground">
                          <XCircle className="w-3 h-3" /> Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-3">
            {settings.map((setting) => {
              const val = typeof setting.value === "string" ? setting.value : JSON.stringify(setting.value);
              const isBool = val === "true" || val === "false";
              const label = setting.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <div key={setting.id} className="glass-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-muted-foreground text-xs">Key: {setting.key}</p>
                  </div>
                  {isBool ? (
                    <Switch
                      checked={val === "true"}
                      onCheckedChange={(checked) => updateSetting(setting, checked ? "true" : "false")}
                    />
                  ) : (
                    <input
                      className="glass border border-border/50 rounded-lg px-3 py-1.5 text-sm w-24 text-center bg-muted/30"
                      value={val}
                      onChange={(e) => updateSetting(setting, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Admin;
