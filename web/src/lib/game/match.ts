import type { MahallaSave, SeasonRecap } from '$lib/game/types';
import { SeededRng } from '$lib/game/rng';

export interface MatchMoment {
	homeTeam: string;
	awayTeam: string;
	homeScore: number;
	awayScore: number;
	minute: number;
	playerGoals: number;
	playerAssists: number;
	won: boolean;
	drew: boolean;
	keyMoment: string;
	skills: { pace: number; technique: number; mentality: number };
}

const OPPONENTS = [
	'Rivali lokal',
	'Skuadra e LRF-së',
	'Derbi i qytetit',
	'Kampioni i grupit',
	'Skuadra e fortë'
];

export function generateMatchMoment(
	save: MahallaSave,
	recap: SeasonRecap,
	rng: SeededRng
): MatchMoment {
	const playerGoals = recap.goals;
	const playerAssists = recap.assists;
	const attackScore = playerGoals * 2 + playerAssists + Math.floor(save.player.form / 25);
	const oppGoals = Math.max(0, rng.int(0, 2 + Math.floor(save.rivalOvr / 30)));
	const homeScore = Math.max(oppGoals, attackScore + rng.int(0, 1));
	const awayScore = oppGoals;
	const won = homeScore > awayScore;
	const drew = homeScore === awayScore;

	let keyMoment: string;
	if (playerGoals >= 2) keyMoment = `${save.player.name} shkëlqen — ${playerGoals} gola në ndeshje.`;
	else if (playerAssists >= 2) keyMoment = `Asistimi yt hapi mbrojtjen — ${playerAssists} asistime.`;
	else if (won) keyMoment = `Fitore e rëndësishme për ${save.currentClub.name}.`;
	else if (drew) keyMoment = 'Barazim — sezoni vazhdon pa humbje.';
	else keyMoment = 'Humbje e vështirë — duhet të punosh më shumë.';

	return {
		homeTeam: save.currentClub.name,
		awayTeam: rng.pick([save.rivalName, ...OPPONENTS]),
		homeScore,
		awayScore,
		minute: rng.int(68, 88),
		playerGoals,
		playerAssists,
		won,
		drew,
		keyMoment,
		skills: {
			pace: Math.min(95, save.player.form + rng.int(-5, 10)),
			technique: Math.min(95, save.player.ovr + rng.int(-8, 5)),
			mentality: Math.min(95, save.player.morale + rng.int(-10, 5))
		}
	};
}

export function applyMatchChoice(
	player: MahallaSave['player'],
	choiceId: string
): void {
	if (choiceId === 'attack') player.morale = Math.min(99, player.morale + 3);
	if (choiceId === 'control') player.form = Math.min(99, player.form + 4);
	if (choiceId === 'defend') player.reputation = Math.max(0, player.reputation + 1);
}
