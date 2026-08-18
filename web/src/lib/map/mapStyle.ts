import { KOSOVO_OUTLINE } from '$lib/map/kosovoGeo';

/** Online basemap — CARTO dark tiles */
export const MAHALLA_MAP_STYLE_ONLINE = {
	version: 8 as const,
	sources: {
		carto: {
			type: 'raster' as const,
			tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
			tileSize: 256,
			attribution: '&copy; OpenStreetMap &copy; CARTO'
		}
	},
	layers: [
		{
			id: 'carto',
			type: 'raster' as const,
			source: 'carto',
			minzoom: 0,
			maxzoom: 19
		}
	]
};

/** Offline fallback — Kosovo outline only, no external tiles */
export const MAHALLA_MAP_STYLE_OFFLINE = {
	version: 8 as const,
	sources: {
		'kosovo-outline': {
			type: 'geojson' as const,
			data: KOSOVO_OUTLINE
		}
	},
	layers: [
		{
			id: 'bg',
			type: 'background' as const,
			paint: { 'background-color': '#121a16' }
		},
		{
			id: 'kosovo-fill-offline',
			type: 'fill' as const,
			source: 'kosovo-outline',
			paint: {
				'fill-color': '#2d6a4f',
				'fill-opacity': 0.15
			}
		},
		{
			id: 'kosovo-border-offline',
			type: 'line' as const,
			source: 'kosovo-outline',
			paint: {
				'line-color': '#40916c',
				'line-width': 2,
				'line-opacity': 0.6
			}
		}
	]
};

/** @deprecated use getMapStyle() */
export const MAHALLA_MAP_STYLE = MAHALLA_MAP_STYLE_ONLINE;

export function isNetworkOnline(): boolean {
	return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export function getMapStyle(online = isNetworkOnline()) {
	return online ? MAHALLA_MAP_STYLE_ONLINE : MAHALLA_MAP_STYLE_OFFLINE;
}

/** Dark journey map for municipality selection — signature MAHALLA aesthetic */
export const MAHALLA_JOURNEY_MAP_STYLE = {
	version: 8 as const,
	sources: {
		'kosovo-outline': {
			type: 'geojson' as const,
			data: KOSOVO_OUTLINE
		}
	},
	layers: [
		{
			id: 'journey-bg',
			type: 'background' as const,
			paint: { 'background-color': '#0a0d10' }
		},
		{
			id: 'journey-land',
			type: 'fill' as const,
			source: 'kosovo-outline',
			paint: {
				'fill-color': '#141a18',
				'fill-opacity': 1
			}
		},
		{
			id: 'journey-border',
			type: 'line' as const,
			source: 'kosovo-outline',
			paint: {
				'line-color': '#2d6a4f',
				'line-width': 1.2,
				'line-opacity': 0.35
			}
		}
	]
};

export function getJourneyMapStyle(online = isNetworkOnline()) {
	if (!online) return MAHALLA_JOURNEY_MAP_STYLE;
	return {
		version: 8 as const,
		sources: {
			carto: MAHALLA_MAP_STYLE_ONLINE.sources.carto,
			'kosovo-outline': MAHALLA_JOURNEY_MAP_STYLE.sources['kosovo-outline']
		},
		layers: [
			{
				id: 'journey-bg',
				type: 'background' as const,
				paint: { 'background-color': '#060809' }
			},
			{
				id: 'carto-base',
				type: 'raster' as const,
				source: 'carto',
				paint: {
					'raster-opacity': 0.52,
					'raster-saturation': -0.35,
					'raster-contrast': 0.08,
					'raster-brightness-min': 0.05,
					'raster-brightness-max': 0.82
				}
			},
			{
				id: 'journey-vignette',
				type: 'fill' as const,
				source: 'kosovo-outline',
				paint: {
					'fill-color': '#050708',
					'fill-opacity': 0.28
				}
			},
			{
				id: 'journey-border',
				type: 'line' as const,
				source: 'kosovo-outline',
				paint: {
					'line-color': '#40916c',
					'line-width': 1.8,
					'line-opacity': 0.55
				}
			}
		]
	};
}
