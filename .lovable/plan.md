# Modern Black & White UI — Entire App

## Direction
Replace the green-and-white appearance with a permanent, modern monochrome design across every page.

- Background: near-black `#090909`.
- Surfaces: charcoal `#191919`, subtle gray borders, minimal shadows.
- Main text and primary buttons: off-white `#FAFAFA`; supporting text uses accessible gray tones.
- Keep Space Grotesk headings and Inter body text. Use clear hierarchy, consistent spacing, and restrained motion.
- No theme toggle, colored decorative gradients, glowing orbs, or washed-out glass panels. Keep semantic warning and error colors only where needed for safety.

## What Will Change

### 1. Shared appearance and navigation
- Replace the global green tokens and glass effects with solid black/charcoal surfaces and monochrome controls.
- Restyle the header, footer, mobile bottom navigation, profile drawer, age gate, dialogs, form fields, and notifications.
- Use white active states, subtle borders, visible keyboard focus, and consistent compact corners.
- Keep the bottom navigation limited to signed-in users and retain Terms and Privacy links.

### 2. Welcome and sign-in
- Redesign the Welcome page with prominent Mallu Monkey branding, a full-width visual introduction, a clear Google sign-in button, and tighter section hierarchy.
- Replace the current gradient mock-call illustration and floating orbs with relevant visual imagery; avoid a split text-and-card introduction.
- Restyle the existing feature, safety, FAQ, and supporting sections as clean, unframed layouts.
- Give Google sign-in and the age confirmation screen the same monochrome styling.

### 3. Home, video chat, games, and leaderboards
- Update Home shortcuts and progress displays to eliminate colored gradient tiles.
- Give video chat neutral black video surfaces, clear feed labels and watermark, monochrome controls, and distinct incoming/outgoing message bubbles.
- Preserve video mirroring and existing camera, microphone, skip, report, and messaging behavior.
- Restyle game boards, player information, timers, results, rewards, and leaderboard rows without changing gameplay, point rules, names, or chat-time data.

### 4. Admin and information pages
- Apply the same design to admin tables, tabs, statistics, settings, report dialogs, and user drawers.
- Update About, Contact, Terms, Privacy, and the not-found screen for consistent typography and surfaces.
- Preserve all existing permissions and actions.

## Technical Approach
- Define HSL semantic color and shadow tokens in `src/index.css` and expose any additional roles in `tailwind.config.ts`.
- Replace page-specific hardcoded colors, colored gradients, and green-specific styling with semantic tokens.
- Reuse the existing design-system controls; keep changes in presentation code and leave authentication, matching, moderation, database, and scoring logic untouched.
- Load the existing fonts without a remote CSS import.

## Validation
- Review representative pages at narrow and wide sizes for text contrast, overflow, navigation clearance, and consistent states.
- Check navigation, drawers, sign-in entry, chat controls, and game/leaderboard views; verify authenticated screens with an available session.
- Check build diagnostics and browser errors before completing the redesign.

## Out of Scope
New features, business-rule changes, backend changes, and publishing.