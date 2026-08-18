import type { Municipality } from '$lib/game/types';

export const MUNICIPALITIES: Municipality[] = [
	{ id: 'decan', name: 'Deçan', lat: 42.5378, lng: 20.2911, lrf: 'gjakove', population: 27775 },
	{ id: 'dragash', name: 'Dragash', lat: 42.0625, lng: 20.6533, lrf: 'prizren', population: 28896 },
	{ id: 'drenas', name: 'Drenas', lat: 42.6236, lng: 20.8939, lrf: 'prishtine', population: 48079 },
	{ id: 'ferizaj', name: 'Ferizaj', lat: 42.37, lng: 21.155, lrf: 'ferizaj', population: 109255 },
	{ id: 'fushe-kosove', name: 'Fushë Kosovë', lat: 42.6375, lng: 21.0942, lrf: 'prishtine', population: 63949 },
	{ id: 'gjakove', name: 'Gjakovë', lat: 42.3769, lng: 20.4319, lrf: 'gjakove', population: 78699 },
	{ id: 'gjilan', name: 'Gjilan', lat: 42.4647, lng: 21.4669, lrf: 'gjilan', population: 82980 },
	{ id: 'gracanica', name: 'Graçanica', lat: 42.6011, lng: 21.1958, lrf: 'prishtine', population: 18486 },
	{ id: 'han-i-elezit', name: 'Han i Elezit', lat: 42.1475, lng: 21.2992, lrf: 'ferizaj', population: 8533 },
	{ id: 'istog', name: 'Istog', lat: 42.7808, lng: 20.4875, lrf: 'peje', population: 33008 },
	{ id: 'junik', name: 'Junik', lat: 42.4833, lng: 20.2833, lrf: 'gjakove', population: 3943 },
	{ id: 'kacanik', name: 'Kaçanik', lat: 42.2325, lng: 21.2689, lrf: 'ferizaj', population: 27716 },
	{ id: 'kamenica', name: 'Kamenica', lat: 42.5756, lng: 21.5814, lrf: 'gjilan', population: 22868 },
	{ id: 'klina', name: 'Klina', lat: 42.6217, lng: 20.5778, lrf: 'peje', population: 30503 },
	{ id: 'kllokot', name: 'Kllokot', lat: 42.367, lng: 21.383, lrf: 'gjilan', population: 3041 },
	{ id: 'leposaviq', name: 'Leposaviq', lat: 43.104, lng: 20.803, lrf: 'mitrovice', population: 9485 },
	{ id: 'lipjan', name: 'Lipjan', lat: 42.5222, lng: 21.1242, lrf: 'prishtine', population: 55044 },
	{ id: 'malisheve', name: 'Malishevë', lat: 42.4828, lng: 20.7461, lrf: 'prizren', population: 43888 },
	{ id: 'mamusha', name: 'Mamusha', lat: 42.3167, lng: 20.7167, lrf: 'prizren', population: 5607 },
	{ id: 'mitrovice', name: 'Mitrovicë', lat: 42.89, lng: 20.87, lrf: 'mitrovice', population: 64742 },
	{ id: 'mitrovice-veri', name: 'Mitrovicë e Veriut', lat: 42.8947, lng: 20.8656, lrf: 'mitrovice', population: 7920 },
	{ id: 'novoberde', name: 'Novobërda', lat: 42.6014, lng: 21.4261, lrf: 'prishtine', population: 4493 },
	{ id: 'obiliq', name: 'Obiliq', lat: 42.69, lng: 21.0778, lrf: 'prishtine', population: 22815 },
	{ id: 'rahovec', name: 'Rahovec', lat: 42.4008, lng: 20.6569, lrf: 'gjakove', population: 41799 },
	{ id: 'partesh', name: 'Partesh', lat: 42.4019, lng: 21.4336, lrf: 'gjilan', population: 3240 },
	{ id: 'peje', name: 'Peja', lat: 42.6603, lng: 20.2917, lrf: 'peje', population: 82745 },
	{ id: 'podujeva', name: 'Podujeva', lat: 42.9117, lng: 21.1917, lrf: 'prishtine', population: 70975 },
	{ id: 'prishtine', name: 'Prishtinë', lat: 42.6633, lng: 21.1622, lrf: 'prishtine', population: 227466 },
	{ id: 'prizren', name: 'Prizren', lat: 42.2128, lng: 20.7392, lrf: 'prizren', population: 147246 },
	{ id: 'ranillug', name: 'Ranillug', lat: 42.4922, lng: 21.5989, lrf: 'gjilan', population: 2481 },
	{ id: 'skenderaj', name: 'Skenderaj', lat: 42.7475, lng: 20.7881, lrf: 'mitrovice', population: 40664 },
	{ id: 'shtime', name: 'Shtime', lat: 42.4458, lng: 21.0381, lrf: 'ferizaj', population: 24308 },
	{ id: 'shterpce', name: 'Shtërpcë', lat: 42.2347, lng: 21.0244, lrf: 'ferizaj', population: 10771 },
	{ id: 'suhareke', name: 'Suharekë', lat: 42.3622, lng: 20.8333, lrf: 'prizren', population: 45749 },
	{ id: 'viti', name: 'Viti', lat: 42.3028, lng: 21.3772, lrf: 'gjilan', population: 35566 },
	{ id: 'vushtrri', name: 'Vushtrri', lat: 42.8222, lng: 20.9667, lrf: 'mitrovice', population: 61528 },
	{ id: 'zubin-potok', name: 'Zubin Potok', lat: 42.914, lng: 20.69, lrf: 'mitrovice', population: 3385 },
	{ id: 'zvecan', name: 'Zveçan', lat: 42.9075, lng: 20.8403, lrf: 'mitrovice', population: 2867 }
];

export const municipalityById = Object.fromEntries(MUNICIPALITIES.map((m) => [m.id, m])) as Record<
	string,
	Municipality
>;
