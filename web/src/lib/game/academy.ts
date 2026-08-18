import { SHF_ACADEMIES, shfById, shfByMunicipality } from '$lib/data/shf';
import { municipalityById } from '$lib/data/municipalities';
import { haversineKm } from '$lib/game/geo';
import type { AcademyAssignment, Gender, Municipality } from '$lib/game/types';

export function assignAcademy(municipalityId: string, gender: Gender = 'male'): AcademyAssignment {
	const home = municipalityById[municipalityId];
	if (!home) throw new Error(`Komuna e panjohur: ${municipalityId}`);

	let local = shfByMunicipality[municipalityId] ?? [];

	if (gender === 'female') {
		const girls = local.filter((s) => s.supportsGirls);
		if (girls.length > 0) local = girls;
	}

	if (local.length > 0) {
		const academy = local[0];
		return {
			type: 'local',
			academy,
			distanceKm: haversineKm(home.lat, home.lng, academy.lat, academy.lng),
			homeMunicipality: home
		};
	}

	let nearest = SHF_ACADEMIES[0];
	let minKm = Infinity;

	for (const shf of SHF_ACADEMIES) {
		if (gender === 'female' && !shf.supportsGirls) continue;
		const km = haversineKm(home.lat, home.lng, shf.lat, shf.lng);
		if (km < minKm) {
			minKm = km;
			nearest = shf;
		}
	}

	return {
		type: 'nearest',
		academy: nearest,
		distanceKm: Math.round(minKm * 10) / 10,
		homeMunicipality: home
	};
}

export function getLrfLabel(lrf: Municipality['lrf']): string {
	const labels: Record<Municipality['lrf'], string> = {
		prishtine: 'LRF Prishtinë',
		ferizaj: 'LRF Ferizaj',
		gjilan: 'LRF Gjilan',
		mitrovice: 'LRF Mitrovicë',
		peje: 'LRF Pejë',
		gjakove: 'LRF Gjakovë',
		prizren: 'LRF Prizren'
	};
	return labels[lrf];
}

export function assignmentFromShf(shfId: string): AcademyAssignment {
	const academy = shfById[shfId];
	if (!academy) throw new Error(`SHF e panjohur: ${shfId}`);

	const home = municipalityById[academy.municipalityId];
	if (!home) throw new Error(`Komuna e panjohur: ${academy.municipalityId}`);

	const local = shfByMunicipality[academy.municipalityId] ?? [];
	const isLocal = local.some((s) => s.id === shfId);

	return {
		type: isLocal ? 'local' : 'nearest',
		academy,
		distanceKm: Math.round(haversineKm(home.lat, home.lng, academy.lat, academy.lng) * 10) / 10,
		homeMunicipality: home
	};
}
