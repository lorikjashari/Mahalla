<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ClubHistoryEntry } from '$lib/game/types';
	import { boundsCenter, careerMapViewport, toMapCoords } from '$lib/game/geo';
	import { createMahallaMap } from '$lib/map/initMap';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		history: ClubHistoryEntry[];
		currentId?: string;
	}

	let { history, currentId }: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let mapFailed = $state(false);
	let mapReady = $state(false);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let map: any = null;

	const maxTier = $derived(Math.max(0, ...history.map((h) => h.leagueTier)));
	const bounds = $derived(careerMapViewport(maxTier, history));
	const routeGeoJson = $derived({
		type: 'Feature' as const,
		properties: {},
		geometry: {
			type: 'LineString' as const,
			coordinates: history.map((h) => [h.lng, h.lat])
		}
	});
	const pinsGeoJson = $derived({
		type: 'FeatureCollection' as const,
		features: history.map((h, i) => ({
			type: 'Feature' as const,
			properties: {
				clubId: h.clubId,
				clubName: h.clubName,
				age: h.age,
				current: h.clubId === currentId,
				index: i
			},
			geometry: { type: 'Point' as const, coordinates: [h.lng, h.lat] }
		}))
	});

	const milestones = $derived.by(() => {
		const items: { age: number; label: string }[] = [];
		const first = history[0];
		if (first) items.push({ age: first.age, label: 'SHF' });
		const contract = history.find((h) => h.age >= 16);
		if (contract) items.push({ age: contract.age, label: 'KONTRATË' });
		const superliga = history.find((h) => h.leagueTier >= 10);
		if (superliga) items.push({ age: superliga.age, label: 'SUPERLIGA' });
		const europe = history.find((h) => h.leagueTier >= 19);
		if (europe) items.push({ age: europe.age, label: 'EVROPË' });
		const peak = history.reduce((best, h) => (h.age > best.age ? h : best), history[0]);
		if (peak && peak.age >= 24) items.push({ age: peak.age, label: 'ELITE' });
		return items;
	});

	function syncSources() {
		if (!map || !mapReady) return;
		const route = map.getSource('route');
		const pins = map.getSource('pins');
		route?.setData(routeGeoJson);
		pins?.setData(pinsGeoJson);
		map.fitBounds(
			[
				[bounds.minLng, bounds.minLat],
				[bounds.maxLng, bounds.maxLat]
			],
			{ padding: 36, duration: 900, maxZoom: maxTier >= 19 ? 5 : maxTier >= 10 ? 6 : 9 }
		);
	}

	onMount(async () => {
		if (!container || history.length === 0) return;
		try {
			map = await createMahallaMap({
				container,
				center: boundsCenter(bounds),
				zoom: 7,
				interactive: true
			});

			map.on('load', () => {
				map.addSource('route', { type: 'geojson', data: routeGeoJson });
				map.addLayer({
					id: 'route-line',
					type: 'line',
					source: 'route',
					paint: {
						'line-color': '#d4a853',
						'line-width': 2.5,
						'line-opacity': 0.85,
						'line-dasharray': [2, 1.5]
					}
				});

				map.addSource('pins', { type: 'geojson', data: pinsGeoJson });
				map.addLayer({
					id: 'pin-glow',
					type: 'circle',
					source: 'pins',
					filter: ['==', ['get', 'current'], true],
					paint: {
						'circle-radius': 18,
						'circle-color': '#d4a853',
						'circle-opacity': 0.15,
						'circle-blur': 0.4
					}
				});
				map.addLayer({
					id: 'pin-circle',
					type: 'circle',
					source: 'pins',
					paint: {
						'circle-radius': ['case', ['get', 'current'], 9, 6],
						'circle-color': [
							'case',
							['get', 'current'],
							'#d4a853',
							['==', ['get', 'index'], history.length - 1],
							'#2d6a4f',
							'#4a6358'
						],
						'circle-stroke-width': 2,
						'circle-stroke-color': '#0f1419'
					}
				});

				mapReady = true;
				syncSources();
			});
		} catch {
			mapFailed = true;
		}
	});

	$effect(() => {
		history;
		currentId;
		bounds;
		syncSources();
	});

	onDestroy(() => {
		map?.remove();
		map = null;
	});
</script>

<section class="journey-map" aria-labelledby="journey-title">
	<header class="journey-head">
		<p class="kicker" id="journey-title">{sq.careerMapTitle}</p>
		<p class="region">
			{maxTier >= 19 ? sq.mapEurope : maxTier >= 10 ? sq.mapBalkans : sq.mapKosovo}
		</p>
	</header>

	{#if mapFailed}
		<svg viewBox="0 0 100 55" class="svg-fallback" role="img" aria-label={sq.careerMapTitle}>
			<rect width="100" height="55" class="svg-bg" />
			{#each history as h, i (h.clubId + h.season)}
				{@const p = toMapCoords(h.lat, h.lng)}
				{@const px = (p.x / 100) * 100}
				{@const py = (p.y / 100) * 55}
				<circle cx={px} cy={py} r={h.clubId === currentId ? 2.8 : 2} class:current={h.clubId === currentId} />
			{/each}
		</svg>
	{:else}
		<div class="map-canvas journey-canvas" bind:this={container} role="img" aria-label={sq.careerMapTitle}></div>
	{/if}

	<div class="milestone-rail">
		{#each milestones as m (m.age + m.label)}
			<div class="milestone">
				<span class="milestone-age">{m.age}</span>
				<span class="milestone-label">{m.label}</span>
			</div>
		{/each}
	</div>

	<ol class="club-stops">
		{#each history as h (h.clubId + h.season)}
			<li class:current={h.clubId === currentId}>
				<span class="stop-age">{h.age}</span>
				<div>
					<strong>{h.clubName}</strong>
					<span class="meta">{sq.season} {h.season}</span>
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	.journey-map {
		display: grid;
		gap: var(--space-4);
		padding: var(--space-5) 0;
		animation: sceneIn var(--duration-cinematic) var(--ease-cine);
	}

	.journey-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-3);
	}

	.region {
		margin: 0;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.journey-canvas {
		position: relative;
		width: 100%;
		height: min(38dvh, 320px);
		margin: 0 calc(var(--viewport-pad) * -1);
		width: calc(100% + var(--viewport-pad) + var(--viewport-pad-r));
	}

	:global(.maplibregl-canvas) {
		outline: none;
	}

	.svg-fallback {
		width: 100%;
		height: auto;
	}

	.svg-bg {
		fill: #121a16;
	}

	.svg-fallback circle {
		fill: var(--accent);
	}

	.svg-fallback circle.current {
		fill: var(--gold);
	}

	.milestone-rail {
		display: flex;
		gap: var(--space-5);
		overflow-x: auto;
		padding-bottom: var(--space-2);
		border-top: 1px solid var(--line);
		padding-top: var(--space-4);
	}

	.milestone {
		flex: 0 0 auto;
		display: grid;
		gap: 0.15rem;
	}

	.milestone-age {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		color: var(--gold);
		line-height: 1;
	}

	.milestone-label {
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--muted);
	}

	.club-stops {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-2);
		max-height: 140px;
		overflow-y: auto;
	}

	.club-stops li {
		display: flex;
		gap: var(--space-3);
		align-items: baseline;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--line);
	}

	.club-stops li.current strong {
		color: var(--gold);
	}

	.stop-age {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		color: var(--muted);
		min-width: 2ch;
	}

	.meta {
		display: block;
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
	}
</style>
