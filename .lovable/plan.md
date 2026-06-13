## Mobile UI Redesign Pass

A full mobile-first polish across every screen, keeping the existing emerald glassy/glowy aesthetic but tightening composition, density, touch targets, and the broken Account nav tab.

### 1. Bottom Nav — replace Account with Profile/Logout menu
File: `src/components/layout/BottomNav.tsx`

- Drop the dead `/account` link.
- Final 5 tabs: Home, Chat, Games, Leaders, **Me** (UserCircle).
- "Me" opens a shadcn `Drawer` (bottom sheet) with:
  - Avatar + display name + guest/Google badge
  - Quick links: About, Contact, Privacy, Terms
  - Admin link (only if `useAdminAuth` returns admin)
  - Destructive "Log Out" button (reuses Header's signOut logic — extract to a tiny `useAuthSession` hook so Header + BottomNav share it).
- Bump tab height to `h-16`, add `pb-[env(safe-area-inset-bottom)]` so iOS home-indicator doesn't overlap.
- Active tab: filled glass pill + emerald glow (already there, refine sizing).

### 2. Header — mobile compaction
File: `src/components/layout/Header.tsx`

- On mobile, hide the hamburger menu entirely (nav lives in BottomNav now). Keep only logo + Join Chat CTA when logged out.
- Logged-in mobile header shows logo only (profile lives in bottom drawer).
- Add safe-area top padding.

### 3. Layout shell
File: `src/components/layout/Layout.tsx`

- `pb-24` on `<main>` for mobile (clears taller bottom dock + safe area).
- Hide `<Footer />` on mobile (`hidden md:block`) — footer content already accessible via Me drawer. Keeps mobile feeling app-like, not webby.

### 4. Page-by-page mobile composition tightening

**Welcome (`src/pages/Welcome.tsx`)** — hero stack: condense to one 100dvh viewport on mobile (no scroll for primary CTA). Bigger glass age-gate card, full-width primary CTA, secondary actions as ghost pills.

**Index/Home (`src/pages/Index.tsx`)** — convert feature grid to a vertical snap carousel on mobile; sticky "Start Chat" CTA bar above bottom nav.

**Chat (`src/pages/Chat.tsx`)** — already video-first; mobile tweaks:
- Floating dock: thumb-reachable, raised above bottom nav, larger 56px circular controls.
- Local PiP: smaller (96×128), draggable corner, rounded-2xl.
- Watermark + stranger-info chips: top inset respects notch.
- Report button moved into a top-right glass icon button.

**Games (`src/pages/Games.tsx`)** — single-column card stack, larger tap zones for game tiles.

**Leaderboards (`src/pages/Leaderboards.tsx`)** — switch table → glass card list rows on mobile (rank chip + avatar + name + points). Sticky filter tabs.

**Auth (`src/pages/Auth.tsx`)** — full-bleed glass card, larger inputs (h-12), bigger Google button.

**About / Contact / Privacy / Terms / NotFound** — consistent mobile padding (`px-4`), bumped body line-height, glass section cards instead of flat text walls.

**Admin (`src/pages/Admin.tsx`)** — tabs become a scrollable segmented control on mobile; stats cards in 2-col grid.

### 5. Global mobile primitives (`src/index.css`)

- Add `.glass-dock` variant tuned for bottom positioning (stronger top highlight, deeper bottom shadow).
- Add safe-area utilities: `.safe-top`, `.safe-bottom`.
- Bump minimum interactive target to 44×44 via a `.tap` utility used on small icon buttons.
- Slightly increase base font-size on `<768px` (15px → 16px) for readability.

### Out of scope
- No backend/WebRTC/auth logic changes.
- No new pages or routes.
- Color tokens and fonts unchanged.

### Technical notes
- New file: `src/hooks/useAuthSession.ts` — shared session+logout (refactor from Header).
- New component: `src/components/layout/ProfileDrawer.tsx` — used by BottomNav "Me" tab.
- Reuse existing shadcn `Drawer` (vaul) — already in project.
- All edits frontend-only.
