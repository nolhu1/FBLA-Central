# Social Hub Redesign

## Why The Previous Screen Felt Wrong

The old Social Hub was a basic mode switch over generic list cards:

- no clear chapter / state / national structure
- no premium visual identity
- no curated spotlight or sense of live social presence
- no refined outbound behavior for official channels
- no hierarchy between channels and highlights

It read like a link dump instead of a member-facing social access hub.

## New Information Architecture

The redesigned Social Hub is organized around three scope levels:

- `My Chapter`
- `My State`
- `National`

Each scope now has:

- a curated featured spotlight
- compact official channel cards
- a short recent-highlights rail
- graceful empty states when that scope has limited presence

## Key UX Decisions

- Scope switching is first-class and immediately visible.
- Channel access is presented as compact premium cards, not list rows.
- Highlights are preview-only and intentionally limited so the screen feels alive without pretending to be a full feed.
- One featured spotlight is allowed at a time to keep the top of the screen visually strong without becoming banner-heavy.
- External navigation uses native-app attempts when possible and falls back to an in-app browser.

## Components Added

New reusable components live in `src/components/social/`:

- `SocialHubHeader`
- `ScopeSwitcher`
- `SocialPlatformBadge`
- `SocialChannelCard`
- `ShareChannelButton`
- `FeaturedSocialCard`
- `SocialHighlightCard`
- `SocialSectionHeader`
- `EmptySocialState`
- `OpenExternalActionSheet`

## Data And Runtime Integration

The redesign stays on the existing social repository path:

- `useGetSocialHubQuery()`
- `useGetOrganizationsQuery()`
- current session user context for chapter/state scope relevance

`src/domain/services/social.ts` now handles:

- organization-aware scope grouping
- platform icon and accent treatment
- spotlight selection
- native deep-link candidates for supported platforms
- polished empty-state copy

## Demo Mode Improvements

The demo dataset now includes a fuller spread of chapter, state, and national social channels plus multiple highlights. This gives the new scope switcher, spotlight card, and highlights rail enough density to feel like a real product surface on first launch.
