import { CLUBS, clubById, type ClubDefinition } from '$lib/data/clubs';
import type { MahallaSave, TransferOffer } from '$lib/game/types';
import { haversineKm } from '$lib/game/geo';
import { SeededRng } from '$lib/game/rng';

export { clubById };

function clubToOffer(club: ClubDefinition, save: MahallaSave, rng: SeededRng): TransferOffer {
	const home = save.currentClub;
	const distanceKm = Math.round(haversineKm(home.lat, home.lng, club.lat, club.lng) * 10) / 10;
	const p = save.player;

	return {
		id: `offer-${club.id}-${save.player.season}`,
		clubId: club.id,
		clubName: club.name,
		leagueName: `${club.league} (${club.country})`,
		tier: club.tier,
		role:
			p.ovr >= (club.minOvr ?? 50) + 3
				? 'Starter i mundshëm'
				: p.ovr >= (club.minOvr ?? 50)
					? 'Rotacion'
					: 'Rezervë / stërvitje',
		minutesEstimate:
			p.ovr >= (club.minOvr ?? 50) + 3 ? rng.int(55, 75) : rng.int(25, 45),
		ambition:
			club.tier >= 18
				? 'Evropë / titull'
				: club.tier >= 10
					? 'Kampionat / Evropë'
					: club.tier >= 7
						? 'Superliga / UECL'
						: 'Promovim',
		lat: club.lat,
		lng: club.lng,
		distanceKm
	};
}

export function getCurrentTier(save: MahallaSave): number {
	if (save.currentTier != null) return save.currentTier;
	const last = save.careerHistory.at(-1);
	return last?.leagueTier ?? 0;
}

export function generateOffers(save: MahallaSave, rng: SeededRng): TransferOffer[] {
	if (save.player.age < 16) return [];

	const currentTier = getCurrentTier(save);
	const p = save.player;
	const home = save.currentClub;
	const offers: TransferOffer[] = [];

	const eligible = CLUBS.filter((club) => {
		if (club.tier <= currentTier) return false;
		if (club.tier > currentTier + 2) return false;
		if (club.minRep != null && p.reputation < club.minRep) return false;
		if (club.minOvr != null && p.ovr < club.minOvr - 5) return false;
		if (club.country !== 'Kosovë' && p.age < 18) return false;
		if (club.country !== 'Kosovë' && p.reputation < 15) return false;
		// Hapi i parë senior: vetëm Kosovë (Liga e Tretë → Parë)
		if (currentTier === 0 && p.age <= 17 && club.country !== 'Kosovë') return false;
		if (currentTier === 0 && p.age <= 17 && club.tier > 5) return false;
		return true;
	});

	const shuffled = [...eligible].sort(() => rng.next() - 0.5);

	for (const club of shuffled) {
		if (!rng.chance(0.45 + p.reputation * 0.01)) continue;
		offers.push(clubToOffer(club, save, rng));
		if (offers.length >= 3) break;
	}

	if (offers.length === 0 && currentTier < 5 && p.age >= 16) {
		const fallback = clubById['uniteti'] ?? clubById['dinamo-ferizaj'];
		if (fallback) offers.push(clubToOffer(fallback, save, rng));
	}

	return offers.sort((a, b) => a.tier - b.tier);
}

export function clubDefinitionToCurrentClub(club: ClubDefinition) {
	return {
		id: club.id,
		name: club.name,
		municipalityId: '',
		lat: club.lat,
		lng: club.lng,
		lrf: 'prishtine' as const,
		colors: club.colors,
		initials: club.initials,
		logoUrl: club.logoUrl
	};
}
