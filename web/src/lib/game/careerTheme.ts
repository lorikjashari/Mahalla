import type { MahallaSave } from '$lib/game/types';
import { getCurrentTier } from '$lib/game/mercato';

export type CareerStageTheme = 'mahalla' | 'kosovo' | 'balkan' | 'europe' | 'elite';

export function getCareerStageTheme(save: MahallaSave | null): CareerStageTheme {
	if (!save) return 'mahalla';
	const tier = getCurrentTier(save);
	const age = save.player.age;

	if (age <= 12 && tier <= 0) return 'mahalla';
	if (tier <= 8) return 'kosovo';
	if (tier <= 14) return 'balkan';
	if (tier <= 25) return 'europe';
	return 'elite';
}

export function stageLabel(theme: CareerStageTheme): string {
	switch (theme) {
		case 'mahalla':
			return 'Mahalla';
		case 'kosovo':
			return 'Kosovë';
		case 'balkan':
			return 'Ballkan';
		case 'europe':
			return 'Evropë';
		case 'elite':
			return 'Elite';
	}
}
