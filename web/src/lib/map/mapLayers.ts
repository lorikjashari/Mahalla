import { KOSOVO_OUTLINE } from '$lib/map/kosovoGeo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addKosovoOverlay(map: any): void {
	if (map.getSource('kosovo-outline')) return;
	map.addSource('kosovo-outline', {
		type: 'geojson',
		data: KOSOVO_OUTLINE
	});
	map.addLayer({
		id: 'kosovo-fill',
		type: 'fill',
		source: 'kosovo-outline',
		paint: {
			'fill-color': '#2d6a4f',
			'fill-opacity': 0.08
		}
	});
	map.addLayer({
		id: 'kosovo-border',
		type: 'line',
		source: 'kosovo-outline',
		paint: {
			'line-color': '#2d6a4f',
			'line-width': 1.5,
			'line-opacity': 0.45
		}
	});
}
