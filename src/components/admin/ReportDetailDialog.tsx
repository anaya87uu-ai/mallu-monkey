import { CheckCircle, XCircle, Ban } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminProfile, AdminReport } from "@/hooks/useAdminData";

interface Props {
  report: AdminReport | null;
  profiles: AdminProfile[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (reportId: string, status: string) => void;
  onBanReported: (profile: AdminProfile) => void;
}

const statusColors: Record<string, string> = {
  pending: "destructive",
  resolved: "default",
  dismissed: "secondary",
};

const ReportDetailDialog = ({ report, profiles, open, onOpenChange, onResolve, onBanReported }: Props) => {
  if (!report) return null;
  const reported = profiles.find((p) => p.user_id === report.reported_user_id) || null;
  const reporter = report.reporter_id ? profiles.find((p) => p.user_id === report.reporter_id) || null : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span>Report details</span>
            <Badge variant={statusColors[report.status] as any} className="capitalize">{report.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <UserCard label="Reported" profile={reported} fallbackId={report.reported_user_id} />
          <UserCard label="Reporter" profile={reporter} fallbackId={report.reporter_id} />

          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Reason</div>
            <div className="glass-panel rounded-xl p-3 text-sm whitespace-pre-wrap">{report.reason}</div>
          </div>

          <div className="text-xs text-muted-foreground">
            Submitted {new Date(report.created_at).toLocaleString()}
            {report.resolved_at && ` · Resolved ${new Date(report.resolved_at).toLocaleString()}`}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {report.status === "pending" && (
              <>
                <Button size="sm" onClick={() => { onResolve(report.id, "resolved"); onOpenChange(false); }} className="gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Resolve
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { onResolve(report.id, "dismissed"); onOpenChange(false); }} className="gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Dismiss
                </Button>
              </>
            )}
            {reported && !reported.is_banned && (
              <Button size="sm" variant="destructive" onClick={() => onBanReported(reported)} className="gap-1 ml-auto">
                <Ban className="w-3.5 h-3.5" /> Ban reported user
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserCard = ({ label, profile, fallbackId }: { label: string; profile: AdminProfile | null; fallbackId: string | null }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
    <div className="glass-panel rounded-xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-lg shrink-0">
        {profile?.gender === "girl" ? "👧" : "👦"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{profile?.display_name || (fallbackId ? "Anonymous" : "Unknown")}</div>
        <div className="text-[10px] text-muted-foreground font-mono truncate">{fallbackId || "—"}</div>
      </div>
      {profile?.is_banned && <Badge variant="destructive" className="text-[10px]">Banned</Badge>}
    </div>
  </div>
);

export default ReportDetailDialog;
