import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { AdminSetting } from "@/hooks/useAdminData";
import { normalizeSettingValue, settingDisplayString } from "@/lib/adminUtils";

interface SettingsTabProps {
  settings: AdminSetting[];
  onUpdate: (setting: AdminSetting, newValue: unknown) => void;
}

const SettingsTab = ({ settings, onUpdate }: SettingsTabProps) => {
  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Setting</TableHead>
            <TableHead className="hidden sm:table-cell">Key</TableHead>
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
            settings.map((setting) => (
              <SettingRow key={setting.id} setting={setting} onUpdate={onUpdate} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const SettingRow = ({
  setting,
  onUpdate,
}: {
  setting: AdminSetting;
  onUpdate: (s: AdminSetting, v: unknown) => void;
}) => {
  const normalized = normalizeSettingValue(setting.value);
  const isBool = typeof normalized === "boolean";
  const display = settingDisplayString(normalized);
  const [text, setText] = useState(display);
  const label = setting.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <TableRow>
      <TableCell className="font-medium text-sm">{label}</TableCell>
      <TableCell className="hidden sm:table-cell text-muted-foreground text-xs font-mono">{setting.key}</TableCell>
      <TableCell className="text-right">
        {isBool ? (
          <Switch
            checked={normalized as boolean}
            onCheckedChange={(checked) => onUpdate(setting, checked)}
          />
        ) : (
          <Input
            className="glass border border-border/50 rounded-lg px-3 py-1.5 text-sm w-40 text-right bg-muted/30 ml-auto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => {
              if (text !== display) onUpdate(setting, text);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default SettingsTab;
