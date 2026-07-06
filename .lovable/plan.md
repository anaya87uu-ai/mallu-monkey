# Welcome Page Redesign

Rework `src/pages/Welcome.tsx` into a richer, more motion-forward landing surface while keeping the current green glass theme and Google-only auth CTA.

## New page structure

1. **Hero band** (top)
   - Live badge (kept, animated ping)
   - Big display headline "Meet Strangers. Make Memories." with per-word stagger fade-in
   - Sub-copy + primary CTA (Sign in with Google) + tiny trust line
   - Floating decorative orbs using existing `ambient-bg` tokens + `animate-float`

2. **Bento grid** (replaces the flat 2x2 feature grid)
   - Asymmetric 4x3 grid on desktop, 2-col on mobile
   - Tiles:
     - Large: "HD Video Chat" with subtle animated gradient
     - Tall: "Live stats" mini-panel (users online, chats today) - static illustrative numbers
     - Wide: "Play together — Tic-Tac-Toe & more" with icon cluster
     - Small: "One-tap Skip"
     - Small: "Live text chat"
     - Medium: "Global reach" with flag chips
   - Each tile: `glass-card`, hover lift, icon in tinted square, motion `whileInView` fade+rise

3. **How it works — 3 steps**
   - Horizontal timeline on desktop, vertical on mobile
   - Steps: 1) Sign in with Google · 2) Get matched instantly · 3) Chat, play, skip
   - Numbered circles with gradient ring, connecting divider line, staggered entry

4. **Safety & moderation**
   - Two-column band (stacks on mobile)
   - Left: heading "Safe by design" + copy
   - Right: 3 pill cards — 18+ only, AI nudity detection, One-tap report — each with icon + short line
   - Subtle green tinted background block using `bg-primary/5`

5. **Final CTA strip**
   - Recap headline + Google sign-in button (same style as hero)
   - Footer trust row (moderated 24/7 · anonymous · free)

## Motion additions

- `framer-motion` `whileInView` with `viewport={{ once: true, margin: "-80px" }}` on each section
- Stagger children (0.08s) for bento tiles and step cards
- Hover: bento tiles lift `-4px` + shadow bump (Tailwind transition, not JS)
- Existing `animate-float`, `animate-pulse-glow`, `ambient-bg` reused for orbs

## Scope & constraints

- Only edits `src/pages/Welcome.tsx` (single file)
- No new deps, no route changes, no auth changes
- Uses existing design tokens only (`glass-card`, `primary`, `accent`, `secondary`, `muted-foreground`, `border`)
- Keeps Google-only auth CTA (no guest, no email)
- Auth redirect logic (`useEffect` → `/chat` if session) preserved
- Mobile-first, safe-area friendly, no horizontal scroll

## Out of scope

Testimonials, live-stats section, dark hero variant, layout/color changes elsewhere, backend changes.
