# Mahalla

**Simulues karriere futbollistike kosovare** — nga lagjja te legjenda.

🎮 **Luaj live:** [mahalla.pages.dev](https://mahalla.pages.dev)

---

## Çfarë është Mahalla?

Krijon protagonistin tënd (djalë/vajzë), zgjedh qytetin nga **38 komuna**, fillon në **SHF** në moshën 10, dhe ndjek rrugën:

**SHF → Superliga → Ballkan → EU → Legjendë**

Me evente narrative, merkato, rival, shok SHF, kombëtarja, duel me shok, sfidë ditore dhe PWA për telefon.

---

## Fillo lokal

```bash
cd web
npm install
npm run dev
```

Hap [http://localhost:5173](http://localhost:5173)

---

## Build & Deploy

```bash
cd web
npm run build
```

Ngarko folderin **`web/build`** në [Cloudflare Pages](https://dash.cloudflare.com) (drag & drop).

Detaje: [DEPLOY.md](./DEPLOY.md)

---

## URL speciale

| URL | Efekti |
|-----|--------|
| `/?duel=abc` | Duel — i njëjti seed, krahaso me shok |
| `/?daily=20260818` | Sfida ditore |

---

## Teknologji

- **SvelteKit 5** + TypeScript + Vite
- **PWA** (offline, Add to Home Screen)
- **IndexedDB** (ruajtje karriere)
- **Cloudflare Pages** (hosting statik)

---

## Struktura

```
mahalla/
├── web/                 # Aplikacioni (SvelteKit)
├── MAHALLA_BLUEPRINT.md # Dizajn i plotë i lojës
├── DEPLOY.md            # Udhëzime deploy
└── README.md
```

---

## Features (Sprint 1–6)

- 38 komuna + SHF me fallback Haversine
- Intervistë gazetare · memory log · kombëtarja U15–Dardanët
- Piramida **57 klube** (tier 3–28) · merkato inteligjent (+2 max)
- Play-Off Hajvali · derbi LRFGJ · UECL · kthim në Kosovë
- Gazeta Sportive · 36+ headline · harta karriere · grafikë
- Trashëgimi · Panteon · import/export JSON · PNG legjendë
- 57 logo klubesh · 100% shqip

Blueprint: [MAHALLA_BLUEPRINT.md](./MAHALLA_BLUEPRINT.md)

---

## Licenca

Projekt personal / edukativ. Logo klubesh — badge të gjeneruara ose placeholder.
