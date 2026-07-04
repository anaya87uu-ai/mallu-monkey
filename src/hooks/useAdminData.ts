import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  gender: string | null;
  is_banned: boolean;
  banned_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminReport {
  id: string;
  reporter_id: string | null;
  reported_user_id: string;
  reason: string;
  status: string;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export interface AdminSetting {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}

interface State {
  profiles: AdminProfile[];
  reports: AdminReport[];
  settings: AdminSetting[];
  loading: boolean;
  refreshing: boolean;
  lastFetched: number | null;
  error: string | null;
}

const POLL_MS = 30_000;

export function useAdminData(enabled: boolean) {
  const [state, setState] = useState<State>({
    profiles: [],
    reports: [],
    settings: [],
    loading: true,
    refreshing: false,
    lastFetched: null,
    error: null,
  });
  const mounted = useRef(true);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setState((s) => ({ ...s, refreshing: true, error: null }));
    try {
      const [profilesRes, reportsRes, settingsRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("reports").select("*").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("*").order("key"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (reportsRes.error) throw reportsRes.error;
      if (settingsRes.error) throw settingsRes.error;
      if (!mounted.current) return;
      setState({
        profiles: (profilesRes.data as AdminProfile[]) || [],
        reports: (reportsRes.data as AdminReport[]) || [],
        settings: (settingsRes.data as AdminSetting[]) || [],
        loading: false,
        refreshing: false,
        lastFetched: Date.now(),
        error: null,
      });
    } catch (e: any) {
      if (!mounted.current) return;
      const msg = e?.message || "Failed to load admin data";
      setState((s) => ({ ...s, loading: false, refreshing: false, error: msg }));
      if (!silent) toast.error(msg);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    if (!enabled) return;
    fetchAll();
    const id = window.setInterval(() => fetchAll(true), POLL_MS);
    return () => {
      mounted.current = false;
      window.clearInterval(id);
    };
  }, [enabled, fetchAll]);

  const patchProfile = useCallback((id: string, patch: Partial<AdminProfile>) => {
    setState((s) => ({ ...s, profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }, []);
  const patchReport = useCallback((id: string, patch: Partial<AdminReport>) => {
    setState((s) => ({ ...s, reports: s.reports.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }, []);
  const patchSetting = useCallback((id: string, patch: Partial<AdminSetting>) => {
    setState((s) => ({ ...s, settings: s.settings.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  }, []);

  return { ...state, fetchAll, patchProfile, patchReport, patchSetting };
}
