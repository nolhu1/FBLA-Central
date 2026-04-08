# Mobile Layout Refactor

## Goal

Refactor the app from stacked, webpage-like screens into focused mobile-native flows with concise previews, stronger hierarchy, and richer detail screens.

## Audit Summary

### Home
- Current issue: stacked dashboard with full sections for priorities, study, explore, and momentum.
- Keep on main screen: top priority, next action, compact quick actions, small previews into the rest of the app.
- Move or collapse: full lists of priorities, study details, announcements, and community content.
- Refactor: keep Home as a command center with one dominant priority module and preview-only modules that route out.

### Events
- Current issue: large vertical list of expanded cards and filtering mixed into the same long screen.
- Keep on main screen: compact browsing modes, event list summaries, deadline visibility.
- Move or collapse: long descriptions, linked resources, study, related discussion.
- Refactor: segmented browsing on the list screen and richer linked context inside Event Detail.

### Resources
- Current issue: a long document directory where every card carries too much content.
- Keep on main screen: search/filter/category browsing, small previews, saved and recent access.
- Move or collapse: full summary, source details, notes, related items.
- Refactor: browse-first resource library with a dedicated Resource Detail screen.

### News
- Current issue: feed cards expose too much body text and feel repetitive.
- Keep on main screen: pinned post, urgency filter, concise feed cards.
- Move or collapse: full article body, linked actions, deeper metadata.
- Refactor: feed becomes scan-first, detail becomes read-first.

### Study
- Current issue: every study track is presented at the same weight on one long screen.
- Keep on main screen: continue studying, weak areas, recommended next track, concise track previews.
- Move or collapse: full track descriptions, units, linked resources, and deeper study context.
- Refactor: study landing becomes a launcher into dedicated track detail.

### Community
- Current issue: full thread bodies in list view and too much prose density.
- Keep on main screen: category-aware thread summaries, activity metadata, concise previews.
- Move or collapse: long thread body, secondary links, posting UI noise.
- Refactor: thread list becomes compact and category-driven, thread detail focuses on reading and replying.

### Profile
- Current issue: profile acts like a long account/settings page.
- Keep on main screen: member summary, a few key stats, segmented overview.
- Move or collapse: detailed preferences and fine-grained controls.
- Refactor: profile overview with dedicated preferences screen.

### AI
- Current issue: informational framing competes with the actual interaction.
- Keep on main screen: prompt input, suggestions, recent/source-backed response context.
- Move or collapse: secondary explanation copy.
- Refactor: conversation-first layout with compact prompt suggestions and cleaner source handling.

### Social Hub
- Current issue: channels and highlights are stacked as two long sections.
- Keep on main screen: top channels and key highlights.
- Move or collapse: alternate mode content behind segments.
- Refactor: segmented social screen with concise cards.

## Implementation Plan

1. Add shared mobile-native primitives for segmented controls and compact pressable list cards.
2. Keep Home concise and preview-oriented.
3. Add detail routes for resources, news, study tracks, and preferences.
4. Convert list screens to preview-first composition with "See all" and segmented browsing.
5. Keep detail screens richer, but structured into compact modules rather than long text dumps.
6. Reduce filler copy and make subheaders more action-oriented.
