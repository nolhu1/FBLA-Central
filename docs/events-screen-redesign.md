# Events Screen Redesign

## Why The Old Screen Felt Wrong

The previous Events surface behaved like a filtered feed instead of a planning tool:

- no first-class calendar view
- no personal schedule state visible in the main experience
- weak distinction between deadlines, meetings, conferences, and saved items
- generic list cards carrying too much of the experience
- event detail lacked a strong planning workflow around reminders, notes, and related prep

## New Information Architecture

The redesigned Events area is organized around three focused modes:

- `Calendar`: monthly grid with event indicators, selected-day preview, and quick entry to detail
- `Agenda`: compact date-grouped list for efficient scanning
- `Saved`: personal schedule view for pinned events and reminder management

The top-level screen now stays intentionally compact:

- small native-feeling header
- primary view switcher
- compact month/category/scope filters
- one active planning surface at a time

## Key UX Decisions

- Calendar is first-class and never hidden behind secondary navigation.
- Event details stay out of the month grid; the grid shows presence and priority, while rich content lives below or in detail.
- Agenda cards are compact and high-signal, showing only title, timing, type, scope, location, urgency, and saved/reminder cues.
- Saved state and reminder state are visible across the main screen and detail screen.
- Detail is the connected workspace for logistics, reminders, private notes, resources, study help, announcements, discussion, and AI entry.

## Component Structure

New reusable event-specific components live in `src/components/events/`:

- `EventsHeader`
- `EventViewSwitcher`
- `EventFilterBar`
- `CalendarMonthView`
- `CalendarDayEventList`
- `AgendaSection`
- `CompactEventCard`
- `EventScopeBadge`
- `EventTypeChip`
- `EventReminderControl`
- `SaveEventButton`
- `EventDetailHeader`
- `RelatedEventContentSection`

## Data And State Changes

To support the planning workflow honestly, the repository/API layer now exposes event saves:

- `getEventSaves()`
- `updateEventSave()`

This lets the UI reflect:

- saved events
- unsave flows
- reminder state
- personal notes

Both demo and production repository paths were updated so the Events feature stays aligned with runtime mode abstraction.

## Demo Mode Improvements

The demo dataset now includes a fuller April event mix across chapter, subdivision, state, and national scope, plus multiple saved items. This gives the calendar and agenda views enough density to feel like a real member planning experience.
