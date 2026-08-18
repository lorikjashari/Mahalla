import { MUNICIPALITIES } from '$lib/data/municipalities';

export function municipalitiesFeatureCollection(selectedId?: string) {
	const hasSelection = !!selectedId;
	return {
		type: 'FeatureCollection' as const,
		features: MUNICIPALITIES.map((m) => ({
			type: 'Feature' as const,
			properties: {
				id: m.id,
				name: m.name,
				selected: m.id === selectedId,
				dimmed: hasSelection && m.id !== selectedId
			},
			geometry: {
				type: 'Point' as const,
				coordinates: [m.lng, m.lat]
			}
		}))
	};
}
