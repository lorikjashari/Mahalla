# Mahalla

**Nga lagjja te legjenda — ose jo.**

Free football career simulator set in Kosovo. Pick your SHF on the map, live season by season through choices, matches, transfers, and milestones — in Albanian.

**Play:** [mahalla.pages.dev](https://mahalla.pages.dev)

## Features

- Interactive Kosovo map — choose your starting football school (SHF)
- Full career loop: events, match moments, newspaper recaps, transfer windows
- Kosovo pyramid: LRF → Superliga → Balkans → Europe
- Rival, relationships, national team, milestones, legacy & pantheon
- Daily challenge & duel mode (shared seeds)
- PWA — installable, offline-capable saves (IndexedDB + JSON export)

## Play modes

| Mode | URL |
|------|-----|
| Career | `/` |
| Daily challenge | `/?daily=YYYYMMDD` |
| Duel | `/?duel=seed` |

## Tech stack

- SvelteKit 5 · TypeScript · Vite
- MapLibre GL
- Static deploy on Cloudflare Pages

## Development

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
npm run preview
```

Output: `web/build/`

## Deploy (Cloudflare Pages)

**GitHub (recommended):** connect repo, set root to `web`, build command `npm run build`, output `build`, Node 20.

**Manual:** run `npm run build`, upload `web/build` to Cloudflare Pages.

Live site: [mahalla.pages.dev](https://mahalla.pages.dev)

## Structure

```
mahalla/
├── web/          # SvelteKit game
├── LICENSE       # MIT
└── README.md
```

## License

[MIT](./LICENSE) © 2026 Lorik Jashari
