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
