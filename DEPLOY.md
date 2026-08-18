# Deploy Mahalla — Cloudflare Pages

**Live:** [mahalla.pages.dev](https://mahalla.pages.dev)

## Build lokale

```bash
cd web
npm install
npm run build
npm run preview
```

Output: **`web/build/`** (SPA statike — pa Worker)

---

## Metoda 1 — Upload direkt (më e shpejta)

1. `npm run build`
2. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **mahalla**
3. **Create deployment** → ngarko folderin **`web/build`**
4. Deploy

> ⚠️ Mos përdor `.svelte-kit/cloudflare` — shkakton Error 522 me drag-and-drop.

---

## Metoda 2 — GitHub auto-deploy (rekomanduar)

1. Repo: [github.com/lorikjashari/Mahalla](https://github.com/lorikjashari/Mahalla)
2. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. **Build settings:**

| Fusha | Vlera |
|-------|--------|
| Root directory | `web` |
| Build command | `npm run build` |
| Build output | `build` |
| Node version | `20` (`NODE_VERSION=20`) |

4. Çdo push në `main` → deploy automatik

---

## Metoda 3 — Wrangler CLI

```bash
cd web
npx wrangler login
npm run deploy
```

---

## PWA

Hap sajtin në telefon → **Add to Home Screen**.

---

## URL speciale

| URL | Efekti |
|-----|--------|
| `/?duel=abc` | Duel me shok |
| `/?daily=20260818` | Sfida ditore |

---

## Domain custom

Cloudflare Pages → **Custom domains** → shto domain-in tënd.
