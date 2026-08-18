/** Simplified Kosovo outline for offline map overlay */
export const KOSOVO_OUTLINE = {
	type: 'Feature' as const,
	properties: { name: 'Kosova' },
	geometry: {
		type: 'Polygon' as const,
		coordinates: [
			[
				[20.05, 41.88],
				[20.02, 42.15],
				[20.08, 42.45],
				[20.15, 42.72],
				[20.35, 42.95],
				[20.72, 43.02],
				[21.05, 42.98],
				[21.45, 42.88],
				[21.78, 42.72],
				[21.82, 42.45],
				[21.75, 42.15],
				[21.55, 41.92],
				[21.15, 41.86],
				[20.65, 41.85],
				[20.05, 41.88]
			]
		]
	}
};
