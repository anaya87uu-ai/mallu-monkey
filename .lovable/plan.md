

## Improve Chat Page

### Current Issues
- Both videos take equal space (50/50 split) — stranger video should be dominant
- Local video is full-sized instead of a small picture-in-picture overlay
- Controls bar is plain with no visual hierarchy
- Chat panel has no real messaging functionality (just placeholder text)
- No connection status indicator or elapsed time
- No entrance animation or polish
- Mobile layout wastes space with equal video splits

### Plan

**File: `src/pages/Chat.tsx`** — Major layout and UX overhaul:

1. **Picture-in-Picture local video**: Change local video from a 50% panel to a small draggable-looking overlay (absolute positioned, bottom-right corner of the stranger video area). Size: `w-28 h-36 md:w-40 md:h-52` with rounded corners and a border glow. Stranger video becomes the full video area.

2. **Connection status bar**: Add a thin bar above the controls showing connection state — a green dot with "Connected" text when matched, elapsed time counter (mm:ss), and stranger info (name + flag) inline.

3. **Improved controls bar**: Redesign with a frosted glass pill shape, centered with subtle shadow. Add tooltips on hover for each button. Group buttons logically: left (mic, chat), center (find/skip), right (report, end).

4. **Chat panel improvements**: Add message state management (array of `{text, sender, time}`), send on Enter key, auto-scroll to bottom, show timestamps, differentiate sent vs received messages with different bubble colors (primary for you, muted for stranger). Still local-only since there's no data channel yet, but the UI will be ready.

5. **Idle state enhancement**: When not connected, show a more engaging landing with animated gradient background, larger CTA button, and a subtitle like "Meet someone new — video chat with random strangers".

6. **Entrance animations**: Wrap the video area and controls in `motion.div` with staggered fade-in on mount.

7. **Mobile optimization**: On mobile, make stranger video take ~70% height and local PiP overlay smaller (`w-24 h-32`). Controls bar uses compact spacing. Chat panel slides up from bottom as a sheet-like overlay.

### Technical Details
- Single file change: `src/pages/Chat.tsx`
- Add `useState` for elapsed time with a `setInterval` effect when connected
- Message state: `useState<{text: string, from: 'you'|'stranger', time: Date}[]>([])`
- All existing hooks and logic remain unchanged
- Only layout/UI restructuring

