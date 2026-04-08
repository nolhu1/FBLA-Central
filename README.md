# FBLA Central

FBLA Central is an Expo + React Native mobile app for helping FBLA members stay on top of events, resources, study plans, announcements, community discussions, and AI-assisted prep workflows.

The project is organized for production use with Firebase Auth, Firestore, Cloud Functions, and a mobile-first feature set spanning planning, learning, discovery, and collaboration.

## Overview

FBLA Central brings several member-facing surfaces into one app:

- authentication and onboarding
- a personalized home dashboard
- event discovery, saves, reminders, and prep context
- resources with detail pages and PDF viewing
- official and contextual news
- social channel discovery
- study tracks, flashcards, and quiz practice
- community threads and replies
- AI assistance grounded in app context
- profile and preference management
- cross-feature search

## Tech Stack

- Expo 53
- React Native 0.79
- React 19
- TypeScript
- React Navigation
- Redux Toolkit + RTK Query
- Firebase Auth
- Cloud Firestore
- Firebase Cloud Functions v2
- OpenAI Responses API for the production AI assistant

## Architecture

The app follows a layered structure rather than placing data access directly inside screens:

- `src/screens` contains route-level UI.
- `src/components` contains reusable feature UI.
- `src/domain` contains shared types and service logic.
- `src/data` contains Firebase integration, repository contracts, storage helpers, and schemas.
- `src/store` contains Redux state and RTK Query endpoints.

The repository layer keeps feature screens decoupled from backend access so the UI, state management, and infrastructure concerns stay separated cleanly.

## Key Product Areas

- Home: priorities, recommendations, saved-item momentum, and quick actions.
- Events: calendars, details, saves, notes, reminders, and related prep.
- Resources: curated materials, filters, detail views, and document viewing.
- News: pinned updates, scoped announcements, save/read state, and related content.
- Study: tracks, units, progress, quizzes, flashcards, and readiness cues.
- Community: categories, thread lists, replies, and reporting flows.
- AI: contextual assistant responses with app-aware source references.
- Profile: onboarding, member interests, goals, settings, and notification preferences.

## Repository Layout

For the full production-facing tree, see [docs/folder-structure.md](/Users/nolanhuang/FBLA/docs/folder-structure.md).

At a high level:

```text
.
├── App.tsx
├── app.json
├── eas.json
├── firebase.json
├── firestore.rules
├── src/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── data/
│   ├── domain/
│   ├── motion/
│   ├── navigation/
│   ├── screens/
│   ├── store/
│   ├── theme/
│   └── utils/
├── firebase/
│   └── functions/
├── docs/
├── generated/
└── scripts/
```

## Prerequisites

Recommended local toolchain:

- Node.js 20 or newer
- npm
- Xcode for iOS simulator work
- Android Studio for Android emulator work
- Firebase CLI for Functions and Firestore deployment
- EAS CLI if you plan to produce internal or store builds

Node 20 is the safest baseline because the Firebase Functions project is pinned to Node 20.

## Getting Started

### 1. Install dependencies

At the project root:

```bash
npm install
```

For Firebase Functions:

```bash
cd firebase/functions
npm install
cd ../..
```

### 2. Create a local environment file

Copy `.env.example` to `.env` and set the production app and Firebase values:

```bash
EXPO_PUBLIC_APP_MODE=production
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

The current Firebase config guard expects all listed `EXPO_PUBLIC_FIREBASE_*` values to be present.

### 3. Start the app

```bash
npm run start
```

Other useful entry points:

```bash
npm run ios
npm run android
npm run web
```

## Firebase Backend

The Functions project lives in `firebase/functions`.

Callable functions currently implemented:

- `getRecommendations`
- `saveEventAndGeneratePrep`
- `createForumReply`
- `createForumThread`
- `submitForumReport`
- `askAIAssistant`

### Firebase setup checklist

1. Create or select a Firebase project.
2. Enable Email/Password authentication.
3. Create a Firestore database.
4. Add the web app config values to `.env`.
5. Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

6. Install the OpenAI secret for Functions:

```bash
firebase functions:secrets:set OPENAI_API_KEY
```

7. Build and deploy Functions:

```bash
cd firebase/functions
npm run build
npm run deploy
```

The Functions code defaults to model `gpt-5` if `OPENAI_MODEL` is not set in the Functions runtime environment.

## Firestore Shape

The production repository and Functions code expect a Firestore model centered around these collections:

- `users`
- `organizations`
- `events`
- `resources`
- `news_posts`
- `social_channels`
- `social_highlights`
- `study_tracks`
- `study_units`
- `forum_categories`
- `forum_threads`
- `forum_replies`
- `quiz_attempts`
- `forum_reports`
- `ai_conversations`

It also uses per-user subcollections such as:

- `event_saves`
- `resource_state`
- `news_state`
- `study_progress`

If you are standing up a fresh production environment, you will need to populate these collections with real data that matches the app's expected shape.

## Available Scripts

App scripts at the repository root:

- `npm run start` - start the Expo development server
- `npm run ios` - run the native iOS app locally
- `npm run android` - run the native Android app locally
- `npm run web` - run the Expo web target
- `npm run lint` - run the Expo lint configuration

Functions scripts in `firebase/functions`:

- `npm run build` - compile TypeScript to `lib/`
- `npm run serve` - start the Firebase Functions emulator
- `npm run deploy` - deploy Functions to Firebase

## Build and Release

`eas.json` defines three EAS build profiles:

- `development`
- `preview`
- `production`

Examples:

```bash
eas build --platform ios --profile preview
eas build --platform android --profile production
```

The Expo project is already linked to an EAS project in `app.json`.

## Quality Gates and Current Gaps

Current repo-level quality checks:

- ESLint is configured and available through `npm run lint`.
- Firestore security rules live in `firestore.rules`.

Current gaps to be aware of:

- There is no automated test suite configured yet.
- Production deployment depends on real Firebase data being present.
- Additional launch hardening is still needed around testing, analytics, moderation, and operational rollout.

## Supporting Docs and Artifacts

Helpful project artifacts already in the repository:

- `docs/` for feature redesign and implementation notes
- `fbla_central_data_model_snapshot.svg`
- `fbla_central_data_model_snapshot.png`
- `fbla_central_technical_architecture.png`
- `generated/user_journey_flowchart.svg`
- `scripts/` for regenerating architecture and data model visuals

## Security Notes

- Do not commit `.env` or production credentials.
- Keep `OPENAI_API_KEY` in Firebase Functions secrets, not in the client app.
- Review and tighten `firestore.rules` before production launch.

## Status

The app is beyond a static prototype: the navigation, feature surfaces, repository abstraction, Firebase integration, and Cloud Functions layer are all in place. The remaining work is primarily operational and launch-focused: production data, deployment configuration, testing, analytics, moderation workflows, and release readiness.

## Resources / links
FBLA Central source code: https://github.com/nolhu1/FBLA-Central
React Native: https://reactnative.dev/docs/getting-started
Expo: https://docs.expo.dev
TypeScript: https://www.typescriptlang.org/docs/
Redux Toolkit: https://redux-toolkit.js.org/introduction/getting-started
RTK Query: https://redux-toolkit.js.org/rtk-query/overview
Firebase: https://firebase.google.com/docs
OpenAI Responses API: https://developers.openai.com/api/reference/responses/overview


