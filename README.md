# PulseCup

A mobile-first World Cup companion app powered by TxLINE.
Fans react to goals, cards, and corners in real-time, answer quick live challenges,
build streaks with escalating moods, and generate shareable recap cards after each match.

Built with Next.js 16, TypeScript, Tailwind CSS v4, Supabase, and TxLINE sports data.

## Features

- **Live Room** — Real-time match events streamed from TxLINE, reaction prompts, live challenges, streak tracking
- **Replay Mode** — Replay full matches event-by-event with adjustable speed (2x–16x), reactions, challenges, and recap generation
- **Challenge Engine** — Three challenge types (NEXT_GOAL, TOTAL_GOALS_REACH_3, NEXT_MAJOR_EVENT) resolved from real events
- **Streak System** — 5-tier mood ladder (Casual Fan → Getting Warm → Sharp Eye → Chaos Merchant → Legend)
- **Recap Cards** — Auto-generated shareable cards with stats, mood, and match summary
- **Guest Mode** — No sign-up required (localStorage guest ID), Solana wallet optional

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Data Source | TxLINE (txline-dev.txodds.com) |
| Database | Supabase (profiles, reactions, challenges, streaks, recaps) |
| Icons | react-icons (Ionicons 5) |
| Font | Sora (next/font) |
| Auth | Guest mode (localStorage) + optional Solana wallet |

## Getting Started

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
TXLINE_BASE_URL=https://txline-dev.txodds.com
TXLINE_JWT=your_jwt
TXLINE_API_TOKEN=your_token
SUPABASE_SERVICE_ROLE_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Run the dev server:

```bash
npm run dev
```

Open **http://localhost:3000**.

## Testing the full flow

The demo fixture is **18222446** (Argentina vs Switzerland, 42 events).

1. Visit `/app/replay/18222446` and click Play
2. React to moments, answer challenges, watch streaks grow
3. At the end, a recap card is generated and saved
4. Visit `/app/profile` to see your recap cards
5. Share a card from `/app/share/[cardId]`

## Project Structure

```
src/
├── app/
│   ├── api/             # API routes (TxLINE proxy + Supabase CRUD)
│   ├── app/
│   │   ├── matches/     # Match hub + live room
│   │   ├── profile/     # User recap cards
│   │   ├── replay/      # Replay mode
│   │   └── share/       # Shareable recap cards
│   └── page.tsx         # Landing page
├── components/
│   ├── live/            # ReactionPanel, ChallengeCard, EventFeed, StreakBar
│   ├── AppBottomNav.tsx # Bottom navigation
│   └── Logo.tsx         # PulseCup logo
└── lib/
    ├── pulse/           # Engine: moment, challenge, streak, recap
    ├── txline/          # TxLINE event normalizer
    ├── supabase/        # Database client + schema
    └── guest.ts         # Guest profile ID
```

## TxLINE Integration

PulseCup uses the `Action` field (not `GameState`) for event detection.
See `src/lib/txline/normalize-event.ts` for the action-to-event-type mapping.
TxLINE dev only has 1 rich fixture (18222446) — snapshot endpoint returns 42 events.
