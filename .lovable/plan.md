
The theme is already green/white (just applied). The user is asking again — likely wanting more polish on top of the token swap, since just changing colors didn't transform the look enough. Many components still carry dark-theme assumptions (dark video backdrops, glow effects tuned for dark bg, gradient text that may look weak on white).

## Polish Green & White Theme Across Key Pages

### Goal
The color tokens are already green/white, but the UI still feels like a recolored dark theme. Refine components so the light emerald aesthetic feels intentional, clean, and modern.

### Changes

**1. `src/index.css` — Refine glass + glow for light mode**
- Soften glass: brighter white base, subtle emerald-tinted border
- Replace heavy glow shadows (designed for dark bg) with soft emerald drop shadows
- Stronger `gradient-text` (emerald → deep green, not washed out)
- Add a subtle dotted/grid background pattern for depth

**2. `src/pages/Welcome.tsx` — Hero refresh**
- Lighten floating orbs (lower opacity, emerald/mint tones)
- Stronger headline contrast (deep forest text)
- Replace `glow-primary` with crisp emerald shadow on CTA
- Feature cards: white surface, emerald icon backgrounds, soft shadow on hover

**3. `src/components/layout/Header.tsx`**
- White glass header with emerald bottom border
- Active nav link: emerald pill background
- Logo gradient tuned for white bg

**4. `src/pages/Auth.tsx`**
- Card on soft mint-tinted background
- Google button: white with emerald border + hover lift
- Cleaner input styling

**5. `src/pages/Chat.tsx`**
- Keep video area dark (videos need dark backdrop) — wrap in a `bg-slate-900` container with emerald accent border
- Light controls bar with emerald active states
- Chat bubbles: emerald for "you", light gray for stranger

**6. `tailwind.config.ts`** — Add `mint` and `forest` color shortcuts for reuse.

### Out of scope
- Games, Leaderboards, Admin pages (token-only update is sufficient for now)
- Adding a dark mode toggle

### Files to edit
- `src/index.css`
- `src/pages/Welcome.tsx`
- `src/components/layout/Header.tsx`
- `src/pages/Auth.tsx`
- `src/pages/Chat.tsx`
- `tailwind.config.ts`
