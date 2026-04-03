import { useState } from "react";
import { CheckCircle, XCircle, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Report {
  id: string;
  reporter_id: string | null;
  reported_user_id: string;
  reason: string;
  status: string;
  created_at: string;
}

interface ReportsTabProps {
  reports: Report[];
  onResolve: (reportId: string, status: string) => void;
}

const statusColors: Record<string, string> = {
  pending: "destructive",
  resolved: "default",
  dismissed: "secondary",
};

const ReportsTab = ({ reports, onResolve }: ReportsTabProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = reports
    .filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (search && !r.reason.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
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
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">#</TableHead>
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  {search || statusFilter !== "all" ? "No reports match your filters" : "No reports"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((report, i) => (
                <TableRow key={report.id}>
                  <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                  <TableCell className="text-sm font-medium max-w-[200px] truncate">
                    {report.reason}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[report.status] as any || "outline"} className="text-xs capitalize">
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {report.status === "pending" ? (
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline" onClick={() => onResolve(report.id, "resolved")} className="gap-1 h-7 text-xs">
                          <CheckCircle className="w-3 h-3" /> Resolve
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onResolve(report.id, "dismissed")} className="gap-1 h-7 text-xs text-muted-foreground">
                          <XCircle className="w-3 h-3" /> Dismiss
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
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
