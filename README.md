# FBLA Central

FBLA Central is a greenfield Expo + React Native implementation of the app described in:

- `/Users/nolanhuang/Downloads/fbla central product specs .pdf`
- `/Users/nolanhuang/Downloads/fbla central tech architecture.pdf`

The codebase follows the architecture paper directly:

- React Native + TypeScript + Expo
- React Navigation with a root stack and bottom tabs
- Redux Toolkit + RTK Query
- Repository-based data layer
- Dual-mode runtime:
  - `demo` mode uses editable preset data and no backend dependency
  - `production` mode uses Firebase Auth, Firestore, Cloud Functions, and production-ready service wiring

## Mode Switch

Set the app mode with one boolean-like env value:

```bash
EXPO_PUBLIC_APP_MODE=demo
```

or

```bash
EXPO_PUBLIC_APP_MODE=production
```

If the value is anything other than `production`, the app runs in demo mode.

## Demo Mode

Demo mode is fully self-contained:

- seeded member, organization, event, resource, news, social, study, and forum data
- local persistence through AsyncStorage
- demo AI responses grounded in the seeded app objects
- onboarding flow still works and writes locally

The easiest file to edit is:

- `src/features/demo/demoData.ts`

That file is designed to be the single place where you can add or change:

- organizations
- user defaults
- events
- resources
- news posts
- social channels and highlights
- study tracks and units
- forum threads and replies

## Production Mode

Production mode expects Firebase config in `.env`:

```bash
EXPO_PUBLIC_APP_MODE=production
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

Backend code lives in:

- `firebase/functions/src/index.ts`

Implemented callable backend flows:

- `getRecommendations`
- `saveEventAndGeneratePrep`
- `createForumReply`
- `createForumThread`
- `submitForumReport`
- `askAIAssistant`

Production AI uses:

- `OPENAI_API_KEY` as a Firebase Functions secret
- optional `OPENAI_MODEL` environment variable, defaulting to `gpt-5`

## Structure

Key app areas:

- `src/app`
- `src/navigation`
- `src/screens`
- `src/components`
- `src/domain`
- `src/data`
- `src/store`
- `src/theme`

## Run

After installing dependencies:

```bash
npm install
npm run start
```

For Firebase functions:

```bash
cd firebase/functions
npm install
npm run build
```

## Notes

- Demo mode is the safest presentation mode because it has no external service dependency.
- Production mode is fully wired in code, but it still needs your real Firebase and OpenAI credentials before it can be deployed and used live.
- Firestore security rules are included in `firestore.rules`.
