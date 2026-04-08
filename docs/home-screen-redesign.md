# Home Screen Redesign

## Purpose

Home is the command center for an FBLA high school member. It should answer three questions immediately:

1. What matters most right now?
2. What should I do next?
3. What else deserves a quick check before I leave this screen?

## Information Hierarchy

### 1. Custom header
- Personalized greeting
- Smart context line based on chapter/state and current priority count
- Profile entry point
- Notifications/news shortcut
- AI shortcut

This keeps the screen feeling personal and connected before any content cards appear.

### 2. Hero priority
- A single hero card surfaces the most important current item
- Priority order:
  1. urgent or pinned announcement
  2. saved or upcoming competitive deadline/event
  3. active study continuation
  4. fallback recommendation

The hero adapts copy, metadata, and action buttons to the selected item state.

### 3. Quick actions
- Four premium shortcuts:
  - My Schedule
  - Study
  - Resources
  - Ask AI

These are action-first and intentionally compact.

### 4. Command-center support modules
- Study Focus
- A restrained FBLA Social box
- A single “Need a second opinion?” or momentum insight box

Home intentionally does not repeat itemized event, resource, or announcement lists that already exist on their dedicated screens.

### 5. Footer signal
- A tiny saved-items footer closes the screen with a lightweight readiness signal

## Why These Modules Exist

- Header: establishes identity and makes high-value utilities instantly reachable
- Hero: gives the screen one unmistakable focal point
- Quick actions: reduces friction for the most common tasks
- Support modules: reinforce progress and ecosystem awareness without duplicating full destination content
- Momentum card: reinforces that the app understands the member’s context

## Reusable Components Added or Changed

- `HomeHeader`: premium personalized header with compact action icons
- `HeroPriorityCard`: adaptive hero for event, announcement, study, and fallback states
- `QuickActionButton`: premium shortcut tile
- `HomeSection`: section header with “See all”
- `HomePreviewCard`: shared compact preview shell
- `MomentumCard`: intelligent bottom recommendation / momentum block
- `AppScreen`: now supports hiding the default header so Home can own its composition

## Content Prioritization Notes

- Home uses repository-backed data from the user profile, home bundle, events, news, resources, study tracks, community threads, and social highlights
- The hero is selected by a presentation helper instead of the render tree
- Item-heavy previews for events, announcements, and resources were removed from Home so the screen can remain one-view command center rather than duplicating other screens
- Empty states always convert into a next-step prompt rather than blank space
