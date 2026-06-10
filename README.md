# AI Marketing Studio

**New guided app** for small-business marketing (image → video).  
Your **original power-user app** stays at `~/Desktop/seadance-video` — keep using it daily.

## Quick start

```bash
cd ~/Desktop/ai-marketing-studio
cp .env.example .env.local
# Copy FAL_KEY from seadance-video/.env.local if you already have one
npm install
npm run setup:bgm          # background music MP3s (needs ffmpeg: brew install ffmpeg)
npm run setup:compositor   # Chinese fonts for paper-layout template
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — guided 4-step wizard.

- **Pro / full controls:** still in `seadance-video` until Phase 2
- **Study the plan:** `docs/PRODUCT_EVALUATION.md`
- **Build phases:** `docs/ROADMAP.md`
- **New AI chat:** read `AGENTS.md` first

## Two projects

| Folder | Purpose |
|--------|---------|
| `seadance-video` | Your working studio — all features, post-process, advanced |
| `ai-marketing-studio` | Public-friendly product — built step by step |

## Easy mode (current)

- **EN / 中文** UI toggle
- Upload product photo → one button → video **with BGM**
- Optional **reference ad** for CapCut finish guide (Option C workflow)
- Background music: `public/bgm/*.mp3` via `npm run setup:bgm` + ffmpeg mix

## Docs

- `docs/PRODUCT_EVALUATION.md` — full strategy & competition analysis
- `docs/ROADMAP.md` — what to build next
- `AGENTS.md` — paste into new Cursor chats so AI continues the same plan
