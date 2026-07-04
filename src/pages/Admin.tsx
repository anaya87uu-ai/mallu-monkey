import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, Flag, Settings, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData, type AdminProfile, type AdminReport, type AdminSetting } from "@/hooks/useAdminData";
import AdminStats from "@/components/admin/AdminStats";
import UsersTab from "@/components/admin/UsersTab";
import ReportsTab from "@/components/admin/ReportsTab";
import SettingsTab from "@/components/admin/SettingsTab";
import UserDetailDrawer from "@/components/admin/UserDetailDrawer";
import ReportDetailDialog from "@/components/admin/ReportDetailDialog";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, userId } = useAdminAuth();
  const {
    profiles, reports, settings, loading, refreshing, lastFetched, error,
    fetchAll, patchProfile, patchReport, patchSetting,
  } = useAdminData(isAdmin);

  const [selectedProfile, setSelectedProfile] = useState<AdminProfile | null>(null);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Access denied");
      navigate("/");
    }
  }, [authLoading, isAdmin, navigate]);

  const setBanned = async (profile: AdminProfile, banned: boolean, silent = false) => {
    if (profile.user_id === userId) {
      toast.error("You can't ban yourself");
      return false;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ is_banned: banned, banned_at: banned ? new Date().toISOString() : null })
      .eq("id", profile.id);
    if (error) { toast.error(error.message || "Failed to update user"); return false; }
    if (!silent) toast.success(banned ? "User banned" : "User unbanned");
    patchProfile(profile.id, { is_banned: banned, banned_at: banned ? new Date().toISOString() : null });
    return true;
  };

  const toggleBan = (profile: AdminProfile) => setBanned(profile, !profile.is_banned);

  const bulkBan = async (list: AdminProfile[], ban: boolean) => {
    const targets = list.filter((p) => p.user_id !== userId);
    if (targets.length === 0) { toast.error("Nothing to update"); return; }
    let ok = 0;
    for (const p of targets) {
      // eslint-disable-next-line no-await-in-loop
      if (await setBanned(p, ban, true)) ok++;
    }
    toast.success(`${ban ? "Banned" : "Unbanned"} ${ok} user${ok !== 1 ? "s" : ""}`);
  };

  const resolveReport = async (reportId: string, status: string) => {
    if (!userId) { toast.error("Session expired, refresh and try again"); return; }
    const { error } = await supabase
      .from("reports")
      .update({ status, resolved_by: userId, resolved_at: new Date().toISOString() })
      .eq("id", reportId);
    if (error) { toast.error(error.message || "Failed to update report"); return; }
    toast.success(`Report ${status}`);
    patchReport(reportId, { status, resolved_by: userId, resolved_at: new Date().toISOString() });
  };

  const updateSetting = async (setting: AdminSetting, newValue: unknown) => {
    // Send the native JS value — the column is jsonb, PostgREST handles encoding.
    const { error } = await supabase
      .from("site_settings")
      .update({ value: newValue as any })
      .eq("id", setting.id);
    if (error) { toast.error(error.message || "Failed to update setting"); return; }
    toast.success("Setting updated");
    patchSetting(setting.id, { value: newValue });
  };

  const pendingReports = useMemo(() => reports.filter((r) => r.status === "pending").length, [reports]);
  const bannedCount = useMemo(() => profiles.filter((p) => p.is_banned).length, [profiles]);
  const activeCount = useMemo(() => {
    const since = Date.now() - 24 * 60 * 60 * 1000;
    return profiles.filter((p) => new Date(p.updated_at).getTime() >= since).length;
  }, [profiles]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shrink-0"
            >
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
            </motion.div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-0.5">Control panel</p>
              <h1 className="font-display text-xl md:text-3xl font-bold gradient-text tracking-tight truncate">Admin Dashboard</h1>
              <p className="text-muted-foreground text-xs md:text-sm truncate">
                {lastFetched ? `Updated ${new Date(lastFetched).toLocaleTimeString()}` : "Manage users, reports & settings"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAll()}
            disabled={refreshing}
            className="rounded-full gap-2 bg-background/60 border-border/60 hover:bg-mint/40 hover:border-primary/40 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {error && (
          <div className="glass-panel border-destructive/40 rounded-xl px-4 py-3 text-sm text-destructive">
            {error} · <button className="underline" onClick={() => fetchAll()}>Retry</button>
          </div>
        )}

        {/* Stats */}
        <AdminStats
          userCount={profiles.length}
          activeCount={activeCount}
          pendingReports={pendingReports}
          bannedCount={bannedCount}
        />

        {/* Tabs */}
        <Tabs defaultValue="users">
          <div className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-6 bg-background/85 backdrop-blur-xl border-b border-border/40">
            <TabsList className="glass-panel w-full p-1 rounded-full h-auto">
              <TabsTrigger value="users" className="flex-1 gap-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
                <Badge variant="secondary" className="text-[10px] px-1.5">{profiles.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex-1 gap-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline">Reports</span>
                {pendingReports > 0 && <Badge variant="destructive" className="text-[10px] px-1.5">{pendingReports}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 gap-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users">
            <UsersTab
              profiles={profiles}
              loading={loading}
              currentUserId={userId}
              onToggleBan={toggleBan}
              onBulkBan={bulkBan}
              onSelectUser={setSelectedProfile}
            />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsTab
              reports={reports}
              profiles={profiles}
              loading={loading}
              onResolve={resolveReport}
              onSelectReport={setSelectedReport}
            />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab settings={settings} onUpdate={updateSetting} />
          </TabsContent>
        </Tabs>
      </motion.div>

      <UserDetailDrawer
        profile={selectedProfile}
        currentUserId={userId}
        open={!!selectedProfile}
        onOpenChange={(o) => !o && setSelectedProfile(null)}
        onToggleBan={(p) => toggleBan(p)}
      />
      <ReportDetailDialog
        report={selectedReport}
        profiles={profiles}
        open={!!selectedReport}
        onOpenChange={(o) => !o && setSelectedReport(null)}
        onResolve={resolveReport}
        onBanReported={(p) => { setBanned(p, true); setSelectedReport(null); }}
      />
    </div>
  );
};

export default Admin;
