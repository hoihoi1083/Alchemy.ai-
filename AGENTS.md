# Instructions for AI assistants (Cursor, ChatGPT, etc.)

**Read this file first** when working on `~/Desktop/ai-marketing-studio`.

---

## Project context

| Path | Role |
|------|------|
| `~/Desktop/ai-marketing-studio` | **New** public-friendly app — guided wizard, templates, future assistant |
| `~/Desktop/seadance-video` | **Original** power-user studio — keep working; do not break for daily use |

User wants:

1. Beginner-friendly UI (template → image → video → finish)
2. Nano Banana (fal) for images, Seedance 2.0 (fal) for video
3. Option to export **clean MP4** (no AI subtitles) for CapCut/Premiere
4. Optional post-process (Cantonese subs/dub) — still mainly in old app until Phase 4
5. Templates for **small business marketing** (FB/IG reels)
6. Eventually an **AI assistant** that guides step-by-step
7. Possible **public SaaS** — see `docs/PRODUCT_EVALUATION.md`

---

## Tech stack

- Next.js 15 App Router, React 19, Tailwind 4
- `@fal-ai/client` — image `fal-ai/nano-banana-2/edit`, video `bytedance/seedance-2.0` (+ `/fast`)
- Post-process: `lib/pipeline/*` (ffmpeg, whisper, openai, azure) — copied from seadance-video
- Env: `FAL_KEY` required; OpenAI/Azure optional for post-process

---

## Key files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Guided wizard entry |
| `components/StudioWizard.tsx` | 4-step UI logic |
| `lib/templates.ts` | Marketing template definitions |
| `app/api/generate-image/route.ts` | Nano Banana |
| `app/api/generate/route.ts` | Seedance video |
| `app/api/postprocess/route.ts` | Subtitles/dub |
| `docs/ROADMAP.md` | What to build next — **follow phases in order** |
| `docs/PRODUCT_EVALUATION.md` | Strategy — do not delete |

---

## How to continue work (for AI)

1. Read `docs/ROADMAP.md` — find first unchecked item in the current phase.
2. Implement **one phase item per session** unless user asks for more.
3. Keep **simple mode default**; hide expert fields unless `/pro` or “Advanced”.
4. **Minimize scope** — match existing code style; no over-engineering.
5. **Do not** remove or refactor `seadance-video` unless user explicitly asks.
6. After changes: `npm run build` in `ai-marketing-studio`.
7. Never commit `.env.local` or expose `FAL_KEY` to the client.

---

## User preferences (from prior sessions)

- Cantonese ads for HK market (crystal, BaZi, career reports, SMB promos)
- Avoid on-screen text in Seedance output (`avoid_on_screen_text`, negative prompt)
- Motion strength ~25–35 for stable ads
- Duration: model supports 4–15s or auto; 2–3s may fallback to 4s
- Cost presets: prefer 480p + fast tier for drafts
- User codes in English; marketing copy often 繁體中文

---

## Prompt for user to paste in a **new chat**

```
I'm building AI Marketing Studio at ~/Desktop/ai-marketing-studio.
Read AGENTS.md, docs/ROADMAP.md, and docs/PRODUCT_EVALUATION.md first.
Continue the next unchecked roadmap item. Keep seadance-video unchanged.
```

---

## Phase status

- **Phase 1:** scaffold complete — user should run `npm install`, copy `.env.local`, test wizard.
- **Next:** Phase 2 polish OR Phase 3 assistant — ask user which they prefer.
