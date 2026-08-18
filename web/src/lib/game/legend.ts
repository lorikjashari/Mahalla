import type { MahallaSave } from '$lib/game/types';
import { getTierLabel } from '$lib/data/clubs';

export function computeLegendScore(save: MahallaSave): number {
	const p = save.player;
	const tier = save.currentTier ?? 0;
	return Math.round(
		p.ovr * 2.5 +
			p.goals * 1.2 +
			p.assists * 0.8 +
			p.reputation * 3 +
			(save.nationalCaps ?? 0) * 12 +
			tier * 4 +
			save.careerHistory.length * 6
	);
}

export function getLegendBadge(save: MahallaSave): string {
	const score = computeLegendScore(save);
	const tier = save.currentTier ?? 0;
	if (score >= 350) return 'Legjendë e Mahallës';
	if (tier >= 23) return 'Ylli i Evropës';
	if (tier >= 18) return 'Eksport i suksesshëm';
	if (tier >= 10) return 'Aventurier ballkanik';
	if (tier >= 8) return 'Kampion i Kosovës';
	if (tier >= 5) return 'Profesionist';
	return 'Talen i lagjes';
}

export function getRivalVerdict(save: MahallaSave): string {
	const diff = save.player.ovr - save.rivalOvr;
	if (diff >= 8) return `${save.rivalName} mbetet në hije tënde.`;
	if (diff >= 2) return `Ti e kalove ${save.rivalName} — pak, por mjaft.`;
	if (diff >= -2) return `Ti dhe ${save.rivalName} — barazim i brezit.`;
	return `${save.rivalName} e fitoi duelin e gjeneratës.`;
}

export function formatTier(tier: number): string {
	return getTierLabel(tier);
}
