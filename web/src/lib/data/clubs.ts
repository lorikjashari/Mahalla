export interface ClubDefinition {
	id: string;
	name: string;
	league: string;
	country: string;
	tier: number;
	lat: number;
	lng: number;
	colors: [string, string];
	initials: string;
	logoUrl?: string;
	minRep?: number;
	minOvr?: number;
}

/** Piramida 0–28 (SHF → legjendë) — max +2 tier për transfer */
export const CLUBS: ClubDefinition[] = [
	// Kosovë — Liga e Tretë / Dytë / Parë / Superliga
	{ id: 'uniteti', name: 'KF Uniteti', league: 'Liga e Tretë', country: 'Kosovë', tier: 3, lat: 42.31, lng: 21.36, colors: ['#1d3557', '#457b9d'], initials: 'UN', minRep: 6, logoUrl: '/logos/uniteti.svg' },
	{ id: 'liria', name: 'KF Liria', league: 'Liga e Tretë', country: 'Kosovë', tier: 3, lat: 42.213, lng: 20.739, colors: ['#003049', '#d62828'], initials: 'LI', minRep: 6 },
	{ id: 'drenica-d2', name: 'KF Drenica', league: 'Liga e Dytë', country: 'Kosovë', tier: 4, lat: 42.75, lng: 20.79, colors: ['#003049', '#d62828'], initials: 'DR', minRep: 8, logoUrl: '/logos/drenica.svg' },
	{ id: 'trepca', name: 'KF Trepça', league: 'Liga e Dytë', country: 'Kosovë', tier: 4, lat: 42.89, lng: 20.87, colors: ['#004b23', '#ffffff'], initials: 'TR', minRep: 8 },
	{ id: 'dinamo-ferizaj', name: 'KF Dinamo Ferizaj', league: 'Liga e Parë', country: 'Kosovë', tier: 5, lat: 42.37, lng: 21.16, colors: ['#03045e', '#0077b6'], initials: 'DF', minRep: 10, logoUrl: '/logos/dinamo-ferizaj.svg' },
	{ id: 'feronikeli', name: 'KF Feronikeli', league: 'Liga e Parë', country: 'Kosovë', tier: 5, lat: 42.37, lng: 21.14, colors: ['#004b23', '#70e000'], initials: 'FE', minRep: 10, logoUrl: '/logos/feronikeli.svg' },
	{ id: 'malisheva', name: 'KF Malisheva', league: 'Superliga', country: 'Kosovë', tier: 6, lat: 42.48, lng: 20.75, colors: ['#2b9348', '#e9c46a'], initials: 'MA', minRep: 12, logoUrl: '/logos/malisheva.svg' },
	{ id: 'dukagjini', name: 'KF Dukagjini', league: 'Superliga', country: 'Kosovë', tier: 6, lat: 42.52, lng: 20.56, colors: ['#003566', '#ffd60a'], initials: 'DU', minRep: 12, logoUrl: '/logos/dukagjini.svg' },
	{ id: 'ferizaj', name: 'KF Ferizaj', league: 'Superliga', country: 'Kosovë', tier: 7, lat: 42.37, lng: 21.155, colors: ['#003049', '#fcbf49'], initials: 'KF', minRep: 14, minOvr: 52, logoUrl: '/logos/ferizaj.svg' },
	{ id: 'gjilani', name: 'SC Gjilani', league: 'Superliga', country: 'Kosovë', tier: 7, lat: 42.4647, lng: 21.4669, colors: ['#005f73', '#ee9b00'], initials: 'GJ', minRep: 14, minOvr: 52, logoUrl: '/logos/gjilani.svg' },
	{ id: 'llapi', name: 'KF Llapi', league: 'Superliga', country: 'Kosovë', tier: 7, lat: 42.9117, lng: 21.1917, colors: ['#003049', '#eae2b7'], initials: 'LL', minRep: 14, minOvr: 53, logoUrl: '/logos/llapi.svg' },
	{ id: 'vushtrria', name: 'KF Vushtrria', league: 'Superliga', country: 'Kosovë', tier: 7, lat: 42.8222, lng: 20.9667, colors: ['#14213d', '#fca311'], initials: 'VU', minRep: 13, logoUrl: '/logos/vushtrria.svg' },
	{ id: 'drita', name: 'FC Drita', league: 'Superliga', country: 'Kosovë', tier: 8, lat: 42.66, lng: 21.16, colors: ['#004b23', '#ffffff'], initials: 'DT', minRep: 18, minOvr: 58, logoUrl: '/logos/drita.svg' },
	{ id: 'ballkani', name: 'KF Ballkani', league: 'Superliga', country: 'Kosovë', tier: 8, lat: 42.36, lng: 20.82, colors: ['#006d77', '#ffddd2'], initials: 'BA', minRep: 18, minOvr: 58, logoUrl: '/logos/ballkani.svg' },
	{ id: 'prishtina', name: 'FC Prishtina', league: 'Superliga', country: 'Kosovë', tier: 8, lat: 42.6633, lng: 21.1622, colors: ['#003049', '#ffffff'], initials: 'PR', minRep: 17, minOvr: 57, logoUrl: '/logos/prishtina.svg' },

	// Shqipëri — Kategoria e Dytë / Superiore
	{ id: 'pogradeci', name: 'KF Pogradeci', league: 'Kategoria e Dytë', country: 'Shqipëri', tier: 9, lat: 41.185, lng: 20.702, colors: ['#003049', '#ffd60a'], initials: 'PO', minRep: 14, minOvr: 50, logoUrl: '/logos/pogradeci.svg' },
	{ id: 'burreli', name: 'KF Burreli', league: 'Kategoria e Dytë', country: 'Shqipëri', tier: 9, lat: 41.608, lng: 20.011, colors: ['#6a040f', '#ffffff'], initials: 'BU', minRep: 14, minOvr: 50, logoUrl: '/logos/burreli.svg' },
	{ id: 'laci', name: 'KF Laçi', league: 'Kategoria Superiore', country: 'Shqipëri', tier: 10, lat: 41.635, lng: 19.713, colors: ['#003049', '#90e0ef'], initials: 'LA', minRep: 16, minOvr: 54, logoUrl: '/logos/laci.svg' },
	{ id: 'teuta', name: 'KF Teuta', league: 'Kategoria Superiore', country: 'Shqipëri', tier: 10, lat: 41.311, lng: 19.446, colors: ['#003566', '#ffd60a'], initials: 'TE', minRep: 17, minOvr: 55, logoUrl: '/logos/teuta.svg' },
	{ id: 'egnatia', name: 'KF Egnatia', league: 'Kategoria Superiore', country: 'Shqipëri', tier: 10, lat: 41.112, lng: 20.082, colors: ['#004b23', '#ffffff'], initials: 'EG', minRep: 16, minOvr: 54, logoUrl: '/logos/egnatia.svg' },
	{ id: 'partizani', name: 'FK Partizani', league: 'Kategoria Superiore', country: 'Shqipëri', tier: 11, lat: 41.327, lng: 19.818, colors: ['#6a040f', '#ffba08'], initials: 'PA', minRep: 20, minOvr: 58, logoUrl: '/logos/partizani.svg' },
	{ id: 'tirana', name: 'KF Tirana', league: 'Kategoria Superiore', country: 'Shqipëri', tier: 11, lat: 41.327, lng: 19.818, colors: ['#003049', '#ffffff'], initials: 'TI', minRep: 21, minOvr: 59, logoUrl: '/logos/tirana.svg' },
	{ id: 'vllaznia', name: 'KF Vllaznia', league: 'Kategoria Superiore', country: 'Shqipëri', tier: 11, lat: 42.068, lng: 19.512, colors: ['#003049', '#0077b6'], initials: 'VL', minRep: 20, minOvr: 58, logoUrl: '/logos/vllaznia.svg' },

	// Maqedoni
	{ id: 'horizonti', name: 'FK Horizonti', league: '2. MFL', country: 'Maqedoni', tier: 12, lat: 41.746, lng: 22.192, colors: ['#003049', '#ffd60a'], initials: 'HO', minRep: 19, minOvr: 56, logoUrl: '/logos/horizonti.svg' },
	{ id: 'shkendija', name: 'KF Shkëndija', league: '1. MFL', country: 'Maqedoni', tier: 13, lat: 42.0, lng: 20.97, colors: ['#004b23', '#ffffff'], initials: 'SH', minRep: 22, minOvr: 60, logoUrl: '/logos/shkendija.svg' },
	{ id: 'shkupi', name: 'KF Shkupi', league: '1. MFL', country: 'Maqedoni', tier: 13, lat: 41.998, lng: 21.425, colors: ['#003049', '#d62828'], initials: 'SK', minRep: 22, minOvr: 60, logoUrl: '/logos/shkupi.svg' },

	// Mali i Zi · Bosnje
	{ id: 'buducnost', name: 'FK Budućnost', league: '1. CFL', country: 'Mali i Zi', tier: 14, lat: 42.28, lng: 18.84, colors: ['#003049', '#ffffff'], initials: 'BU', minRep: 21, minOvr: 59, logoUrl: '/logos/buducnost.svg' },
	{ id: 'zrinjski', name: 'HŠK Zrinjski', league: 'Premijer Liga', country: 'Bosnje', tier: 14, lat: 43.34, lng: 17.81, colors: ['#6a040f', '#ffffff'], initials: 'ZR', minRep: 21, minOvr: 59, logoUrl: '/logos/zrinjski.svg' },
	{ id: 'sarajevo', name: 'FK Sarajevo', league: 'Premijer Liga', country: 'Bosnje', tier: 14, lat: 43.856, lng: 18.413, colors: ['#6a040f', '#ffffff'], initials: 'SA', minRep: 22, minOvr: 60, logoUrl: '/logos/sarajevo.svg' },

	// Zvicër
	{ id: 'delemont', name: 'SR Delémont', league: 'Promotion League', country: 'Zvicër', tier: 15, lat: 47.365, lng: 7.345, colors: ['#003049', '#ffd60a'], initials: 'SD', minRep: 24, minOvr: 62, logoUrl: '/logos/delemont.svg' },
	{ id: 'xamax', name: 'Neuchâtel Xamax', league: 'Challenge League', country: 'Zvicër', tier: 16, lat: 47.0, lng: 6.93, colors: ['#000000', '#ffffff'], initials: 'XA', minRep: 28, minOvr: 65, logoUrl: '/logos/xamax.svg' },
	{ id: 'wil', name: 'FC Wil 1900', league: 'Challenge League', country: 'Zvicër', tier: 16, lat: 47.465, lng: 9.045, colors: ['#004b23', '#ffffff'], initials: 'WI', minRep: 27, minOvr: 64, logoUrl: '/logos/wil.svg' },

	// Rumani
	{ id: 'petrolul', name: 'FC Petrolul Ploiești', league: 'Liga II', country: 'Rumani', tier: 17, lat: 44.94, lng: 26.022, colors: ['#004b23', '#ffd60a'], initials: 'PE', minRep: 25, minOvr: 63, logoUrl: '/logos/petrolul.svg' },
	{ id: 'uta-arad', name: 'UTA Arad', league: 'Liga I', country: 'Rumani', tier: 18, lat: 46.171, lng: 21.312, colors: ['#6a040f', '#ffffff'], initials: 'UT', minRep: 26, minOvr: 64, logoUrl: '/logos/uta-arad.svg' },
	{ id: 'arges', name: 'FC Argeș Pitești', league: 'Liga I', country: 'Rumani', tier: 18, lat: 44.856, lng: 24.869, colors: ['#6a040f', '#ffffff'], initials: 'AR', minRep: 26, minOvr: 64, logoUrl: '/logos/arges.svg' },

	// Kroaci — Druga NL / HNL
	{ id: 'rijeka', name: 'HNK Rijeka', league: 'Druga NL', country: 'Kroaci', tier: 19, lat: 45.327, lng: 14.442, colors: ['#6a040f', '#ffffff'], initials: 'RI', minRep: 27, minOvr: 64, logoUrl: '/logos/rijeka.svg' },
	{ id: 'lokomotiva', name: 'NK Lokomotiva', league: 'HNL', country: 'Kroaci', tier: 20, lat: 45.815, lng: 15.982, colors: ['#004b23', '#ffffff'], initials: 'LO', minRep: 28, minOvr: 65, logoUrl: '/logos/lokomotiva.svg' },
	{ id: 'slaven', name: 'NK Slaven Belupo', league: 'HNL', country: 'Kroaci', tier: 20, lat: 45.293, lng: 14.272, colors: ['#003049', '#ffffff'], initials: 'SL', minRep: 29, minOvr: 66, logoUrl: '/logos/slaven.svg' },
	{ id: 'istra', name: 'NK Istra 1961', league: 'HNL', country: 'Kroaci', tier: 20, lat: 45.215, lng: 13.848, colors: ['#ffd60a', '#003049'], initials: 'IS', minRep: 28, minOvr: 65, logoUrl: '/logos/istra.svg' },

	// Austri · Hungari · Bullgari · Sllovaki
	{ id: 'klagenfurt', name: 'Austria Klagenfurt', league: '2. Liga', country: 'Austri', tier: 21, lat: 46.624, lng: 14.305, colors: ['#6a040f', '#ffffff'], initials: 'AK', minRep: 30, minOvr: 67, logoUrl: '/logos/klagenfurt.svg' },
	{ id: 'puskas', name: 'Puskás Akadémia', league: 'NB I', country: 'Hungari', tier: 22, lat: 47.59, lng: 18.83, colors: ['#004b23', '#ffffff'], initials: 'PA', minRep: 32, minOvr: 68, logoUrl: '/logos/puskas.svg' },
	{ id: 'cska-sofia', name: 'CSKA Sofia', league: 'Parva Liga', country: 'Bullgari', tier: 22, lat: 42.697, lng: 23.321, colors: ['#6a040f', '#ffffff'], initials: 'CS', minRep: 34, minOvr: 70, logoUrl: '/logos/cska-sofia.svg' },
	{ id: 'spartak-trnava', name: 'FC Spartak Trnava', league: 'Niké Liga', country: 'Sllovaki', tier: 22, lat: 48.377, lng: 17.588, colors: ['#6a040f', '#ffffff'], initials: 'ST', minRep: 33, minOvr: 69, logoUrl: '/logos/spartak-trnava.svg' },

	// Top HNL / Liga I
	{ id: 'rapid-buc', name: 'Rapid București', league: 'Liga I', country: 'Rumani', tier: 23, lat: 44.426, lng: 26.102, colors: ['#7f0019', '#ffffff'], initials: 'RB', minRep: 35, minOvr: 71, logoUrl: '/logos/rapid-buc.svg' },
	{ id: 'dinamo-zg', name: 'GNK Dinamo Zagreb', league: 'HNL', country: 'Kroaci', tier: 23, lat: 45.818, lng: 15.978, colors: ['#003049', '#0077b6'], initials: 'DZ', minRep: 35, minOvr: 72, logoUrl: '/logos/dinamo-zg.svg' },

	// Danimarkë · Belgjikë · Poloni
	{ id: 'brondby', name: 'Brøndby IF', league: 'Superliga', country: 'Danimarkë', tier: 24, lat: 55.644, lng: 12.417, colors: ['#004b23', '#ffd60a'], initials: 'BR', minRep: 36, minOvr: 72, logoUrl: '/logos/brondby.svg' },
	{ id: 'gent', name: 'KAA Gent', league: 'Pro League', country: 'Belgjikë', tier: 25, lat: 51.054, lng: 3.717, colors: ['#004b23', '#ffffff'], initials: 'GE', minRep: 38, minOvr: 74, logoUrl: '/logos/gent.svg' },
	{ id: 'lech', name: 'Lech Poznań', league: 'Ekstraklasa', country: 'Poloni', tier: 25, lat: 52.408, lng: 16.934, colors: ['#003049', '#0077b6'], initials: 'LP', minRep: 38, minOvr: 74, logoUrl: '/logos/lech.svg' },

	// Top 5 — mes
	{ id: 'lecce', name: 'US Lecce', league: 'Serie A', country: 'Itali', tier: 26, lat: 40.352, lng: 18.172, colors: ['#ffd60a', '#6a040f'], initials: 'LE', minRep: 40, minOvr: 76, logoUrl: '/logos/lecce.svg' },
	{ id: 'augsburg', name: 'FC Augsburg', league: 'Bundesliga', country: 'Gjermani', tier: 26, lat: 48.371, lng: 10.898, colors: ['#6a040f', '#0077b6'], initials: 'AU', minRep: 40, minOvr: 76, logoUrl: '/logos/augsburg.svg' },
	{ id: 'getafe', name: 'Getafe CF', league: 'La Liga', country: 'Spanjë', tier: 26, lat: 40.306, lng: -3.732, colors: ['#003049', '#0077b6'], initials: 'GF', minRep: 40, minOvr: 76, logoUrl: '/logos/getafe.svg' },

	// Top 5 — i madh
	{ id: 'napoli', name: 'SSC Napoli', league: 'Serie A', country: 'Itali', tier: 27, lat: 40.828, lng: 14.193, colors: ['#0077b6', '#ffffff'], initials: 'NA', minRep: 42, minOvr: 78, logoUrl: '/logos/napoli.svg' },
	{ id: 'leverkusen', name: 'Bayer Leverkusen', league: 'Bundesliga', country: 'Gjermani', tier: 27, lat: 51.030, lng: 6.984, colors: ['#6a040f', '#ffffff'], initials: 'BL', minRep: 43, minOvr: 79, logoUrl: '/logos/leverkusen.svg' },
	{ id: 'sevilla', name: 'Sevilla FC', league: 'La Liga', country: 'Spanjë', tier: 27, lat: 37.384, lng: -5.970, colors: ['#ffffff', '#6a040f'], initials: 'SE', minRep: 42, minOvr: 78, logoUrl: '/logos/sevilla.svg' },

	// Legjendë (event i rrallë — tier 28)
	{ id: 'inter', name: 'FC Internazionale', league: 'Serie A', country: 'Itali', tier: 28, lat: 45.478, lng: 9.124, colors: ['#003049', '#0077b6'], initials: 'IN', minRep: 45, minOvr: 82, logoUrl: '/logos/inter.svg' },
	{ id: 'milan', name: 'AC Milan', league: 'Serie A', country: 'Itali', tier: 28, lat: 45.478, lng: 9.124, colors: ['#6a040f', '#ffffff'], initials: 'MI', minRep: 45, minOvr: 82, logoUrl: '/logos/milan.svg' },
	{ id: 'dortmund', name: 'Borussia Dortmund', league: 'Bundesliga', country: 'Gjermani', tier: 28, lat: 51.493, lng: 7.451, colors: ['#ffd60a', '#ffffff'], initials: 'DO', minRep: 45, minOvr: 82, logoUrl: '/logos/dortmund.svg' }
];

