# Level Up 🚀

> **Every swipe makes you smarter.**

Level Up is a browser-based learning app that takes the same engagement mechanics kids love from reels, shorts, and swipe-based content — and redirects that attention toward learning.

---

## What it is

Level Up works through a **3-step learning chain**:

```
Curiosity Mode → School Mode → Mission Mode → Reward
```

1. **Curiosity Mode** — A short, reel-style hook that makes kids *want* to know more ("Why does a karate kick break boards?")
2. **School Mode** — Curriculum-aligned lesson that answers the question ("Newton's Second Law — F = ma")
3. **Mission Mode** — A real-world challenge that applies the learning ("Find 3 examples of force at home")
4. **Reward** — XP, badges, and parent-approved rewards unlock only after completing the full chain

Kids cannot skip School Mode to get rewards. Curiosity creates the itch; school mode scratches it.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (for mission photo uploads)
- **PWA**: Service Worker + manifest.json
- **AI**: Anthropic API (optional — falls back to template generator)
- **Video**: Pluggable video layer (Fallback Animator / MCP / Mock)

---

## Getting Started

```bash
cp .env.example .env.local
# Fill in Supabase credentials, optional Anthropic API key
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
