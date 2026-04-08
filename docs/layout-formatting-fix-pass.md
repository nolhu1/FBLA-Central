# Layout Formatting Fix Pass

## Systemic Fixes

- Tightened the shared spacing scale in `src/theme/index.ts` so compact phone layouts stop feeling oversized and crowded at the same time.
- Added consistent line heights to the main typography tokens to reduce clipped text, awkward button height growth, and uneven vertical rhythm.
- Improved `AppScreen` in `src/components/common/AppScreen.tsx`:
  - reduced default horizontal and section spacing
  - increased scroll-screen bottom padding
  - enabled `keyboardShouldPersistTaps="handled"`
  - made scroll content use `flexGrow: 1`
- Reduced padding in shared card primitives:
  - `src/components/cards/GlassCard.tsx`
  - `src/components/cards/ListItemCard.tsx`
- Standardized compact interactive control sizing:
  - `src/components/common/SegmentedControl.tsx`
  - `src/components/common/Pill.tsx`
  - `src/components/forms/TextField.tsx`
  - `src/components/common/SectionHeader.tsx`

## Common Issues Found

- Reusable cards and controls were using padding and minimum heights that were too large for compact phones.
- Several screen containers were missing `minHeight: 0`, which caused nested flex children to fight for space and clip or overlap.
- A number of screens were using fixed non-scrolling compositions with cards that were too tall, especially where stacked preview cards appeared.
- Some action rows did not wrap cleanly under realistic text lengths.
- AI, social, and home had especially dense vertical compositions that needed compression and containment fixes.

## Major Components Updated

- `src/components/common/AppScreen.tsx`
- `src/components/cards/GlassCard.tsx`
- `src/components/cards/ListItemCard.tsx`
- `src/components/common/SegmentedControl.tsx`
- `src/components/common/Pill.tsx`
- `src/components/forms/TextField.tsx`
- `src/components/home/QuickActionButton.tsx`
- `src/components/home/MomentumCard.tsx`
- `src/components/home/HomePreviewCard.tsx`
- `src/components/ai/AiComposer.tsx`
- `src/components/ai/AssistantMessageBubble.tsx`
- `src/components/ai/AiQuickActionChipRow.tsx`
- `src/components/social/FeaturedSocialCard.tsx`

## Screens With Special Handling

- Home:
  - reduced hero height
  - removed bottom-card overlap risk
  - made quick actions and stacked preview cards fit more cleanly

- AI:
  - tightened transcript shell and composer sizing
  - reduced bubble/composer growth on smaller screens

- Social Hub:
  - reduced oversized featured preview heights
  - tightened vertical rhythm and bottom spacing

- Study:
  - improved top-to-content balance
  - reduced tab-pane padding to preserve room for dense metrics/content

- Community:
  - improved nested scroll containment and category/filter behavior

- Events / Resources / News:
  - added compact-screen containment improvements with `minHeight: 0`
  - reduced excessive bottom padding and empty-state bulk

- Onboarding:
  - removed the overly restrictive body-height cap
  - let the main step panel use available vertical space more naturally

- Profile / Resource Detail / Sign In / Create Thread:
  - cleaned up action sizing, wrapping, and compact-screen width behavior

## Validation Notes

- Layout work was verified through code-level containment and spacing review across shared primitives and high-traffic screens.
- `npx tsc --noEmit` still reports pre-existing unrelated errors in:
  - `firebase/functions/src/index.ts`
  - `src/data/api/firebase.ts`
  - `src/data/repositories/firebaseRepository.ts`
  - `src/domain/services/memberProfile.ts`

## Next Best Follow-Up

- Run a visual device pass in Expo on a Samsung S23-sized emulator or preview target and tune any final one-line truncation edge cases in the densest cards:
  - study metrics
  - social spotlight expanded state
  - profile quick links
  - long forum/news titles
