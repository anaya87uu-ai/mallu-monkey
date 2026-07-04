import { useMemo, useState } from "react";
import { Ban, Search, ArrowUpDown, Download, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { AdminProfile } from "@/hooks/useAdminData";
import { downloadCSV } from "@/lib/adminUtils";

interface UsersTabProps {
  profiles: AdminProfile[];
  loading: boolean;
  currentUserId: string | null;
  onToggleBan: (profile: AdminProfile) => void;
  onBulkBan: (profiles: AdminProfile[], ban: boolean) => void;
  onSelectUser: (profile: AdminProfile) => void;
}

type SortKey = "display_name" | "created_at" | "is_banned";

const UsersTab = ({ profiles, loading, currentUserId, onToggleBan, onBulkBan, onSelectUser }: UsersTabProps) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return profiles
      .filter((p) => {
        if (!q) return true;
        return (
          p.display_name?.toLowerCase().includes(q) ||
          p.user_id.toLowerCase().includes(q) ||
          p.gender?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const dir = sortAsc ? 1 : -1;
        if (sortKey === "display_name") return dir * (a.display_name || "").localeCompare(b.display_name || "");
        if (sortKey === "is_banned") return dir * (Number(a.is_banned) - Number(b.is_banned));
        return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      });
  }, [profiles, search, sortKey, sortAsc]);

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const selectedProfiles = filtered.filter((p) => selected.has(p.id));

  const exportCsv = () => {
    downloadCSV(
      `users-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((p) => ({
        id: p.id,
        user_id: p.user_id,
        display_name: p.display_name,
        gender: p.gender,
        is_banned: p.is_banned,
        created_at: p.created_at,
      })),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, id, gender..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 glass border-border/50 bg-muted/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </Badge>
          <Button size="sm" variant="outline" onClick={exportCsv} className="gap-1 h-9">
            <Download className="w-3.5 h-3.5" /> CSV
          </Button>
        </div>
      </div>

      {selectedProfiles.length > 0 && (
        <div className="glass-panel rounded-xl px-4 py-2 flex items-center justify-between text-sm">
          <span>{selectedProfiles.length} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" onClick={() => { onBulkBan(selectedProfiles, true); setSelected(new Set()); }}>
              Ban all
            </Button>
            <Button size="sm" variant="outline" onClick={() => { onBulkBan(selectedProfiles, false); setSelected(new Set()); }}>
              Unban all
            </Button>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort("display_name")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  User <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">Gender</TableHead>
              <TableHead>
                <button onClick={() => handleSort("created_at")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Joined <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort("is_banned")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Status <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  {search ? "No users match your search" : "No users yet"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((profile) => {
                const isSelf = profile.user_id === currentUserId;
                return (
                  <TableRow
                    key={profile.id}
                    className={`cursor-pointer ${selected.has(profile.id) ? "bg-primary/5" : ""}`}
                    onClick={() => onSelectUser(profile)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(profile.id)}
                        onCheckedChange={() => toggleOne(profile.id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-sm shrink-0">
                          {profile.gender === "girl" ? "👧" : "👦"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">
                            {profile.display_name || "Anonymous"}
                            {isSelf && <span className="ml-1 text-[10px] text-primary">(you)</span>}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono truncate">{profile.user_id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell capitalize text-muted-foreground text-sm">
                      {profile.gender || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {profile.is_banned ? (
                        <Badge variant="destructive" className="text-xs">Banned</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="sm"
                          variant={profile.is_banned ? "outline" : "destructive"}
                          onClick={() => onToggleBan(profile)}
                          disabled={isSelf}
                          title={isSelf ? "You can't ban yourself" : undefined}
                          className="gap-1 h-8"
                        >
                          <Ban className="w-3 h-3" />
                          <span className="hidden sm:inline">{profile.is_banned ? "Unban" : "Ban"}</span>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onSelectUser(profile)} className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersTab;
