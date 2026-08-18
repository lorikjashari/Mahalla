import type { ShfAcademy } from '$lib/game/types';

export const SHF_ACADEMIES: ShfAcademy[] = [
	{ id: 'presingu', name: 'SHF Presingu', municipalityId: 'viti', lat: 42.3028, lng: 21.3772, lrf: 'gjilan', colors: ['#1b4332', '#d4a853'], initials: 'PR', supportsGirls: true, logoUrl: '/logos/presingu.svg' },
	{ id: 'kosova-viti', name: 'SHF Kosova-Viti', municipalityId: 'viti', lat: 42.305, lng: 21.38, lrf: 'gjilan', colors: ['#003049', '#fcbf49'], initials: 'KV', logoUrl: '/logos/kosova-viti.svg' },
	{ id: 'kika', name: 'SHF Kika', municipalityId: 'gjilan', lat: 42.47, lng: 21.47, lrf: 'gjilan', colors: ['#023047', '#ffb703'], initials: 'KI' },
	{ id: 'galaksia', name: 'SHF Galaksia', municipalityId: 'gjilan', lat: 42.465, lng: 21.46, lrf: 'gjilan', colors: ['#240046', '#9d4edd'], initials: 'GA' },
	{ id: 'drita-shf', name: 'SHF Drita', municipalityId: 'gjilan', lat: 42.4647, lng: 21.4669, lrf: 'gjilan', colors: ['#005f73', '#ee9b00'], initials: 'DR' },
	{ id: 'don-bosko', name: 'SHF Don Bosko', municipalityId: 'gjilan', lat: 42.462, lng: 21.468, lrf: 'gjilan', colors: ['#003566', '#ffd60a'], initials: 'DB' },
	{ id: 'yjet-06', name: 'SHF Yjet 06', municipalityId: 'gjilan', lat: 42.468, lng: 21.472, lrf: 'gjilan', colors: ['#03045e', '#90e0ef'], initials: 'YJ' },
	{ id: 'arberia', name: 'SHF Arbëria', municipalityId: 'gjilan', lat: 42.461, lng: 21.465, lrf: 'gjilan', colors: ['#386641', '#a7c957'], initials: 'AR' },
	{ id: 'dardana', name: 'SHF Dardana 10', municipalityId: 'kamenica', lat: 42.5756, lng: 21.5814, lrf: 'gjilan', colors: ['#582f0e', '#dda15e'], initials: 'DA' },
	{ id: 'kurda', name: 'SHF Kurda', municipalityId: 'fushe-kosove', lat: 42.6375, lng: 21.0942, lrf: 'prishtine', colors: ['#004b23', '#ccff33'], initials: 'KU' },
	{ id: '2-korriku', name: 'SHF 2 Korriku', municipalityId: 'prishtine', lat: 42.66, lng: 21.16, lrf: 'prishtine', colors: ['#780000', '#ffba08'], initials: '2K' },
	{ id: 'talenti', name: 'SHF Talenti 05', municipalityId: 'ferizaj', lat: 42.37, lng: 21.155, lrf: 'ferizaj', colors: ['#03071e', '#f48c06'], initials: 'TA' },
	{ id: 'lumi', name: 'SHF Lumi', municipalityId: 'shtime', lat: 42.4458, lng: 21.0381, lrf: 'ferizaj', colors: ['#0077b6', '#caf0f8'], initials: 'LU' },
	{ id: 'bardhi', name: 'SHF Bardhi', municipalityId: 'mitrovice', lat: 42.88, lng: 20.88, lrf: 'mitrovice', colors: ['#14213d', '#fca311'], initials: 'BA' },
	{ id: 'viciana', name: 'SHF Viciana', municipalityId: 'vushtrri', lat: 42.8222, lng: 20.9667, lrf: 'mitrovice', colors: ['#283618', '#bc6c25'], initials: 'VI' },
	{ id: 'llapi-academy', name: 'KF Llapi Academy', municipalityId: 'podujeva', lat: 42.9117, lng: 21.1917, lrf: 'prishtine', colors: ['#003049', '#eae2b7'], initials: 'LL' },
	{ id: 'besa-peje', name: 'FC Besa Pejë Academy', municipalityId: 'peje', lat: 42.6603, lng: 20.2917, lrf: 'peje', colors: ['#006d77', '#83c5be'], initials: 'BP' },
	{ id: 'vellaznimi', name: 'FC Vëllaznimi Academy', municipalityId: 'gjakove', lat: 42.3769, lng: 20.4319, lrf: 'gjakove', colors: ['#004e98', '#ff6700'], initials: 'VË' },
	{ id: 'malisheva-academy', name: 'FC Malisheva Academy', municipalityId: 'malisheve', lat: 42.4828, lng: 20.7461, lrf: 'prizren', colors: ['#2b9348', '#e9c46a'], initials: 'MA' },
	{ id: 'drenica-academy', name: 'KSF Drenica Academy', municipalityId: 'skenderaj', lat: 42.7475, lng: 20.7881, lrf: 'mitrovice', colors: ['#003049', '#d62828'], initials: 'DR' },
	{ id: 'suhareka-shf', name: 'SHF Suhareka', municipalityId: 'suhareke', lat: 42.3622, lng: 20.8333, lrf: 'prizren', colors: ['#606c38', '#fefae0'], initials: 'SU' },
	{ id: 'leke-dukagjini', name: 'SHF Lekë Dukagjini', municipalityId: 'prizren', lat: 42.2128, lng: 20.7392, lrf: 'prizren', colors: ['#03045e', '#ade8f4'], initials: 'LD' },
	{ id: 'rahoveci-academy', name: 'FC Rahoveci Academy', municipalityId: 'rahovec', lat: 42.4008, lng: 20.6569, lrf: 'gjakove', colors: ['#6a040f', '#ffba08'], initials: 'RA' }
];

export const shfById = Object.fromEntries(SHF_ACADEMIES.map((s) => [s.id, s])) as Record<
	string,
	ShfAcademy
>;

export const shfByMunicipality = SHF_ACADEMIES.reduce<Record<string, ShfAcademy[]>>((acc, shf) => {
	(acc[shf.municipalityId] ??= []).push(shf);
	return acc;
}, {});
