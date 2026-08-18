import type { MahallaSave } from '$lib/game/types';

export interface MilestoneDef {
	id: string;
	title: string;
	body: string;
	icon: string;
}

export const MILESTONES: Record<string, MilestoneDef> = {
	'first-pro': {
		id: 'first-pro',
		title: 'KONTRATË PROFESIONALE',
		body: 'E firmove të parën. Rruga nga mahalla te fusha e madhe fillon këtu.',
		icon: '📝'
	},
	'abroad-first': {
		id: 'abroad-first',
		title: 'HAPI JASHTË VENDIT',
		body: 'Larg shtëpisë — adaptim i ri, ëndërr e re.',
		icon: '✈️'
	},
	'hajvali-u15': {
		id: 'hajvali-u15',
		title: 'PLAY-OFF U15 — HAJVALI',
		body: 'Scoutët e FFK-së të panë. Kombëtarja në horizont.',
		icon: '🇽🇰'
	},
	'hajvali-u17': {
		id: 'hajvali-u17',
		title: 'PLAY-OFF U17 — HAJVALI',
		body: 'Niveli tjetër. Konkurrencë e fortë — por ti je aty.',
		icon: '🇽🇰'
	},
	'derby-hero': {
		id: 'derby-hero',
		title: 'HERO I DERBYT',
		body: 'Lagjja do të të kujtojë këtë ndeshje.',
		icon: '🔥'
	},
	'national-first': {
		id: 'national-first',
		title: 'THIRRJE KOMBËTARE',
		body: 'Dardanët thërrasin. Fanella e Kosovës — nder i madh.',
		icon: '🇽🇰'
	},
	'superliga-top': {
		id: 'superliga-top',
		title: 'SUPERLIGA TOP',
		body: 'Luaj te klube elitare të Kosovës. Evropa në horizont.',
		icon: '🏆'
	},
	'europe': {
		id: 'europe',
		title: 'EVROPË',
		body: 'E kalove kufirin. Tani fillon loja e madhe.',
		icon: '🌍'
	}
};

export function detectNewMilestones(save: MahallaSave, alreadyShown: string[]): MilestoneDef[] {
	const found: MilestoneDef[] = [];

	for (const flag of save.flags) {
		if (MILESTONES[flag] && !alreadyShown.includes(flag)) found.push(MILESTONES[flag]);
	}

	if (save.nationalCaps === 1 && !alreadyShown.includes('national-first')) {
		found.push(MILESTONES['national-first']);
	}

	if (save.currentTier >= 8 && !alreadyShown.includes('superliga-top')) {
		found.push(MILESTONES['superliga-top']);
	}

	if (save.currentTier >= 15 && !alreadyShown.includes('europe')) {
		found.push(MILESTONES['europe']);
	}

	return found;
}
