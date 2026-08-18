# Mahalla

**Nga lagjja te legjenda — ose jo.**

Mahalla is a free, browser-based football career simulator set in Kosovo. You grow up in a real municipality, join a local football school (SHF), and live season by season through choices, matches, transfers, and milestones — all in Albanian.

**Play:** [mahalla.pages.dev](https://mahalla.pages.dev)

---

## What is Mahalla?

*Mahalla* means neighborhood — the place where your story starts. This is not a generic European career mode. It is built around Kosovo’s football culture: LRF leagues, SHF academies, Hajvali play-offs, local derbies, and the long road from village pitch to legend.

You create a player, pick one of **38 municipalities**, and the game assigns your starting academy — locally if one exists, or the nearest SHF if not. From age 10 you move through seasons of events, big matches, newspaper recaps, and transfer windows. Your form, relationships, reputation, and decisions shape whether you stay home, move abroad, get a national team call, or retire early.

The goal is simple to say and hard to reach: **build a career that feels like it could only happen here.**

---

## How a career works

1. **Origin** — Choose where you are from on the Kosovo map.
2. **Identity** — Gender, position, name, and a short pre-season interview that sets your starting traits.
3. **Academy** — Begin at your SHF (local or nearest).
4. **Season loop** — Each year: narrative event → match moment → season recap → transfer market.
5. **Progression** — Climb from youth football through Kosovo’s pyramid toward Superliga, Balkans, and Europe.
6. **Legacy** — Finish as a legend card, unlock pantheon entries, export your save, or start again.

Along the way you will meet a **rival from your generation**, manage **relationships** (family, coach, agent), receive **national team** calls, face **daily challenges** and **duel mode** (same seed, different choices), and watch your path drawn on a **career map**.

---

## Play modes

| Mode | Description |
|------|-------------|
| **Career** | Standard run — your choices, your story. |
| **Daily challenge** | `/?daily=YYYYMMDD` — same scenario for everyone that day. |
| **Duel** | `/?duel=seed` — share a seed with a friend and compare outcomes. |

Saves live in your browser (IndexedDB). You can export and import careers as JSON.

---

## Tech

Mahalla is a **PWA** — installable on mobile, works offline where cached, no app store required.

- SvelteKit 5 · TypeScript · Vite
- MapLibre GL for journey and career maps
- IndexedDB for saves
- Deployed as static files on Cloudflare Pages

---

## Run locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
cd web
npm run build
```

Output is in `web/build`. See [DEPLOY.md](./DEPLOY.md) for Cloudflare Pages deployment.

---

## Project structure

```
mahalla/
├── web/                  # Game (SvelteKit app)
├── MAHALLA_BLUEPRINT.md  # Full design document (Albanian)
├── DEPLOY.md             # Deployment guide
├── LICENSE               # MIT
└── README.md
```

---

## Design notes

Mahalla is inspired by narrative career games like [La Relève](https://larelevefc.com/), but grounded in Kosovo: real municipalities, a believable club pyramid, Albanian UI, and maps that show distance and journey — not just stats on a dashboard.

Club names and logos are inspired by real football culture where appropriate; some assets use generated placeholders.

Full game design: [MAHALLA_BLUEPRINT.md](./MAHALLA_BLUEPRINT.md)

---

## License

[MIT](./LICENSE) © 2026 Lorik Jashari
