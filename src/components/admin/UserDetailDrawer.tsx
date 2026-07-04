import { useEffect, useState } from "react";
import { Ban, Shield, ShieldCheck, MessageSquare, Trophy, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AdminProfile } from "@/hooks/useAdminData";

interface Props {
  profile: AdminProfile | null;
  currentUserId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleBan: (p: AdminProfile) => void;
}

interface Extra {
  isAdmin: boolean;
  points: number | null;
  level: number | null;
  totalChats: number | null;
  longestChat: number | null;
  reportCount: number;
  loading: boolean;
}

const initial: Extra = {
  isAdmin: false,
  points: null,
  level: null,
  totalChats: null,
  longestChat: null,
  reportCount: 0,
  loading: true,
};

const UserDetailDrawer = ({ profile, currentUserId, open, onOpenChange, onToggleBan }: Props) => {
  const [extra, setExtra] = useState<Extra>(initial);
  const [roleWorking, setRoleWorking] = useState(false);

  useEffect(() => {
    if (!open || !profile) return;
    setExtra(initial);
    (async () => {
      const [rolesRes, pointsRes, statsRes, reportsRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", profile.user_id),
        supabase.from("user_points").select("total_points, level").eq("user_id", profile.user_id).maybeSingle(),
        supabase.from("chat_stats").select("total_chats, longest_chat_seconds").eq("user_id", profile.user_id).maybeSingle(),
        supabase.from("reports").select("id", { count: "exact", head: true }).eq("reported_user_id", profile.user_id),
      ]);
      setExtra({
        isAdmin: (rolesRes.data || []).some((r: any) => r.role === "admin"),
        points: pointsRes.data?.total_points ?? 0,
        level: pointsRes.data?.level ?? 1,
        totalChats: statsRes.data?.total_chats ?? 0,
        longestChat: statsRes.data?.longest_chat_seconds ?? 0,
        reportCount: reportsRes.count ?? 0,
        loading: false,
      });
    })();
  }, [open, profile]);

  const toggleAdmin = async () => {
    if (!profile) return;
    setRoleWorking(true);
    if (extra.isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", profile.user_id).eq("role", "admin");
      if (error) toast.error("Failed to revoke admin");
      else { toast.success("Admin revoked"); setExtra((e) => ({ ...e, isAdmin: false })); }
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: profile.user_id, role: "admin" });
      if (error) toast.error("Failed to grant admin");
      else { toast.success("Admin granted"); setExtra((e) => ({ ...e, isAdmin: true })); }
    }
    setRoleWorking(false);
  };

  if (!profile) return null;
  const isSelf = profile.user_id === currentUserId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="glass overflow-y-auto w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-xl">
              {profile.gender === "girl" ? "👧" : "👦"}
            </div>
            <div className="min-w-0">
              <div className="truncate">{profile.display_name || "Anonymous"}</div>
              <div className="text-[10px] text-muted-foreground font-mono truncate">{profile.user_id}</div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap gap-2">
            {profile.is_banned ? (
              <Badge variant="destructive">Banned</Badge>
            ) : (
              <Badge variant="secondary">Active</Badge>
            )}
            {extra.isAdmin && <Badge className="gap-1"><ShieldCheck className="w-3 h-3" /> Admin</Badge>}
            <Badge variant="outline" className="capitalize">{profile.gender || "—"}</Badge>
            <Badge variant="outline">Joined {new Date(profile.created_at).toLocaleDateString()}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatBox icon={<Trophy className="w-4 h-4" />} label="Points" value={extra.loading ? "…" : extra.points ?? 0} />
            <StatBox icon={<Trophy className="w-4 h-4" />} label="Level" value={extra.loading ? "…" : extra.level ?? 1} />
            <StatBox icon={<MessageSquare className="w-4 h-4" />} label="Chats" value={extra.loading ? "…" : extra.totalChats ?? 0} />
            <StatBox icon={<MessageSquare className="w-4 h-4" />} label="Reports" value={extra.loading ? "…" : extra.reportCount} highlight={extra.reportCount > 0} />
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              variant={profile.is_banned ? "outline" : "destructive"}
              disabled={isSelf}
              onClick={() => onToggleBan(profile)}
            >
              <Ban className="w-4 h-4 mr-2" />
              {profile.is_banned ? "Unban user" : "Ban user"}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              disabled={isSelf || roleWorking}
              onClick={toggleAdmin}
            >
              {roleWorking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
              {extra.isAdmin ? "Revoke admin" : "Grant admin"}
            </Button>
            {isSelf && <p className="text-xs text-muted-foreground text-center">You can't modify your own account.</p>}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const StatBox = ({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: React.ReactNode; highlight?: boolean }) => (
  <div className={`glass-panel rounded-xl p-3 ${highlight ? "border-destructive/40" : ""}`}>
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
      {icon} {label}
    </div>
    <div className="font-display text-xl font-bold">{value}</div>
  </div>
);

export default UserDetailDrawer;
