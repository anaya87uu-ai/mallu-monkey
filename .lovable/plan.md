

## Improve Home Dashboard — Responsive Layout for Desktop and Mobile

### Current Issues
- The page uses a single-column layout at all sizes with no `max-width` or `container` constraint, so on desktop it stretches edge-to-edge looking sparse.
- Quick action cards are always 2 columns — on desktop they could be 4 across.
- Stats grid is 2 cols on mobile, 4 on desktop — good, but cards are small on wide screens.
- The CTA section doesn't use the extra desktop space well.
- No two-column layout for desktop to pair the level card with stats side-by-side.

### Plan

**File: `src/pages/Index.tsx`** — Restyle with responsive improvements:

1. **Container constraint**: Wrap content in `max-w-5xl mx-auto` so the dashboard is centered and doesn't stretch on wide monitors.

2. **Desktop two-column layout for Level + Stats**: On `lg:` breakpoint, place the Level Card and Stats Grid side-by-side using `lg:grid lg:grid-cols-2 lg:gap-6` so the dashboard feels fuller on desktop.

3. **Quick Actions grid**: Change from `grid-cols-2` to `grid-cols-2 md:grid-cols-4` so all 4 actions show in one row on desktop. Increase padding on `md:` for the action cards (`md:p-6`).

4. **Greeting section**: Bump desktop heading to `lg:text-4xl` and add `md:text-base` for the subtitle.

5. **Level Card**: Add `md:p-6` for more breathing room on desktop. Make the progress bar `md:h-3` on desktop.

6. **Stats cards**: Add `md:p-6` and `md:text-2xl` for stat values on desktop for better readability.

7. **CTA section**: On desktop, use a horizontal layout with text left and button right via `md:flex md:items-center md:justify-between md:text-left`. Increase padding to `md:p-8`.

8. **Overall spacing**: Change `space-y-6` to `space-y-6 md:space-y-8` for more desktop breathing room. Add `py-6 md:py-10` for vertical padding.

### Summary
Single file change (`src/pages/Index.tsx`) — purely Tailwind class adjustments for a polished responsive dashboard that looks great on both mobile and large desktop screens.

