## Scope

Four small, focused changes. No new dependencies, no schema changes.

## 1. Mirror the stranger's video

**File:** `src/pages/Chat.tsx`

Add `scale-x-[-1]` to the remote `<video>` element so the stranger's feed is mirrored to match the local preview style.

## 2. Terms & Privacy links in mobile profile drawer

**File:** `src/components/layout/ProfileDrawer.tsx`

Add a "Legal" section at the bottom of the drawer with two `Link` rows:
- Terms of Service → `/terms`
- Privacy Policy → `/privacy`

Uses existing drawer row styling (icon + label). Visible on all sizes but primary target is mobile where the footer is hidden.

## 3. Leaderboards: real name + chat time

**File:** `src/pages/Leaderboards.tsx`

- Show `display_name` from `chat_stats` / `user_points` (already stored via `sync_display_name`) as the primary label instead of any anonymous fallback.
- Add a "Chat Time" column (or badge under the name) formatted as `Hh Mm` from `chat_stats.total_seconds`.
- Keep existing points ranking; add a secondary tab or column so users see both points and total chat time.

Data source: existing `chat_stats` table (`user_id`, `display_name`, `total_seconds`, `chats_completed`) — no migration needed.

## 4. Welcome page improvements

**File:** `src/pages/Welcome.tsx` (single-file edit, add 4 new sections between existing bento and FAQ)

### 4a. Live stats strip
Row of 3 animated counters (users online, chats today, countries). Illustrative values, `framer-motion` count-up on `whileInView`. Green glass cards.

### 4b. Product preview carousel
Horizontal snap-scroll of 4 screenshot-style mock cards (Video match, Text chat, Games, Skip flow). Built with pure divs + gradients + lucide icons — no real screenshots, no new assets. Auto-advance every 4s with dots indicator.

### 4c. Testimonials section
3-card grid (stacks on mobile) with quote, name, country flag emoji, star rating. Uses `glass-card`, staggered `whileInView` fade-up. Content is illustrative.

### 4d. Comparison table
Responsive table: rows = features (HD video, AI moderation, Free, No sign-up friction, Games, Global reach), columns = Mallu Monkey / Omegle / Chatroulette. Check/X icons with green highlight on the Mallu Monkey column. Collapses to stacked cards on mobile.

All new sections reuse existing tokens (`glass-card`, `primary`, `accent`, `SectionEyebrow`, `SectionTitle`) and `framer-motion` patterns already in the file.

## Out of scope

- No changes to matching, WebRTC, or moderation logic
- No new tables or migrations
- No real analytics wiring for the live stats (illustrative only)
- No changes to desktop footer legal links (already present)
