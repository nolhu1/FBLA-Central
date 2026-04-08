# News Screen Redesign

## Why the old screen felt wrong

- It treated News like a flat announcement list instead of a priority-driven member feed.
- The top of the screen spent too much space on generic copy and too little on scope, urgency, and relevance.
- Pinned content existed, but it was not strong enough to anchor the experience.
- Feed rows lacked clear scope, read state, saved state, and connected-action cues.
- Detail did not feel like the intentional destination for the full announcement payload.

## What changed

- Rebuilt News around a compact mobile hierarchy: restrained header, scope switcher, type chips, priority spotlight, and concise feed.
- Added a news domain service to rank items by urgency, pinned state, scope relevance, recency, and saved-event context.
- Added read and saved news state support to the repository and RTK Query API for both demo and Firebase-backed flows.
- Split the UI into reusable news-specific components for badges, feed cards, spotlight treatment, detail header, empty state, and loading skeletons.
- Moved the full reading experience into detail, including metadata, save/share actions, AI entry, and linked event/resource/discussion actions.

## Product behavior now

- Chapter, state, and national views are clearly separated.
- Urgent and pinned items rise to the top without making the whole screen visually loud.
- Feed items stay short and scannable.
- Opening an announcement marks it read.
- Announcements can be saved and surfaced again through the saved filter.
- Related event, resource, and discussion actions stay attached to the detail screen where they belong.

## Design principles used

- One strong priority surface, not many competing modules.
- Compact metadata and badges so the user can scan quickly.
- Clear distinction between preview and full content.
- Official tone, not social and not editorial.
- Strong personalization through scope-aware filtering and ranking.
