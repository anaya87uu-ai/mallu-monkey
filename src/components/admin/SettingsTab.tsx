import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
}

interface SettingsTabProps {
  settings: SiteSetting[];
  onUpdate: (setting: SiteSetting, newValue: string) => void;
}

const SettingsTab = ({ settings, onUpdate }: SettingsTabProps) => {
  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Setting</TableHead>
            <TableHead>Key</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                No settings configured
              </TableCell>
            </TableRow>
          ) : (
            settings.map((setting) => {
              const val = typeof setting.value === "string" ? setting.value : JSON.stringify(setting.value);
              const isBool = val === "true" || val === "false";
              const label = setting.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <TableRow key={setting.id}>
                  <TableCell className="font-medium text-sm">{label}</TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono">{setting.key}</TableCell>
                  <TableCell className="text-right">
                    {isBool ? (
                      <Switch
                        checked={val === "true"}
                        onCheckedChange={(checked) => onUpdate(setting, checked ? "true" : "false")}
                      />
                    ) : (
                      <input
                        className="glass border border-border/50 rounded-lg px-3 py-1.5 text-sm w-28 text-center bg-muted/30"
                        value={val}
                        onChange={(e) => onUpdate(setting, e.target.value)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SettingsTab;
