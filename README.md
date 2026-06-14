# Roo_mue

Roo_mue is a Next.js prototype for translating Thai Sign Language into Thai text. The app includes camera-based sign recognition, preset emergency phrases, daily-life sign references, translation history, authentication, and a basic call-room flow.

## What This Project Does

- Lets users sign in or register with email credentials.
- Opens a guided app flow for emergency or everyday communication.
- Uses the camera to detect signs, compose sentence suggestions, play speech output, and save translation sessions.
- Stores users and translation history with Prisma and SQLite for local development.
- Includes a TensorFlow.js model bundle in `public/models/thsl`.
- Supports Thai and English UI text through `next-intl`.

## Technology Framework

The stack is organized into the layers below.

### Application Framework
| Technology | Version | Role |
| --- | --- | --- |
| Next.js (App Router) | 14.2 | Full-stack React framework — routing, server actions, API routes |
| React / React DOM | 18.3 | UI rendering |
| TypeScript | 5.6 | Static typing across the codebase |

### UI & Styling
| Technology | Role |
| --- | --- |
| Tailwind CSS | Utility-first styling |
| `tailwindcss-animate`, `tailwind-merge`, `clsx`, `class-variance-authority` | Animation, class composition, variant management |
| next-themes | Light / dark mode |
| lucide-react | Icon set |
| PostCSS + Autoprefixer | CSS pipeline |

### Authentication & Data
| Technology | Role |
| --- | --- |
| NextAuth (`@next-auth/prisma-adapter`) | Authentication, optional Google OAuth, sessions |
| Prisma (`@prisma/client`) | ORM and schema management |
| SQLite (dev) / PostgreSQL (prod) | Database |
| `bcryptjs` | Password hashing |
| Custom OTP + rate limiting (`lib/otp.ts`, `lib/rate-limit.ts`) | Email verification, password reset, abuse protection |

### Sign Recognition & ML (browser)
| Technology | Role |
| --- | --- |
| @mediapipe/holistic | Full-body / hand / face landmark tracking |
| @mediapipe/tasks-vision | Vision task inference |
| @tensorflow/tfjs | In-browser model inference (`lib/translation/tfjs-client.ts`); model bundle in `public/models/thsl` |

### Real-Time Communication
| Technology | Role |
| --- | --- |
| WebRTC | Peer-to-peer call rooms (`lib/call/use-webrtc.ts`) |
| Server-Sent Events | Call signaling channel (`app/api/call/[room]/`) |
| Web Speech API | Speech recognition & text-to-speech (`lib/tts.ts`, `lib/call/use-speech-recognition.ts`) |

### Internationalization
| Technology | Role |
| --- | --- |
| next-intl | Thai / English UI and locale handling (`messages/`) |

### Tooling
| Technology | Role |
| --- | --- |
| pnpm | Package manager |
| ESLint (`eslint-config-next`) | Linting |
| `tsc` | Type checking |

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
