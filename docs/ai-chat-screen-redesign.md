# AI Chat Screen Redesign

This redesign replaces the old prompt-and-response card layout with a true in-app assistant experience built for FBLA Central.

## What changed

- Rebuilt the AI screen as a mobile-native chat surface with a compact header, transcript area, quick prompts, and a balanced composer.
- Added context-aware entry so AI can infer and display event, resource, study, forum, or news context from a passed `contextId`.
- Replaced static response cards with a real local transcript made of distinct user and assistant message bubbles.
- Added simulated assistant streaming so responses reveal progressively instead of appearing all at once.
- Added compact source reference cards that can deep-link back into the relevant event, resource, study, news, or discussion screen.
- Added polished empty, typing, and failure states so the screen still feels intentional before and during a conversation.
- Updated existing News and Study entry points to pass context into the AI screen.

## Product outcome

The AI assistant now feels like a first-party FBLA Central support layer rather than a generic chatbot demo. It is visually cleaner, more grounded in app content, and better suited for helping members move from a question to a useful next step inside the app.
