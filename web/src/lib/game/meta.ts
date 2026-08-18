import { MUNICIPALITIES } from '$lib/data/municipalities';
import type { Gender, Position } from '$lib/game/types';
import { MALE_NAMES, FEMALE_NAMES } from '$lib/game/names';
import { SeededRng } from '$lib/game/rng';

export interface LegacyDefinition {
	id: string;
	name: string;
	description: string;
	buff: string;
	debuff: string;
	unlockScore: number;
	startOvr?: number;
	startRep?: number;
	startMorale?: number;
	immuneFlags?: string[];
}

export const LEGACIES: LegacyDefinition[] = [
	{
		id: 'lagje',
		name: 'Djali i lagjes',
		description: 'Lagjja të njeh — scoutët lokalë të vëzhgojnë herët.',
		buff: '+5 reputacion fillestar',
		debuff: 'Motivim -3 kur transferohesh jashtë Kosovës',
		unlockScore: 80,
		startRep: 5
	},
	{
		id: 'shkolle',
		name: 'Ylli i shkollës',
		description: 'Play-Off Nacional të la gjurmë — fillon më i fortë.',
		buff: '+2 OVR fillestar',
		debuff: 'Presion i lartë — -5 morale në sezonin e parë',
		unlockScore: 130,
		startOvr: 2,
		startMorale: -5
	},
	{
		id: 'pamposhtur',
		name: 'I mësuar',
		description: 'Agjentët e rremë nuk të mashtrojnë më.',
		buff: 'Imun ndaj mashtrimit të agjentit',
		debuff: '-3 reputacion fillestar',
		unlockScore: 170,
		startRep: -3,
		immuneFlags: ['scammed']
	},
	{
		id: 'eksport',
		name: 'Eksportues',
		description: 'Ke provuar jashtë — e di si funksionon merkato.',
		buff: '+8 reputacion · oferta jashtë më herët',
		debuff: 'Klube kosovare të duan më pak',
		unlockScore: 220,
		startRep: 8
	}
];

export interface PantheonEntry {
	id: string;
	playerName: string;
	score: number;
	badge: string;
	seed: string;
	municipalityId: string;
	completedAt: number;
	duelMode?: boolean;
}

export interface MahallaMeta {
	version: 1;
	pantheon: PantheonEntry[];
	unlockedLegacies: string[];
	equippedLegacies: string[];
}

export interface DuelConfig {
	seed: string;
	municipalityId: string;
	gender: Gender;
	position: Position;
	rivalName: string;
}

const POSITIONS: Position[] = ['GK', 'DF', 'MF', 'FW'];

export function emptyMeta(): MahallaMeta {
	return { version: 1, pantheon: [], unlockedLegacies: [], equippedLegacies: [] };
}

export function getUrlParams(): { daily: string | null; duel: string | null } {
	if (typeof window === 'undefined') return { daily: null, duel: null };
	const p = new URLSearchParams(window.location.search);
	return { daily: p.get('daily'), duel: p.get('duel') ?? p.get('d') };
}

export function getDuelConfig(duelId: string): DuelConfig {
	const rng = new SeededRng(`duel-setup-${duelId}`);
	const municipality = MUNICIPALITIES[rng.int(0, MUNICIPALITIES.length - 1)];
	const gender: Gender = rng.chance(0.5) ? 'male' : 'female';
	const position = rng.pick(POSITIONS);
	const names = gender === 'male' ? MALE_NAMES : FEMALE_NAMES;
	const rivalName = names[rng.int(0, names.length - 1)];
	return {
		seed: `duel-${duelId}`,
		municipalityId: municipality.id,
		gender,
		position,
		rivalName
	};
}

export function getDailySeedValue(): string {
	const { daily } = getUrlParams();
	if (daily) return `daily-${daily}`;
	const now = new Date();
	const key = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
	return `daily-${key}`;
}

export function buildDuelLink(seed: string): string {
	if (typeof window === 'undefined') return '';
	const duelId = seed.replace(/^duel-/, '');
	const url = new URL(window.location.href);
	url.searchParams.set('duel', duelId);
	url.searchParams.delete('daily');
	url.searchParams.delete('d');
	return url.toString();
}

export function unlockLegaciesFromScore(meta: MahallaMeta, score: number): string[] {
	const newly: string[] = [];
	for (const leg of LEGACIES) {
		if (score >= leg.unlockScore && !meta.unlockedLegacies.includes(leg.id)) {
			meta.unlockedLegacies.push(leg.id);
			newly.push(leg.id);
		}
	}
	return newly;
}

export function applyLegaciesToPlayer(
	player: { ovr: number; reputation: number; morale: number },
	legacyIds: string[]
): void {
	for (const id of legacyIds) {
		const leg = LEGACIES.find((l) => l.id === id);
		if (!leg) continue;
		if (leg.startOvr) player.ovr += leg.startOvr;
		if (leg.startRep) player.reputation += leg.startRep;
		if (leg.startMorale) player.morale = Math.max(10, Math.min(99, player.morale + leg.startMorale));
	}
}

export function getEquippedLegacyFlags(legacyIds: string[]): string[] {
	const flags: string[] = [];
	for (const id of legacyIds) {
		const leg = LEGACIES.find((l) => l.id === id);
		if (leg?.immuneFlags) flags.push(...leg.immuneFlags.map((f) => `immune:${f}`));
	}
	return flags;
}

export function legacyById(id: string): LegacyDefinition | undefined {
	return LEGACIES.find((l) => l.id === id);
}
