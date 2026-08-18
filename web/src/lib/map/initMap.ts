import { getMapStyle, getJourneyMapStyle, isNetworkOnline } from '$lib/map/mapStyle';
import { addKosovoOverlay } from '$lib/map/mapLayers';
import { municipalitiesFeatureCollection } from '$lib/map/municipalitiesGeo';
import { municipalityById } from '$lib/data/municipalities';

export async function loadMapLibre() {
	const maplibregl = await import('maplibre-gl');
	await import('maplibre-gl/dist/maplibre-gl.css');
	return maplibregl;
}

interface CreateMapOptions {
	container: HTMLElement;
	center: [number, number];
	zoom?: number;
	interactive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createMahallaMap(options: CreateMapOptions): Promise<any> {
	const maplibregl = await loadMapLibre();
	let offline = !isNetworkOnline();

	const map = new maplibregl.Map({
		container: options.container,
		style: getMapStyle(!offline),
		center: options.center,
		zoom: options.zoom ?? 7,
		interactive: options.interactive ?? true,
		attributionControl: false
	});

	map.on('error', (e: { error?: { message?: string } }) => {
		if (offline) return;
		const msg = e.error?.message ?? '';
		if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
			offline = true;
			map.setStyle(getMapStyle(false));
		}
	});

	map.on('load', () => {
		if (!offline) addKosovoOverlay(map);
	});

	return map;
}

const KOSOVO_BOUNDS: [[number, number], [number, number]] = [
	[20.0, 41.82],
	[21.85, 43.05]
];

export interface JourneyMapHandle {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	map: any;
	flyToMunicipality: (id: string, sheetOpen?: boolean) => void;
	syncSelection: (selectedId?: string) => void;
	resize: () => void;
	destroy: () => void;
}

interface JourneyMapOptions {
	container: HTMLElement;
	selectedId?: string;
	onselect: (id: string) => void;
}

export async function createJourneyMap(options: JourneyMapOptions): Promise<JourneyMapHandle> {
	const maplibregl = await loadMapLibre();
	let offline = !isNetworkOnline();

	const map = new maplibregl.Map({
		container: options.container,
		style: getJourneyMapStyle(!offline),
		center: [20.9, 42.55],
		zoom: 7.5,
		minZoom: 6.8,
		maxZoom: 12.5,
		maxBounds: [
			[19.75, 41.65],
			[22.05, 43.2]
		],
		attributionControl: false,
		interactive: true,
		fadeDuration: 300
	});

	function addMunicipalityLayers(selectedId?: string) {
		if (!map.getSource('municipalities')) {
			map.addSource('municipalities', {
				type: 'geojson',
				data: municipalitiesFeatureCollection(selectedId)
			});

			map.addLayer({
				id: 'muni-dim',
				type: 'circle',
				source: 'municipalities',
				filter: ['==', ['get', 'dimmed'], true],
				paint: {
					'circle-radius': 4,
					'circle-color': '#3d4a46',
					'circle-opacity': 0.35,
					'circle-stroke-width': 0
				}
			});

			map.addLayer({
				id: 'muni-points',
				type: 'circle',
				source: 'municipalities',
				filter: ['all', ['!', ['get', 'selected']], ['!', ['get', 'dimmed']]],
				paint: {
					'circle-radius': 5.5,
					'circle-color': '#6a8278',
					'circle-opacity': 0.85,
					'circle-stroke-width': 1.5,
					'circle-stroke-color': '#0a0d10'
				}
			});

			map.addLayer({
				id: 'muni-glow',
				type: 'circle',
				source: 'municipalities',
				filter: ['==', ['get', 'selected'], true],
				paint: {
					'circle-radius': 28,
					'circle-color': '#d4a853',
					'circle-opacity': 0.14,
					'circle-blur': 0.55
				}
			});

			map.addLayer({
				id: 'muni-selected',
				type: 'circle',
				source: 'municipalities',
				filter: ['==', ['get', 'selected'], true],
				paint: {
					'circle-radius': 8,
					'circle-color': '#d4a853',
					'circle-stroke-width': 2.5,
					'circle-stroke-color': '#0a0d10'
				}
			});

			for (const layer of ['muni-dim', 'muni-points', 'muni-selected', 'muni-glow']) {
				map.on('click', layer, (e: { features?: { properties?: { id?: string } }[] }) => {
					const id = e.features?.[0]?.properties?.id;
					if (id) options.onselect(id);
				});
				map.on('mouseenter', layer, () => {
					map.getCanvas().style.cursor = 'pointer';
				});
				map.on('mouseleave', layer, () => {
					map.getCanvas().style.cursor = '';
				});
			}
		}
	}

	function syncSelection(selectedId?: string) {
		const src = map.getSource('municipalities') as { setData?: (d: unknown) => void } | undefined;
		src?.setData?.(municipalitiesFeatureCollection(selectedId));
	}

	function flyToMunicipality(id: string, sheetOpen = false) {
		const m = municipalityById[id];
		if (!m) return;
		map.flyTo({
			center: [m.lng, m.lat],
			zoom: sheetOpen ? 10.4 : 9.6,
			duration: 1400,
			essential: true,
			padding: { top: 120, bottom: sheetOpen ? 300 : 160, left: 56, right: 56 }
		});
	}

	map.on('error', (e: { error?: { message?: string } }) => {
		if (offline) return;
		const msg = e.error?.message ?? '';
		if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
			offline = true;
			map.setStyle(getJourneyMapStyle(false));
		}
	});

	await new Promise<void>((resolve, reject) => {
		const onFail = () => reject(new Error('Map failed to load'));
		map.once('load', () => {
			try {
				addMunicipalityLayers(options.selectedId);
				syncSelection(options.selectedId);
				map.fitBounds(KOSOVO_BOUNDS, {
					padding: { top: 100, bottom: 140, left: 40, right: 40 },
					duration: 0,
					maxZoom: 8.2
				});
				map.resize();
				if (options.selectedId) flyToMunicipality(options.selectedId, true);
				resolve();
			} catch (err) {
				reject(err);
			}
		});
		map.once('error', onFail);
	});

	return {
		map,
		flyToMunicipality,
		syncSelection,
		resize: () => map.resize(),
		destroy: () => map.remove()
	};
}
