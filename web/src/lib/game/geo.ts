export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
	const R = 6371;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
	return (deg * Math.PI) / 180;
}

/** Normalize Kosovo coords to SVG viewBox 0–100 */
export function toMapCoords(lat: number, lng: number): { x: number; y: number } {
	const x = ((lng - 20.0) / (21.8 - 20.0)) * 100;
	const y = ((42.95 - lat) / (42.95 - 41.85)) * 100;
	return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

export interface MapBounds {
	minLat: number;
	maxLat: number;
	minLng: number;
	maxLng: number;
}

const KOSOVO_BOUNDS: MapBounds = { minLat: 41.85, maxLat: 43.0, minLng: 20.0, maxLng: 21.85 };
const BALKAN_BOUNDS: MapBounds = { minLat: 39.5, maxLat: 46.5, minLng: 13.0, maxLng: 29.0 };
const EUROPE_BOUNDS: MapBounds = { minLat: 35.0, maxLat: 58.0, minLng: -8.0, maxLng: 32.0 };

export function boundsFromPoints(
	points: { lat: number; lng: number }[],
	pad = 0.6
): MapBounds {
	if (points.length === 0) return KOSOVO_BOUNDS;
	const lats = points.map((p) => p.lat);
	const lngs = points.map((p) => p.lng);
	return {
		minLat: Math.min(...lats) - pad,
		maxLat: Math.max(...lats) + pad,
		minLng: Math.min(...lngs) - pad,
		maxLng: Math.max(...lngs) + pad
	};
}

export function careerMapViewport(maxTier: number, points: { lat: number; lng: number }[]): MapBounds {
	if (maxTier >= 19) return EUROPE_BOUNDS;
	if (maxTier >= 10) return BALKAN_BOUNDS;
	if (points.length <= 1) return KOSOVO_BOUNDS;
	return boundsFromPoints(points, maxTier >= 8 ? 0.9 : 0.5);
}

export function boundsCenter(bounds: MapBounds): [number, number] {
	return [(bounds.minLng + bounds.maxLng) / 2, (bounds.minLat + bounds.maxLat) / 2];
}

/** Quadratic arc for transfer route animation */
export function arcCoordinates(
	from: [number, number],
	to: [number, number],
	steps = 48
): [number, number][] {
	const midLng = (from[0] + to[0]) / 2;
	const midLat = (from[1] + to[1]) / 2;
	const dist = Math.hypot(to[0] - from[0], to[1] - from[1]);
	const ctrlLat = midLat + dist * 0.18;
	const ctrlLng = midLng - dist * 0.05;
	const coords: [number, number][] = [];
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const lng = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * ctrlLng + t * t * to[0];
		const lat = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * ctrlLat + t * t * to[1];
		coords.push([lng, lat]);
	}
	return coords;
}

export function transferBounds(
	from: [number, number],
	to: [number, number],
	abroad: boolean
): MapBounds {
	const pad = abroad ? 2.5 : 0.45;
	return boundsFromPoints([{ lat: from[1], lng: from[0] }, { lat: to[1], lng: to[0] }], pad);
}