export const clubById = Object.fromEntries(CLUBS.map((c) => [c.id, c])) as Record<string, ClubDefinition>;

export function getTierLabel(tier: number): string {
	if (tier <= 0) return 'SHF / Rinia';
	if (tier <= 2) return 'Seleksion / TDS';
	if (tier <= 3) return 'Liga e Tretë';
	if (tier <= 4) return 'Liga e Dytë';
	if (tier <= 5) return 'Liga e Parë';
	if (tier <= 8) return 'Superliga e Kosovës';
	if (tier <= 9) return 'Kategoria e Dytë (AL)';
	if (tier <= 11) return 'Kategoria Superiore';
	if (tier <= 12) return '2. MFL Maqedoni';
	if (tier <= 13) return '1. MFL Maqedoni';
	if (tier <= 14) return 'Ballkan (ME/BA)';
	if (tier <= 16) return 'Liga zvicerane';
	if (tier <= 18) return 'Liga rumane';
	if (tier <= 20) return 'HNL Kroaci';
	if (tier <= 21) return '2. Liga Austri';
	if (tier <= 22) return 'Liga mes-EU';
	if (tier <= 23) return 'HNL / Liga I top';
	if (tier <= 24) return 'Superliga DK';
	if (tier <= 25) return 'BE / PL';
	if (tier <= 26) return 'Top 5 (mes)';
	if (tier <= 27) return 'Top 5 (i madh)';
	return 'Legjendë';
}
