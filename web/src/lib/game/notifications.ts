import type { MahallaSave } from '$lib/game/types';

export interface GameNotification {
	id: string;
	type: 'offer' | 'rival' | 'friend' | 'national' | 'media' | 'milestone';
	title: string;
	body: string;
	urgent?: boolean;
}

export function buildNotifications(save: MahallaSave, offerCount: number): GameNotification[] {
	const notes: GameNotification[] = [];

	if (offerCount > 0) {
		notes.push({
			id: 'offers',
			type: 'offer',
			title: 'Merkato',
			body: `${offerCount} oferta po presin përgjigjen tënde.`,
			urgent: true
		});
	}

	if (save.rivalOvr > save.player.ovr) {
		notes.push({
			id: 'rival-ahead',
			type: 'rival',
			title: save.rivalName,
			body: 'Rivali yt po kalon para teje këtë sezon.'
		});
	}

	if (save.friendOvr > save.player.ovr + 2) {
		notes.push({
			id: 'friend-ahead',
			type: 'friend',
			title: save.shfFriendName,
			body: 'Shoku yt nga SHF po shkëlqen — motivohu.'
		});
	}

	if (save.nationalCaps > 0 && save.nationalLevel !== 'none') {
		notes.push({
			id: 'national',
			type: 'national',
			title: 'Dardanët',
			body: `${save.nationalLevel} · ${save.nationalCaps} ndeshje`
		});
	}

	if (save.player.reputation >= 20) {
		notes.push({
			id: 'media',
			type: 'media',
			title: 'Media',
			body: 'Emri yt qarkullon në gazeta sportive.'
		});
	}

	return notes.slice(0, 4);
}
