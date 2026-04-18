import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, Flag, Settings, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminStats from "@/components/admin/AdminStats";
import UsersTab from "@/components/admin/UsersTab";
import ReportsTab from "@/components/admin/ReportsTab";
import SettingsTab from "@/components/admin/SettingsTab";

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
    if (error) { toast.error("Failed to update user"); return; }
    toast.success(newBanned ? "User banned" : "User unbanned");
    setProfiles((prev) => prev.map((p) => (p.id === profile.id ? { ...p, is_banned: newBanned } : p)));
  };

  const resolveReport = async (reportId: string, status: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("reports")
      .update({ status, resolved_by: session?.user?.id, resolved_at: new Date().toISOString() })
      .eq("id", reportId);
    if (error) { toast.error("Failed to update report"); return; }
    toast.success(`Report ${status}`);
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
  };

  const updateSetting = async (setting: SiteSetting, newValue: string) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: JSON.stringify(newValue) })
      .eq("id", setting.id);
    if (error) { toast.error("Failed to update setting"); return; }
    toast.success("Setting updated");
    setSettings((prev) => prev.map((s) => (s.id === setting.id ? { ...s, value: newValue } : s)));
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
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage users, reports & settings</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAll} className="gap-2 hover:bg-mint/40 hover:border-primary/40">
            <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Stats */}
        <AdminStats userCount={profiles.length} pendingReports={pendingReports} settingsCount={settings.length} />

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="glass w-full mb-6">
            <TabsTrigger value="users" className="flex-1 gap-2">
              <Users className="w-4 h-4" /> <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 gap-2">
              <Flag className="w-4 h-4" /> <span className="hidden sm:inline">Reports</span>
              {pendingReports > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">{pendingReports}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 gap-2">
              <Settings className="w-4 h-4" /> <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTab profiles={profiles} onToggleBan={toggleBan} />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsTab reports={reports} onResolve={resolveReport} />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab settings={settings} onUpdate={updateSetting} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Admin;
