import { SHF_ACADEMIES } from '$lib/data/shf';

export function shfFeatureCollection(selectedShfId?: string) {
	const hasSelection = !!selectedShfId;
	return {
		type: 'FeatureCollection' as const,
		features: SHF_ACADEMIES.map((s) => ({
			type: 'Feature' as const,
			properties: {
				id: s.id,
				name: s.name,
				initials: s.initials,
				municipalityId: s.municipalityId,
				selected: s.id === selectedShfId,
				dimmed: hasSelection && s.id !== selectedShfId
			},
			geometry: {
				type: 'Point' as const,
				coordinates: [s.lng, s.lat]
			}
		}))
	};
}
