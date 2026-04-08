# UI Motion Polish

This pass adds a lightweight shared motion system so the app feels more responsive, cohesive, and production-ready without changing its core architecture.

## Motion system decisions

- Default screen transitions use a subtle `fade_from_bottom` push transition in the root stack.
- Shared entrance motion uses fast fade-plus-lift animation through `AnimatedEntrance`.
- Press feedback uses a restrained scale-down pattern around `0.98` rather than heavy bounce.
- Reduced-motion support is respected through the session user accessibility preference.
- Motion durations are standardized in shared tokens instead of being hard-coded ad hoc.

## Key motion patterns

- Screen content:
  - Small fade/translate entrance on load through `AppScreen` content wrapping.
- Cards and tappable surfaces:
  - Shared card/list components use spring press feedback for a more responsive touch feel.
- Tabs and segmented controls:
  - Layout transitions are smoothed with `LayoutAnimation`.
  - Tabbed content panes use `AnimatedSwitcher` for quick crossfade/lift transitions.
- Loading states:
  - Replaced flat placeholder blocks with shimmer skeletons via `ShimmerBlock`.
- AI chat:
  - Typing indicators now animate, reinforcing streamed assistant behavior.
- Save actions:
  - Save buttons use subtle icon-scale feedback so state changes feel more alive.

## Future consistency guidelines

- Prefer shared motion primitives over one-off animations.
- Keep most interactions within fast or medium durations.
- Use motion to reinforce hierarchy, state change, or responsiveness, not decoration.
- Respect reduced motion for any new animated component.
- Avoid large delays and long staggers that slow perceived performance.
