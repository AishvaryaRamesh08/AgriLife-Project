# AgriLife Research-to-Field

Texas A&M AgriLife research made practical for Texas farmers and ranchers: plain-language article summaries, a 5-day county field forecast, "What this means for my farm" guides, step-by-step techniques, and a research chatbot grounded only in the article library. English and Spanish.

**Live site:** https://aishvaryaramesh08.github.io/AgriLife-Project/

Forked from [raywan10000/AgriLife-Project](https://github.com/raywan10000/AgriLife-Project) (built in Google AI Studio).

## Two ways to run it

| | Static site (GitHub Pages) | Local server |
|---|---|---|
| Command | `npm run build:pages` | `npm run dev` |
| AI calls | Browser → Gemini, using the **visitor's own key** | Express (`server.ts`) → Gemini, using `GEMINI_API_KEY` |
| Key lives | Only in that visitor's browser (localStorage) | `.env` on the server (gitignored) |

Both modes use the same prompts in [`src/services/aiPrompts.ts`](src/services/aiPrompts.ts), so their answers follow the same grounding rules. [`src/services/aiClient.ts`](src/services/aiClient.ts) picks the mode at build time.

### Static site

Articles, weather (Open-Meteo), farm settings and the researcher dashboard work for everyone with no key. The first time a visitor uses an AI feature, the site asks for a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey). The key is checked with Google, kept only in that browser, and can be changed or removed from **Settings (sliders icon) → AI key**.

Never put a Gemini key in this repo or in a GitHub secret for the Pages build: anything baked into a static site is public.

Every push to `main` rebuilds and deploys the site with [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

### Local server

```bash
npm install
echo 'GEMINI_API_KEY="your-key"' > .env   # gitignored
npm run dev                              # http://localhost:3000
```

## Scripts

- `npm run dev`: Express + Vite dev server with the Gemini API routes
- `npm run build`: production build for the server (`NODE_ENV=production npm start`)
- `npm run build:pages`: static build for GitHub Pages (relative asset paths, browser-side AI)
- `npm run lint`: type-check
