import { useState } from "react";
import { Ban, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  gender: string | null;
  is_banned: boolean;
  created_at: string;
}

interface UsersTabProps {
  profiles: Profile[];
  onToggleBan: (profile: Profile) => void;
}

type SortKey = "display_name" | "created_at" | "is_banned";

const UsersTab = ({ profiles, onToggleBan }: UsersTabProps) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = profiles
    .filter((p) => {
      const q = search.toLowerCase();
      return !q || (p.display_name?.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortKey === "display_name") return dir * (a.display_name || "").localeCompare(b.display_name || "");
      if (sortKey === "is_banned") return dir * (Number(a.is_banned) - Number(b.is_banned));
      return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 glass border-border/50 bg-muted/30"
          />
        </div>
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">#</TableHead>
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {search ? "No users match your search" : "No users yet"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((profile, i) => (
                <TableRow key={profile.id}>
                  <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm">
                        {profile.gender === "girl" ? "👧" : "👦"}
                      </div>
                      <span className="font-medium text-sm">{profile.display_name || "Anonymous"}</span>
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
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={profile.is_banned ? "outline" : "destructive"}
                      onClick={() => onToggleBan(profile)}
                      className="gap-1 h-8"
                    >
                      <Ban className="w-3 h-3" />
                      <span className="hidden sm:inline">{profile.is_banned ? "Unban" : "Ban"}</span>
                    </Button>
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

export default UsersTab;
