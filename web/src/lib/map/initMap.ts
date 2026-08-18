import { getMapStyle, getJourneyMapStyle, isNetworkOnline } from '$lib/map/mapStyle';
import { addKosovoOverlay } from '$lib/map/mapLayers';
import { shfFeatureCollection } from '$lib/map/shfGeo';
import { SHF_ACADEMIES, shfById } from '$lib/data/shf';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapLibrePromise: Promise<any> | null = null;

/** Preload MapLibre once — call early from layout or map screen */
export function preloadMapLibre() {
	if (typeof window === 'undefined') return;
	if (!mapLibrePromise) {
		mapLibrePromise = import('maplibre-gl').then(async (maplibregl) => {
			await import('maplibre-gl/dist/maplibre-gl.css');
			return maplibregl;
		});
	}
}

export async function loadMapLibre() {
	preloadMapLibre();
	if (mapLibrePromise) return mapLibrePromise;
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
function findNearestTeam(map: any, point: { x: number; y: number }, maxPx = 52) {
	let best: { id: string; dist: number } | undefined;
	for (const team of SHF_ACADEMIES) {
		const projected = map.project([team.lng, team.lat]);
		const dist = Math.hypot(projected.x - point.x, projected.y - point.y);
		if (dist <= maxPx && (!best || dist < best.dist)) {
			best = { id: team.id, dist };
		}
	}
	return best?.id;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createMahallaMap(options: CreateMapOptions): Promise<any> {
	const maplibregl = await loadMapLibre();
	const online = isNetworkOnline();

	const map = new maplibregl.Map({
		container: options.container,
		style: getMapStyle(online),
		center: options.center,
		zoom: options.zoom ?? 7,
		interactive: options.interactive ?? true,
		attributionControl: false
	});

	map.on('load', () => {
		if (online) addKosovoOverlay(map);
	});

	return map;
}

const KOSOVO_BOUNDS: [[number, number], [number, number]] = [
	[20.0, 41.82],
	[21.85, 43.05]
];

const TEAM_PICK_LAYERS = [
	'shf-hit',
	'shf-halo',
	'shf-dots',
	'shf-dim',
	'shf-glow',
	'shf-selected'
];

export interface JourneyMapHandle {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	map: any;
	flyToTeam: (id: string, sheetOpen?: boolean) => void;
	flyToOverview: () => void;
	syncSelection: (selectedShfId?: string) => void;
	resize: () => void;
	destroy: () => void;
}

interface JourneyMapOptions {
	container: HTMLElement;
	selectedShfId?: string;
	onselect: (shfId: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createJourneyMap(options: JourneyMapOptions): Promise<JourneyMapHandle> {
	const maplibregl = await loadMapLibre();
	const online = isNetworkOnline();

	const map = new maplibregl.Map({
		container: options.container,
		style: getJourneyMapStyle(online),
		center: [20.9, 42.55],
		zoom: 7.5,
		minZoom: 6.8,
		maxZoom: 13,
		maxBounds: [
			[19.75, 41.65],
			[22.05, 43.2]
		],
		attributionControl: false,
		interactive: true,
		fadeDuration: 200
	});

	function flyToTeam(id: string, sheetOpen = false) {
		const team = shfById[id];
		if (!team) return;
		map.flyTo({
			center: [team.lng, team.lat],
			zoom: sheetOpen ? 11.4 : 10.6,
			pitch: sheetOpen ? 30 : 20,
			duration: 1400,
			essential: true,
			curve: 1.45,
			padding: { top: 120, bottom: sheetOpen ? 320 : 160, left: 56, right: 56 }
		});
	}

	function flyToOverview() {
		map.flyTo({
			center: [20.9, 42.55],
			zoom: 7.5,
			pitch: 0,
			bearing: 0,
			duration: 1200,
			essential: true,
			padding: { top: 100, bottom: 140, left: 40, right: 40 }
		});
	}

	const selectFromEvent = (e: {
		point: { x: number; y: number };
		features?: { properties?: { id?: string } }[];
	}) => {
		const layerHit = e.features?.find((f) => f.properties?.id);
		const id = layerHit?.properties?.id ?? findNearestTeam(map, e.point);
		if (id) {
			options.onselect(id);
			flyToTeam(id, true);
		}
	};

	map.on('click', (e: { point: { x: number; y: number }; features?: { properties?: { id?: string } }[] }) => {
		const layerFeatures = e.features?.filter((f) =>
			TEAM_PICK_LAYERS.includes(String((f as { layer?: { id?: string } }).layer?.id))
		);
		if (layerFeatures?.length) {
			selectFromEvent({ ...e, features: layerFeatures });
			return;
		}
		const id = findNearestTeam(map, e.point);
		if (id) {
			options.onselect(id);
			flyToTeam(id, true);
		}
	});

	function addTeamLayers() {
		if (map.getSource('shf-teams')) return;

		map.addSource('shf-teams', {
			type: 'geojson',
			data: shfFeatureCollection(options.selectedShfId)
		});

		map.addLayer({
			id: 'shf-hit',
			type: 'circle',
			source: 'shf-teams',
			paint: {
				'circle-radius': ['interpolate', ['linear'], ['zoom'], 6.5, 20, 9, 26, 11, 30],
				'circle-color': '#000000',
				'circle-opacity': 0.01
			}
		});

		map.addLayer({
			id: 'shf-halo',
			type: 'circle',
			source: 'shf-teams',
			filter: ['all', ['!', ['get', 'selected']], ['!', ['get', 'dimmed']]],
			paint: {
				'circle-radius': ['interpolate', ['linear'], ['zoom'], 6.5, 10, 9, 13, 11, 16],
				'circle-color': '#95d5b2',
				'circle-opacity': 0.45,
				'circle-blur': 0.2
			}
		});

		map.addLayer({
			id: 'shf-dots',
			type: 'circle',
			source: 'shf-teams',
			filter: ['all', ['!', ['get', 'selected']], ['!', ['get', 'dimmed']]],
			paint: {
				'circle-radius': ['interpolate', ['linear'], ['zoom'], 6.5, 6, 9, 8, 11, 10],
				'circle-color': '#b7e4c7',
				'circle-opacity': 1,
				'circle-stroke-width': 2,
				'circle-stroke-color': '#ffffff'
			}
		});

		map.addLayer({
			id: 'shf-dim',
			type: 'circle',
			source: 'shf-teams',
			filter: ['==', ['get', 'dimmed'], true],
			paint: {
				'circle-radius': ['interpolate', ['linear'], ['zoom'], 6.5, 4, 9, 5, 11, 6],
				'circle-color': '#52796f',
				'circle-opacity': 0.55,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#1b4332'
			}
		});

		map.addLayer({
			id: 'shf-glow',
			type: 'circle',
			source: 'shf-teams',
			filter: ['==', ['get', 'selected'], true],
			paint: {
				'circle-radius': ['interpolate', ['linear'], ['zoom'], 6.5, 24, 9, 34, 11, 42],
				'circle-color': '#d4a853',
				'circle-opacity': 0.35,
				'circle-blur': 0.25
			}
		});

		map.addLayer({
			id: 'shf-selected',
			type: 'circle',
			source: 'shf-teams',
			filter: ['==', ['get', 'selected'], true],
			paint: {
				'circle-radius': ['interpolate', ['linear'], ['zoom'], 6.5, 8, 9, 10, 11, 12],
				'circle-color': '#d4a853',
				'circle-opacity': 1,
				'circle-stroke-width': 3,
				'circle-stroke-color': '#ffffff'
			}
		});

		for (const layer of TEAM_PICK_LAYERS) {
			map.on('mouseenter', layer, () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			map.on('mouseleave', layer, () => {
				map.getCanvas().style.cursor = '';
			});
		}

		options.container.dataset.teamsReady = 'true';
	}

	function syncSelection(selectedShfId?: string) {
		const src = map.getSource('shf-teams') as { setData?: (d: unknown) => void } | undefined;
		src?.setData?.(shfFeatureCollection(selectedShfId));
	}

	function finishSetup(selectedShfId?: string) {
		if (map.getSource('shf-teams')) {
			syncSelection(selectedShfId);
			return true;
		}

		try {
			addTeamLayers();
			syncSelection(selectedShfId);
			map.fitBounds(KOSOVO_BOUNDS, {
				padding: { top: 100, bottom: 140, left: 40, right: 40 },
				duration: 1400,
				maxZoom: 8.2
			});
			map.resize();
			if (selectedShfId) window.setTimeout(() => flyToTeam(selectedShfId, true), 300);
			return true;
		} catch (err) {
			console.error('Team layer setup failed:', err);
			return false;
		}
	}

	const trySetup = () => finishSetup(options.selectedShfId);

	map.once('load', trySetup);
	map.once('idle', trySetup);
	map.on('styledata', trySetup);

	for (const delay of [0, 250, 750, 1500, 3000, 5000]) {
		window.setTimeout(trySetup, delay);
	}

	return {
		map,
		flyToTeam,
		flyToOverview,
		syncSelection,
		resize: () => map.resize(),
		destroy: () => map.remove()
	};
}
