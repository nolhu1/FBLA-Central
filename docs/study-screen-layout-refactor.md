# Study Screen Layout Refactor

## Structural problem addressed

- The previous redesign looked stronger visually, but it still stacked too many modules in one global vertical flow.
- That made the screen feel like a long dashboard webpage instead of a native app destination.
- The first viewport showed too much at once and still implied "scroll to see the real screen."

## Layout fix

- Rebuilt Study around a fixed top region and a contained lower pane.
- The top region now contains only:
  - header
  - compact continue-study hero
  - compact metric strip
  - tab switcher
- All secondary content now lives behind focused tabs instead of stacking on the root screen.

## Tab structure

- `Overview`: curated command-center preview only.
- `Practice`: quick-entry actions for study modes.
- `Progress`: charts and deeper progress visuals.
- `Review`: weak areas, missed topics, and recent review context.

## Scroll behavior

- Removed the giant full-screen study `ScrollView`.
- The root Study screen is now a fixed layout.
- Only the active tab pane may scroll when its content needs it.
- This keeps the first viewport complete and understandable without scrolling.

## Result

- The screen now reads as a native app destination with progressive disclosure.
- Progress visuals remain, but they no longer bloat the root layout.
- The user can immediately see where they are, what to do next, and which mode to enter.
