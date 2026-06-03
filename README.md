# Roo_mue

Roo_mue is a Next.js prototype for translating Thai Sign Language into Thai text. The app includes camera-based sign recognition, preset emergency phrases, daily-life sign references, translation history, authentication, and a basic call-room flow.

## What This Project Does

- Lets users sign in or register with email credentials.
- Opens a guided app flow for emergency or everyday communication.
- Uses the camera to detect signs, compose sentence suggestions, play speech output, and save translation sessions.
- Stores users and translation history with Prisma and SQLite for local development.
- Includes a TensorFlow.js model bundle in `public/models/thsl`.
- Supports Thai and English UI text through `next-intl`.

## Tech Stack

- Next.js 14 App Router
- React 18 and TypeScript
- Tailwind CSS
- NextAuth with Prisma Adapter
- Prisma with SQLite
- TensorFlow.js and MediaPipe for client-side sign recognition
- next-intl for localization

## Important Folders

- `app/` - Next.js routes, layouts, API routes, and server actions.
- `components/` - UI, auth, landing, and app-specific components.
- `lib/` - auth, database, translation, call, TTS, and utility logic.
- `messages/` - Thai and English translation files.
- `prisma/` - Prisma schema and local SQLite database.
- `public/models/thsl/` - TFJS model files and labels.
- `scripts/` - model training/conversion helpers.

## Local Setup

```bash
pnpm install
pnpm run db:generate
pnpm run dev
```

The development server starts at `http://localhost:3000` by default.

## Quality Checks

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

## Environment

Copy `.env.example` to `.env` and set the values needed for your environment. For local development, the project is configured to use SQLite through `DATABASE_URL`.

Google sign-in is optional. It is enabled only when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are present.

## Current Prototype Notes

- The Prisma schema is set up for SQLite locally. For production, switch the datasource provider to PostgreSQL and update `DATABASE_URL`.
- Email OTP generation is implemented, but real email delivery still needs a provider integration.
- The active translation entry point is in `lib/translation/index.ts`; camera recognition uses the TFJS/MediaPipe client pipeline.
