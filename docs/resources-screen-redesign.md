# Resources Screen Redesign

## Why the old experience felt weak

- The main screen behaved like a searchable list instead of a curated library.
- Category browsing and saved-state cues were too shallow.
- Resource detail was mostly metadata blocks without a strong action hierarchy.
- PDF resources did not have a dedicated in-app viewing path.

## What changed

- Rebuilt Resources as a premium browse-and-search library with:
  - polished header
  - premium search bar
  - horizontal category browsing
  - lightweight filter chips
  - featured resource treatment
  - compact, scannable resource cards
- Added saved-resource state querying so the screen can show real bookmark behavior.
- Reworked detail into a clearer hierarchy with save/share, open/view actions, related resources, and linked study/news/event context.
- Added a dedicated in-app PDF viewer screen using a styled in-app web view container instead of defaulting straight to an external browser.

## Architecture changes

- Added `getResourceState()` to the repository contract and RTK Query API.
- Wired resource state through both demo and Firebase repository implementations.
- Included resource state in local Firebase fallback dataset assembly.
- Added a resources domain service to normalize categories, filters, featured logic, and browse records.

## Product result

- The feature now feels like a mobile-native resource library instead of a document dump.
- Users can search quickly, browse by category, save resources, and open PDFs inside the app flow.
- The first viewport is more curated and visually structured, while detail screens carry the richer context.
