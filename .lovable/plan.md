## Admin dashboard: bugs, polish, features

### Bugs to fix

1. **Settings double-encoding.** `updateSetting` calls `JSON.stringify(newValue)` before writing, but the `value` column is already `jsonb`. Booleans get stored as the string `"\"true\""` and rendered as `"true"` (with quotes) on next load. Fix: send the raw JS value (`true`/`false`/`"text"`) and let PostgREST encode it. Also normalize on read so existing corrupted values display cleanly.
2. **Settings reads are unsafe.** `SiteSetting.value` is typed as `string` but the DB returns any JSON. Coerce to string for the input, keep native type for booleans.
3. **Report actions crash on missing session.** `resolved_by` is set to `session?.user?.id` which can be `undefined`; guard and abort with a toast if not signed in.
4. **Stats "Live" label lies** — no realtime subscription. Either wire Realtime on `profiles`/`reports` or remove the label. I'll add Realtime subscriptions.
5. **Sticky tab bar overlap** — `sticky top-16` sits under the fixed header but the bar is transparent above content on scroll. Add a solid backdrop and correct offset.
6. **Users tab search** only matches `display_name`. Include user id substring so admins can find OAuth users without a display name.
7. **Reports tab shows only `reason`** — reporter and reported users are opaque UUIDs. Join to profiles and show display names + a "View profile" popover.
8. **Ban action doesn't check self-ban** — an admin can ban themselves and lose access. Block it.
9. **`fetchAll` has no error handling** — a failed request silently leaves stale data. Add toast + retry.

### Visual redesign / layout polish

- Rework header: compact on mobile, larger gradient title on desktop, add "last refreshed" timestamp next to Refresh.
- Replace `AdminStats` 3-card row with a 4-card row (Total Users, Active 24h, Pending Reports, Banned Users). Add sparkline-ish delta hint from last fetch.
- Tabs: pill nav with icon+count badges (users count, pending reports count). Keep the sticky header working with a proper blurred background.
- Tables: zebra rows, hover highlight, sticky header inside scroll container, empty-state illustrations.
- Consistent skeletons while loading (instead of a single centered spinner).

### New features

- **User detail drawer** (click a row): shows profile, points, chat stats, recent reports involving them, ban/unban, role toggle (grant/revoke admin via `user_roles`).
- **Report detail dialog**: reporter + reported profile cards, full reason, quick "Ban reported user" + Resolve/Dismiss.
- **Bulk actions on users**: multi-select rows → bulk ban/unban.
- **CSV export** for users and reports (client-side).
- **Global search bar** in the header that filters the active tab.

### Performance & data loading

- Paginate `profiles` and `reports` (25/page) with server-side `range()` + total count; keeps admin fast at scale.
- Realtime subscriptions on `profiles`, `reports`, `site_settings` — incoming changes patch local state instead of full refetch.
- Skeleton rows during initial + page loads.
- Debounce search input (250ms).
- Memoize sort/filter pipelines.

### Files to change

- `src/pages/Admin.tsx` — data loading, pagination, realtime, error handling, self-ban guard, settings fix, layout tweaks.
- `src/components/admin/AdminStats.tsx` — 4 cards, active-24h + banned counts, remove fake "Live" or wire it.
- `src/components/admin/UsersTab.tsx` — multi-select, row click → drawer, id search, skeletons, CSV export.
- `src/components/admin/ReportsTab.tsx` — join profile data, detail dialog, CSV export, skeletons.
- `src/components/admin/SettingsTab.tsx` — fix value encoding/display.
- New `src/components/admin/UserDetailDrawer.tsx`.
- New `src/components/admin/ReportDetailDialog.tsx`.
- New `src/hooks/useAdminData.ts` — encapsulates fetch + realtime + pagination.

### Out of scope

- No schema changes (existing tables/policies are sufficient).
- No changes to auth flow, welcome page, or chat.
