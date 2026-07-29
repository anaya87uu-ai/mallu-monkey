# Black & white theme (dark base)

Swap the emerald/green theme for a monochrome dark palette: near-black backgrounds, white text and buttons, grayscale surfaces. Red is kept only for destructive actions (ban, report, errors, timer critical states).

## Palette

| Token | Value |
| --- | --- |
| background | near-black `#0A0A0A` |
| card / popover | `#141414` |
| foreground | `#F5F5F5` |
| primary | white, with black text on it |
| secondary / muted | `#1F1F1F`, muted text `#A3A3A3` |
| accent | light gray `#D4D4D4` |
| border / input | `#2A2A2A` |
| destructive | red (kept) |

## What changes

- **`src/index.css`** — rewrite the token block to the monochrome values above. Update the themed component classes that currently hardcode green: `gradient-text` (becomes white-to-gray), `glow-primary` / `glow-cyan` (become neutral white glows), `glass-*` panel shadows and borders (neutral), and the `ambient-bg` aurora blobs (green radial gradients become soft white/gray).
- **`tailwind.config.ts`** — keep the token mapping; repoint the `mint` and `forest` custom colors to dark gray shades so existing `bg-mint` / `text-forest` usages read correctly instead of green.
- **Green literals in components** — replace remaining hardcoded green/emerald utility classes with tokens. Known spots: online/active dot in `PlayerAvatar` and status indicators, `text-emerald-*` in Leaderboards, gradient CTAs using `from-primary to-accent`, Admin stat card tints, Chat video panel accents, and the watermark pill's primary dot.
- **Contrast pass** — because `primary` becomes white, buttons using `text-primary-foreground` need black foreground (handled by the token) and any `bg-primary/15` soft states become subtle white tints.

## Kept as-is

Red destructive styling, all layout, motion, copy, and business logic. No schema or backend changes.

## Technical notes

All colors stay HSL in `index.css` and continue to flow through the existing semantic tokens, so pages that already use tokens update automatically. Files touched: `src/index.css`, `tailwind.config.ts`, plus targeted class swaps in Leaderboards, Games, Chat, Welcome, Admin components, `PlayerAvatar`, `TurnTimer`, `Header`, `BottomNav`, and `Footer`.
