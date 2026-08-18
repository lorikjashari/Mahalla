<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import GameButton from '$lib/ui/GameButton.svelte';
	import type { TransferAnim } from '$lib/game/transfer';
	import { arcCoordinates, boundsCenter, transferBounds } from '$lib/game/geo';
	import { createMahallaMap } from '$lib/map/initMap';
	import { emitFeedback } from '$lib/game/feedback';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		transfer: TransferAnim;
		ondismiss: () => void;
	}

	let { transfer, ondismiss }: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let progress = $state(0);
	let mapFailed = $state(false);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let map: any = null;
	let raf = 0;

	const from: [number, number] = $derived([transfer.fromLng, transfer.fromLat]);
	const to: [number, number] = $derived([transfer.toLng, transfer.toLat]);
	const arc = $derived(arcCoordinates(from, to));
	const bounds = $derived(transferBounds(from, to, transfer.abroad));

	function arcSlice(t: number) {
		const count = Math.max(2, Math.ceil(arc.length * t));
		return arc.slice(0, count);
	}

	function animateLine() {
		if (!map || mapFailed) return;
		const tick = () => {
			progress = Math.min(1, progress + 0.025);
			const route = map.getSource('transfer-route');
			route?.setData({
				type: 'Feature',
				properties: {},
				geometry: { type: 'LineString', coordinates: arcSlice(progress) }
			});
			if (progress < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
	}

	onMount(async () => {
		emitFeedback('transfer');
		if (!container) return;
		try {
			map = await createMahallaMap({
				container,
				center: boundsCenter(bounds),
				zoom: 7,
				interactive: false
			});

			map.on('load', () => {
				map.addSource('transfer-route', {
					type: 'geojson',
					data: {
						type: 'Feature',
						properties: {},
						geometry: { type: 'LineString', coordinates: arcSlice(0) }
					}
				});
				map.addLayer({
					id: 'transfer-line',
					type: 'line',
					source: 'transfer-route',
					paint: {
						'line-color': '#d4a853',
						'line-width': 3,
						'line-opacity': 0.95
					}
				});

				map.addSource('transfer-points', {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: [
							{
								type: 'Feature',
								properties: { kind: 'from' },
								geometry: { type: 'Point', coordinates: from }
							},
							{
								type: 'Feature',
								properties: { kind: 'to' },
								geometry: { type: 'Point', coordinates: to }
							}
						]
					}
				});
				map.addLayer({
					id: 'transfer-from',
					type: 'circle',
					source: 'transfer-points',
					filter: ['==', ['get', 'kind'], 'from'],
					paint: {
						'circle-radius': 7,
						'circle-color': '#4a6358',
						'circle-stroke-width': 2,
						'circle-stroke-color': '#0f1419'
					}
				});
				map.addLayer({
					id: 'transfer-to',
					type: 'circle',
					source: 'transfer-points',
					filter: ['==', ['get', 'kind'], 'to'],
					paint: {
						'circle-radius': 9,
						'circle-color': '#d4a853',
						'circle-stroke-width': 2,
						'circle-stroke-color': '#0f1419'
					}
				});

				map.fitBounds(
					[
						[bounds.minLng, bounds.minLat],
						[bounds.maxLng, bounds.maxLat]
					],
					{ padding: 40, duration: 800, maxZoom: transfer.abroad ? 5 : 9 }
				);

				setTimeout(animateLine, 400);
			});
		} catch {
			mapFailed = true;
			progress = 1;
		}
	});

	onDestroy(() => {
		cancelAnimationFrame(raf);
		map?.remove();
		map = null;
	});
</script>

<div class="transfer-overlay" role="dialog" aria-modal="true">
	<div class="map-layer" bind:this={container} role="img" aria-label={sq.travel}></div>
	<div class="map-vignette"></div>

	<div class="transfer-content">
		<p class="kicker">{sq.transferCinematic}</p>

		<div class="club-route">
			<div class="club-block">
				<p class="club-label">{sq.from}</p>
				<p class="display-xl">{transfer.from}</p>
			</div>
			<div class="route-arrow" aria-hidden="true">↓</div>
			<div class="club-block club-block--dest">
				<p class="club-label">{sq.to}</p>
				<p class="display-xl">{transfer.to}</p>
			</div>
		</div>

		<p class="stat-huge">{transfer.km}<span class="stat-huge-label">{sq.km}</span></p>

		<p class="body-story body-story--wide">
			{#if transfer.abroad}
				{sq.transferAbroad}
			{:else}
				Ti po largohesh nga shtëpia. {sq.transferTagline}
			{/if}
		</p>

		{#if mapFailed}
			<p class="map-note">{sq.mapFallback}</p>
		{/if}

		<GameButton variant="gold" size="lg" full onclick={ondismiss} disabled={progress < 0.35}>
			{sq.transferContinue}
		</GameButton>
	</div>
</div>

<style>
	.transfer-overlay {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: var(--canvas-deep);
		display: flex;
		flex-direction: column;
		animation: sceneIn var(--duration-cinematic) var(--ease-cine);
	}

	.map-layer {
		position: absolute;
		inset: 0;
		opacity: 0.55;
	}

	.map-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(180deg, rgba(5, 7, 8, 0.75) 0%, transparent 28%, transparent 45%, rgba(5, 7, 8, 0.95) 100%),
			linear-gradient(90deg, rgba(5, 7, 8, 0.5), transparent 25%, transparent 75%, rgba(5, 7, 8, 0.5));
	}

	.transfer-content {
		position: relative;
		z-index: 2;
		margin-top: auto;
		padding: var(--space-6) var(--viewport-pad) calc(var(--space-8) + env(safe-area-inset-bottom));
		display: grid;
		gap: var(--space-4);
		max-width: 520px;
	}

	.club-route {
		display: grid;
		gap: var(--space-2);
	}

	.club-block {
		display: grid;
		gap: 0.15rem;
	}

	.club-block--dest .display-xl {
		color: var(--gold);
	}

	.club-label {
		margin: 0;
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--muted);
	}

	.route-arrow {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		color: var(--gold-dim);
		line-height: 1;
		padding: var(--space-1) 0;
	}

	.map-note {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--muted);
	}

	@media (min-width: 900px) {
		.transfer-content {
			max-width: 560px;
			padding-left: var(--space-10);
		}
	}
</style>
