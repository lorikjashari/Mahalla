# MAHALLA — Blueprint i Plotë
## Simulues karriere futbollistike kosovare (narrativ, PWA, shqip)

> **Mahalla** = lagjja, komuniteti. Ti fillon aty ku je — jo në Bernabeu.
> Referencë: [La Relève](https://larelevefc.com/) — por më i thellë, më kosovar, më vizual.

---

## 1. Vizioni

**Mahalla** është lojë karriere futbollistike falas në shfletues (PWA), ku lojtari:

1. Zgjedh **qytetin/komunën** e lindjes (38 komuna)
2. Fillon në **SHF-në më të afërt** (ose lokale nëse ekziston)
3. Luhet sezon pas sezoni: ngjarje, ndeshje, merkato, zgjedhje
4. Promovohet **ngadalë**: LRF → Liga e Tretë → Superliga → Ballkan → EU e vogël → EU e madhe
5. Sheh **hartën e Kosovës/Ballkanit/Europës** kur ndërron klubin
6. Lexon **pse** ndodhin gjërat (paneli i shkakut) — si La Relève, por në shqip

**Publiku:** Kosovarët (diaspora + atdhe), mosha 14–35, mobile-first.

**Kohëzgjatja:** 1–2 orë për karrierë të plotë (16 → ~38 vjeç).

---

## 2. Dallimi nga La Relève

| La Relève | Mahalla (më mirë) |
|-----------|-------------------|
| Zgjedh origjinë të përgjithshme | **38 komuna reale** + SHF më e afërt |
| Klube abstrakte | Klube **inspiruar nga realiteti** (Presingu, Drita, Laçi…) |
| Pa hartë | **Hartë interaktive** — rrugëtimi kur ndërron klubin |
| Logo abstrakte | Logo reale ku lejohet; **`?` badge** kur mungon |
| FR/EN | **100% shqip** (sq) |
| localStorage | **IndexedDB** — shumë karriera, eksport/import |
| Ballkan i përgjithshëm | **LRF, Hajvali, Play-Off Nacional, FFK** — sistemi real kosovar |
| Rival i gjeneratës | Rival + **shok i SHF-së** + **agjent i rremë** (evente me kujtesë) |

---

## 3. Rrjedha e Lojës (Game Loop)

### 3.1 Faza e krijimit

```
[Fillimi]
   ↓
[Zgjedh komuna] — hartë e Kosovës, 38 pika
   ↓
[Sistem gjen SHF] — lokale OSE më e afërt (km + emër)
   ↓
[Intervistë gazetare] — "Nga vjen, kush vendos, çfarë ëndërron?"
   ↓
[Zgjedh pozitën] — GK / DF / MF / FW
   ↓
[Trajektoria] — 6 zgjedhje fillestare (familje, stil jetese, entourage)
   ↓
[Sezoni 1 — mosha ~10 në SHF] OSE [mosha 16 në senior] ← opsion
```

**Rekomandim:** Fillim në **mosha 10** (SHF U11) me 5 sezone të shkurtra youth, pastaj **16** senior — më autentik.

### 3.2 Loop sezonal

```
event → [ndeshje opsionale] → përmbledhje → merkato → sezon i ri
```

| Faza | Përmbajtja (shqip) |
|------|---------------------|
| **Ngjarje** | 1 event/season: familja, vestiari, para, lëndim, media, agjenti |
| **Ndeshje** | Moment i madh (derbi, Play-Off, finales) — skill check |
| **Përmbledhje** | Titull gazete + statistika + **Paneli i Shkakut** |
| **Merkato** | 2–4 oferta + rinovim + qëndro + pension |
| **Harta** | Animacion rrugëtimi nga klubi i vjetër → i ri |

### 3.3 Faza e pensionit

- Rezultati i karrierës, badge, karta legjendë (PNG për share)
- Krahasim me **rivalin e gjeneratës**
- **Trashëgimia** — bonus për karrierën tjetër (max 2)
- Hyrje në **Panteonin e Mahallës**

---

## 4. Sistemi i Qytetit & SHF (Core Feature)

### 4.1 Zgjedhja e komunes

Harta e Kosovës me **38 komuna** (lat/lng). Lojtari prek komuna → shfaqet:

```
Komuna: Viti
LRF: Gjilan
SHF lokale: SHF Presingu ✓
Distanca: 0 km (në lagje)
```

Nëse **nuk ka SHF lokale** (p.sh. Lipjan):

```
Komuna: Lipjan
LRF: Prishtinë
⚠ Nuk ka SHF në Lipjan
SHF më e afërt: SHF Lumi (Shtime) — 11 km
Do të stërvitesh jashtë lagjes — si shumë fëmijë kosovarë.
[Prano] [Zgjedh komuna tjetër]
```

### 4.2 Logjika e caktimit (Haversine)

```typescript
function assignAcademy(municipalityId: number): AcademyAssignment {
  const local = shfByMunicipality[municipalityId];
  if (local.length > 0) return { type: 'local', shf: local[0], distanceKm: 0 };
  const nearest = findNearestSHF(municipalityId); // Haversine
  return { type: 'nearest', shf: nearest.shf, distanceKm: nearest.km };
}
```

### 4.3 Tabela e fallback (shembuj)

| Komuna | SHF lokale | Fallback |
|--------|------------|----------|
| Viti | Presingu, Kosova-Viti | — |
| Gjilan | Drita, Kika, Galaksia… | — |
| Lipjan | — | SHF Lumi (Shtime, 11 km) |
| Obiliq | — | SHF Kurda (Fushë Kosovë, 6 km) |
| Drenas | — | KSF Drenica (Skenderaj, 16 km) |
| Leposaviq | — | SHF Bardhi (Mitrovicë, 24 km)* |

*Veri i Kosovës: event special — udhëtim i gjatë, sistem i dyfishtë futbollistik.

### 4.4 17 komuna me SHF lokale të dokumentuar

Ferizaj, Fushë Kosovë, Gjakovë, Gjilan, Kamenica, Malishevë, Mitrovicë (Jug), Peja, Podujeva, Prishtinë, Prizren, Rahovec, Skenderaj, Shtime, Suharekë, Viti, Vushtrri

**21 komuna** → fallback te SHF më e afërt ose klub akademi i zonës.

---

## 5. Piramida e Karrierës (30 Nivele)

### Faza 0 — Rinia (mosha 10–15)
| Nivel | Liga | Shembuj |
|-------|------|---------|
| 0 | SHF / LRF U11–U17 | Presingu, Kosova-Viti, Kika |
| 1 | Play-Off Nacional (Hajvali) | Seleksion rajonal |
| 2 | Elite U15 FFK / TDS | Kamp kombëtar |

### Faza 1 — Kosova senior (16–22)
| Nivel | Liga | Klube (të vogla → të mëdha) |
|-------|------|------------------------------|
| 3 | Liga e Tretë | Uniteti, klube lokale |
| 4 | Liga e Dytë | Drenica, Ferizaj rezervë |
| 5 | Liga e Parë | Dinamo Ferizaj, Feronikeli |
| 6 | Superliga (fund) | Malisheva, Dukagjini |
| 7 | Superliga (mes) | Gjilani, Llapi, Ferizaj |
| 8 | Superliga (top) | Drita, Ballkani, Prishtina |

### Faza 2 — Ballkan (20–24)
| Nivel | Liga | Klube |
|-------|------|-------|
| 9 | AL 2nd tier | Pogradeci, Burreli |
| 10 | AL Superiore (mes) | Laçi, Teuta, Egnatia |
| 11 | AL Superiore (top) | Partizani, Tirana, Vllaznia |
| 12 | MK 2. MFL | Horizonti |
| 13 | MK 1. MFL | Shkëndija, Shkupi |
| 14 | Montenegro/Bosnia | Budućnost, Sarajevo (mes) |

### Faza 3 — EU e vogël (22–27)
| Nivel | Liga | Klube |
|-------|------|-------|
| 15 | CH Promotion League | SR Delémont |
| 16 | CH Challenge League | Xamax, Wil |
| 17 | RO Liga II | mid-table |
| 18 | RO Liga I | UTA Arad, Argeș |
| 19 | HR Druga NL | Hajduk II, Lokomotiva |
| 20 | HR HNL (mes) | Slaven Belupo, Istra |
| 21 | AT 2. Liga | Klagenfurt |
| 22 | BG/HU/SK mid | CSKA Sofia, Puskás, Spartak Trnava |

### Faza 4 — EU e fortë (25–30)
| Nivel | Liga | Klube |
|-------|------|-------|
| 23 | RO/HNL top | Rapid București, Dinamo Zagreb |
| 24 | DK Superliga | Brøndby, mid |
| 25 | BE/PL mid | Gent, mid Ekstraklisa |

### Faza 5 — Elite (27+, rrallë)
| Nivel | Liga | Klube |
|-------|------|-------|
| 26 | Top 5 (mes) | Lecce, Augsburg, Getafe |
| 27 | Top 5 (i madh) | Napoli, Leverkusen, Sevilla |
| 28 | Legjendë | Inter, Milan, Dortmund (event i rrallë) |

**Rregull:** Max +2 nivele për transfer; 1–3 sezone të mira për hapin tjetër.

---

## 6. UI/UX — Dizajni Visual

### 6.1 Identiteti vizual

- **Emri:** MAHALLA — font i fortë, minimalist
- **Ngjyra:** e errët (#0f1419) + jeshile kosovare (#2d6a4f) + akcent i artë (#d4a853)
- **Stil:** modern, mobile-first, kartela të mëdha, zero clutter
- **Motiv:** lagje, rrugë, stadium i vogël → stadium i madh

### 6.2 Ekranet kryesore

| Ekrani | Përmbajtja |
|--------|------------|
| **Ballina** | Logo Mahalla, "Luaj", "Panteoni", "Trashëgimi", "Eksporto" |
| **Harta e Kosovës** | Zgjedh komuna (touch/click) |
| **Profili** | Emri, mosha, OVR, pozita, klubi aktual, logo |
| **Sezoni** | Event → ndeshje → recap |
| **Merkato** | Kartela ofertash me logo, rol, minuta, distanca |
| **Harta e karrierës** | Pin për çdo klub; vijë animuar në transfer |
| **Paneli i Shkakut** | % shpjegim: formë, trajner, nivel, lëndim… |
| **Gazeta** | "Gazeta Sportive" — titull sezonal |
| **Pension** | Karta legjendë + rival |

### 6.3 Sistemi i logove

```
1. /assets/logos/{clubId}.webp     → logo e vërtetë (ku lejohet)
2. /assets/logos/generated/{id}    → badge me iniciale + ngjyra klubi
3. Fallback UI:                    → ? në rreth gri (si kërkuar)
```

**Rregull ligjor:** Klube Superliga — logo të licencuara ose të autorizuara; klube të vogla — badge i gjeneruar ose `?`.

Komponenti `ClubLogo`:
```tsx
<ClubLogo club={club} size="md" />
// shfaq logo | badge | "?" sipas availability
```

### 6.4 Harta e rrugëtimit (Transfer Map)

Teknologji: **MapLibre GL JS** + tiles offline Kosovë/Ballkan.

Kur firmos kontratën:
1. Pin i vjetër pulson
2. Vijë e animuar (arc) drejt klubit të ri
3. Tekst: *"Nga Viti → Gjilan — 32 km. Lagjja jote të pret."*
4. Transfer jashtë vendit: zoom out → Ballkan → EU

**Modifikues gameplay:** distanca e madhe → `-adaptim` sezonin e parë jashtë.

### 6.5 Grafikët & statistika

- **Graf bar:** minuta për sezon (5 vitet e fundit)
- **Graf line:** OVR progression
- **Graf pie:** arsyeja e minutave (Paneli i Shkakut)
- **Timeline:** klube në karrierë (horizontal scroll)

---

## 7. Mekanika të Avancuara (për të "shpërthyer")

### 7.1 Narrative me kujtesë
- Agjenti i rremë në moshë 16 → kthehet në 22
- Sabotimi i shokut → ai bëhet rival
- Prindi kundër transferit → -morale ose +motivim

### 7.2 Rivali i gjeneratës
- I njëjti vit, pozita, LRF
- Rritet paralelisht; krahasim në fund

### 7.3 Shoku i SHF-së
- Personazh fiks nga fillimi — ndonjëherë kalon te klub më i mirë para teje

### 7.4 Kombëtarja
- U15 → U17 → U21 → **Dardanët**
- Thirrje = oferta më të mira nga jashtë

### 7.5 Trashëgimia (meta)
- Karriera e kaluar lë bonus + penalitet
- Shembull: "Djali i lagjes" (+reputacion lokal, -adaptim jashtë)

### 7.6 Sfidë ditore & duel
- `mahalla.app/?daily=20260818` — i njëjti seed për të gjithë
- `#duel=abc123` — krahaso me shok

### 7.7 Evente rajonale autentike
- **Play-Off Nacional Hajvali**
- **Derbi LRFGJ:** Presingu vs Kosova-Viti
- **UECL:** nëse je te Ballkani/Drita
- **Kthim në Superliga** pas dështimit jashtë

### 7.8 Paneli i marrëdhënieve
- Trajner | Agjent | Familja | Partner | Rival (bar i thjeshtë)

---

## 8. Gjuha — 100% Shqip

Të gjitha stringjet në `src/i18n/sq.json`. Shembuj:

| Key | Tekst |
|-----|-------|
| `start.choose_city` | Zgjedh qytetin tënd |
| `start.nearest_shf` | SHF më e afërt: {name} ({km} km) |
| `season.cause_panel` | Pse luaj / pse nuk luaj |
| `market.offer_role` | Roli i premisuar: {role} |
| `map.travel` | Udhëtim: {from} → {to} |
| `retire.legend` | Legjenda e Mahallës |

**Slang futbollistik:** merkato, derbi, kombëtarja, shkolla e futbollit, LRF, Play-Off.

---

## 9. Arkitektura Teknike

### 9.1 Stack

| Shtresë | Teknologji |
|---------|------------|
| Frontend | **SvelteKit** + Vite |
| Simulimi | **TypeScript** package `@mahalla/core` |
| State machine | **XState v5** (fazat e sezonit) |
| Stil | **Tailwind CSS v4** |
| Harta | **MapLibre GL JS** + PMTiles offline |
| Ruajtja | **Dexie.js** (IndexedDB) |
| PWA | **vite-plugin-pwa** (Workbox) |
| Deploy | **Cloudflare Pages** |
| Teste | **Vitest** (simulimi determinist) |

### 9.2 Struktura e projektit

```
mahalla/
├── packages/
│   ├── core/                 # RNG, sezon, merkato, shkaket
│   └── content/              # JSON: komuna, shf, klube, evente
├── apps/
│   └── web/
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/   # ClubLogo, CausePanel, Headline…
│       │   │   ├── map/          # CareerMap.svelte
│       │   │   └── i18n/sq/
│       │   └── routes/
│       └── static/
│           ├── logos/
│           └── tiles/kosovo.pmtiles
├── MAHALLA_BLUEPRINT.md
└── package.json
```

### 9.3 Determinizmi

- Seed + zgjedhje = i njëjti rezultat (duel/sfidë ditore)
- Ruajtje pas çdo faze
- Eksport: `mahalla-{seed}.json`

### 9.4 Skema e ruajtjes

```typescript
interface MahallaSave {
  version: 1;
  seed: string;
  phase: 'creation' | 'event' | 'match' | 'recap' | 'market' | 'retire' | 'end';
  player: PlayerState;
  career: ClubHistory[];
  flags: string[];        // evente me kujtesë
  rival: RivalState;
  mapPins: GeoPin[];
}
```

---

## 10. Përmbajtja (Content) — Faza 1

### 10.1 Të dhëna për seed

- [ ] 38 komuna (lat, lng, LRF)
- [ ] ~34 SHF të dokumentuara + fallback për 21 komuna
- [ ] 7 LRF me emra dhe ngjyra
- [ ] ~50 klube Kosovë (Tretë → Superliga)
- [ ] ~40 klube Ballkan (AL, MK, MNE, BIH)
- [ ] ~30 klube EU (CH, RO, HR, AT, BG, HU, SK, DK)
- [ ] ~10 klube elite (Top 5, rrallë)

### 10.2 Evente narrative

- [ ] 80 evente youth (SHF, shkolla, prindër)
- [ ] 120 evente senior (merkato, media, lëndime, para)
- [ ] 40 evente jashtë vendit (adaptim, diaspora, homesick)
- [ ] 30 headline templates (Gazeta Sportive)

### 10.3 Logot

- [ ] Superliga top 10 — logo ose badge
- [ ] SHF të njohura — badge me iniciale
- [ ] Të tjerat — `?` ose generated badge

---

## 11. Roadmap Implementimi

### Sprint 1 — MVP (2–3 javë)
1. Monorepo + SvelteKit PWA shell
2. `@mahalla/core`: RNG, 1 sezon i thjeshtë
3. Zgjedhja e komunes + SHF fallback
4. Loop: event → recap → merkato
5. 10 klube Kosovë, shqip, ruajtje IndexedDB

### Sprint 2 — Harta & vizual (2 javë)
6. MapLibre — harta Kosovës, pin komuna
7. ClubLogo me fallback `?`
8. Animacion transferi
9. Paneli i Shkakut + Gazeta

### Sprint 3 — Thellësi (2–3 javë)
10. Piramida 30 nivele + merkato inteligjent
11. Rival + shoku SHF
12. Play-Off Hajvali, LRF events
13. Ballkan + EU oferta

### Sprint 4 — Meta & launch (1–2 javë)
14. Trashëgimi, Panteon, duel, sfidë ditore
15. Karta legjendë (share PNG)
16. SEO, PWA install, offline tiles
17. Launch: mahalla.app / GitHub Pages

---

## 12. Metrika suksesi

- **1k karriera** në javën e parë (Kosovë + diaspora)
- **Share rate:** >15% karta legjendë
- **Session:** 45–90 min mesatare
- **Mobile:** >70% trafik
- **Feedback:** "Duket si jeta ime" — target emocional

---

## 13. Rreziqe & zgjidhje

| Rrisk | Zgjidhje |
|-------|----------|
| Logo klubesh (copyright) | Badge i gjeneruar + `?`; emra "inspiruar" |
| Veri i Kosovës (politik) | Event neutral; fokus FFK path |
| Të dhëna jo të plota SHF | Fallback Haversine + "SHF e zonës" generic |
| Scope shumë i madh | MVP vetëm Kosovë + Shqipëri; EU në v1.1 |

---

## 14. Vendime të konfirmuara ✅

| Pyetje | Përgjigjja |
|--------|------------|
| Mosha e fillimit | **10 vjeç** — SHF / LRF youth (U11) |
| Gjinia | **Të dyja opsionet** — djalë ose vajzë |
| Pozita | **Zgjedhje e lire** — GK / DF / MF / FW |
| Emri | Lojtari shkruan (me sugjerim random opsional) |

**Implikime:**
- Sezonet 10–15 = rinia (SHF, LRFGJ, Play-Off Hajvali)
- Sezoni i parë senior ≈ mosha 16 (kontratë pro)
- Vajzat: SHF/grupe të veçanta ku relevant (p.sh. Presingu gra)
- UI: ekran zgjedhjeje gjinie para pozitës

---

## 15. Përmbledhje një rresht

**Mahalla** = zgjedh komuna → SHF më e afërt → karrierë narrativ kosovare → hartë rrugëtimi → merkato realiste Ballkan/EU → legjendë ose jo — **të gjitha në shqip**.

---

*Blueprint v1.0 — gati për implementim. Hapi tjetër: Sprint 1 MVP.*
