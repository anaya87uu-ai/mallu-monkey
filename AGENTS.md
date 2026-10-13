# Project conventions
- Keep appearance roles in global HSL semantic tokens and consume them through shared design-system controls; this keeps every page consistent as the palette evolves.
- Import bundled visual assets from `src/assets` rather than remote image URLs for primary page imagery; this makes page visuals reliable in preview and production.
- Keep presentation-only redesigns separate from authentication, WebRTC, moderation, and scoring behavior; visual work must not alter existing rules.