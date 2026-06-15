## Plan

Show the global mobile bottom nav (Home, Chat, Games, Ranks, Me) on the chat page while keeping the existing floating control dock.

### Changes

1. **`src/components/layout/BottomNav.tsx`** — Remove the `isChat` hide rule so the nav renders on `/chat` too.

2. **`src/pages/Chat.tsx`** — Reserve space so the floating dock and content sit above the bottom nav on mobile:
   - Reduce the chat container height by the nav height on mobile (~80px incl. safe-area).
   - Bump the controls section's bottom padding on mobile so the floating dock clears the bottom nav.

No changes to desktop layout, WebRTC, or business logic.