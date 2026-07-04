import { useMemo, useState } from "react";
import { CheckCircle, XCircle, Search, ArrowUpDown, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { AdminProfile, AdminReport } from "@/hooks/useAdminData";
import { downloadCSV } from "@/lib/adminUtils";

interface ReportsTabProps {
  reports: AdminReport[];
  profiles: AdminProfile[];
  loading: boolean;
  onResolve: (reportId: string, status: string) => void;
  onSelectReport: (report: AdminReport) => void;
}

const statusColors: Record<string, string> = {
  pending: "destructive",
  resolved: "default",
  dismissed: "secondary",
};

const ReportsTab = ({ reports, profiles, loading, onResolve, onSelectReport }: ReportsTabProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);

  const profileById = useMemo(() => {
    const m = new Map<string, AdminProfile>();
    for (const p of profiles) m.set(p.user_id, p);
    return m;
  }, [profiles]);

  const nameFor = (userId: string | null) => {
    if (!userId) return "Unknown";
    return profileById.get(userId)?.display_name || `${userId.slice(0, 8)}…`;
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reports
      .filter((r) => {
        if (statusFilter !== "all" && r.status !== statusFilter) return false;
        if (!q) return true;
        return (
          r.reason.toLowerCase().includes(q) ||
          nameFor(r.reporter_id).toLowerCase().includes(q) ||
          nameFor(r.reported_user_id).toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const dir = sortAsc ? 1 : -1;
        return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      });
  }, [reports, search, statusFilter, sortAsc, profileById]);

  const exportCsv = () => {
    downloadCSV(
      `reports-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((r) => ({
        id: r.id,
        reporter: nameFor(r.reporter_id),
        reported: nameFor(r.reported_user_id),
        reason: r.reason,
        status: r.status,
        created_at: r.created_at,
      })),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports, users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 glass border-border/50 bg-muted/30"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36 glass border-border/50 bg-muted/30">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={exportCsv} className="gap-1 h-9">
          <Download className="w-3.5 h-3.5" /> CSV
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Reported</TableHead>
              <TableHead className="hidden md:table-cell">Reporter</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>
                <button onClick={() => setSortAsc(!sortAsc)} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Date <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  {search || statusFilter !== "all" ? "No reports match your filters" : "No reports"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((report) => (
                <TableRow key={report.id} className="cursor-pointer" onClick={() => onSelectReport(report)}>
                  <TableCell className="text-sm font-medium">{nameFor(report.reported_user_id)}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{nameFor(report.reporter_id)}</TableCell>
                  <TableCell className="text-sm max-w-[220px] truncate">{report.reason}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[report.status] as any || "outline"} className="text-xs capitalize">
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    {report.status === "pending" ? (
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline" onClick={() => onResolve(report.id, "resolved")} className="gap-1 h-7 text-xs">
                          <CheckCircle className="w-3 h-3" /> <span className="hidden sm:inline">Resolve</span>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onResolve(report.id, "dismissed")} className="gap-1 h-7 text-xs text-muted-foreground">
                          <XCircle className="w-3 h-3" /> <span className="hidden sm:inline">Dismiss</span>
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => onSelectReport(report)} className="h-7 w-7 p-0">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsTab;
