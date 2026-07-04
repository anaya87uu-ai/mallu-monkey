// Small helpers shared across admin components.

export function toCSV(rows: Record<string, any>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}

export function downloadCSV(filename: string, rows: Record<string, any>[]) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * site_settings.value is jsonb. Historical rows may have been double-encoded
 * (a JSON string wrapping the real value). Normalize to a native JS value.
 */
export function normalizeSettingValue(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  // If it looks like JSON, try to parse — otherwise leave as-is.
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export function settingDisplayString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  return JSON.stringify(v);
}
