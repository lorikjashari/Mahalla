<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import GameButton from '$lib/ui/GameButton.svelte';
	import { MUNICIPALITIES, municipalityById } from '$lib/data/municipalities';
	import { assignAcademy, getLrfLabel } from '$lib/game/academy';
	import { toMapCoords } from '$lib/game/geo';
	import { KOSOVO_OUTLINE } from '$lib/map/kosovoGeo';
	import { createJourneyMap, type JourneyMapHandle } from '$lib/map/initMap';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		selectedId?: string;
		onselect: (id: string) => void;
		onconfirm?: () => void;
	}

	let { selectedId = '', onselect, onconfirm }: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let mapReady = $state(false);
	let mapFailed = $state(false);

	let handle: JourneyMapHandle | null = null;
	let resizeObserver: ResizeObserver | null = null;

	const selected = $derived(selectedId ? municipalityById[selectedId] : null);
	const preview = $derived(selectedId ? assignAcademy(selectedId, 'male') : null);

	const fallbackPoints = $derived(
		MUNICIPALITIES.map((m) => ({ ...m, ...toMapCoords(m.lat, m.lng) }))
	);

	const outlinePath = $derived(
		KOSOVO_OUTLINE.geometry.coordinates[0]
			.map(([lng, lat], i) => {
				const { x, y } = toMapCoords(lat, lng);
				return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
			})
			.join(' ') + ' Z'
	);

	onMount(async () => {
		if (!container) return;
		try {
			handle = await createJourneyMap({
				container,
				selectedId,
				onselect
			});
			mapReady = true;

			resizeObserver = new ResizeObserver(() => handle?.resize());
			resizeObserver.observe(container);
		} catch {
			mapFailed = true;
		}
	});

	$effect(() => {
		if (!handle || !mapReady) return;
		handle.syncSelection(selectedId);
		if (selectedId) handle.flyToMunicipality(selectedId, !!selected);
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
		handle?.destroy();
		handle = null;
	});
</script>

<section class="origin-scene" aria-label={sq.chooseCity}>
	<div class="map-stage" bind:this={container} class:is-ready={mapReady}></div>
	<div class="origin-vignette"></div>

	{#if !mapReady && !mapFailed}
		<div class="map-loading" aria-live="polite">
			<span class="pulse-line"></span>
			<p>{sq.loadingMap}</p>
		</div>
	{/if}

	<header class="origin-head">
		<span class="step-badge">01</span>
		<p class="kicker">{sq.fromWhere}</p>
		<h1 class="display-xl">{sq.chooseCity}</h1>
	</header>

	{#if mapFailed}
		<div class="fallback-map" role="group" aria-label={sq.chooseCity}>
			<svg viewBox="0 0 100 72" class="fallback-svg">
				<path d={outlinePath} class="land-shape" />
				<path d={outlinePath} class="land-border" />
				{#each fallbackPoints as m (m.id)}
					<g
						role="button"
						tabindex="0"
						class:selected={selectedId === m.id}
						onclick={() => onselect(m.id)}
						onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onselect(m.id)}
					>
						<circle cx={m.x} cy={m.y} r={selectedId === m.id ? 2.8 : 1.8} />
					</g>
				{/each}
			</svg>
			<p class="fallback-note">{sq.mapFallback}</p>
		</div>
	{/if}

	{#if selected && preview}
		<div class="origin-sheet">
			<div class="sheet-panel">
				<p class="kicker kicker--green">{getLrfLabel(selected.lrf)}</p>
				<h2 class="sheet-title">{selected.name}</h2>
				<p class="sheet-meta">
					{preview.academy.name} · {preview.distanceKm} {sq.km}
				</p>
				<p class="sheet-story">"{sq.mapOriginStory}"</p>
				<GameButton variant="gold" size="lg" full onclick={() => onconfirm?.()}>
					{sq.mapStartHere}
				</GameButton>
			</div>
		</div>
	{:else}
		<div class="origin-sheet origin-sheet--hint">
			<p class="map-hint">{sq.chooseCityHint}</p>
		</div>
	{/if}
</section>

<style>
	.origin-scene {
		position: relative;
		flex: 1;
		min-height: min(84dvh, 780px);
		margin: calc(var(--space-4) * -1) calc(var(--viewport-pad) * -1)
			calc(var(--space-6) * -1);
		width: calc(100% + var(--viewport-pad) + var(--viewport-pad-r));
		overflow: hidden;
		border-radius: 0;
	}

	.map-stage {
		position: absolute;
		inset: 0;
		z-index: 0;
		opacity: 0;
		transition: opacity var(--duration-cinematic) var(--ease-out);
	}

	.map-stage.is-ready {
		opacity: 1;
	}

	.map-stage :global(.maplibregl-canvas) {
		outline: none;
	}

	.origin-vignette {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background:
			linear-gradient(180deg, rgba(5, 7, 8, 0.72) 0%, rgba(5, 7, 8, 0.08) 22%, transparent 38%, transparent 55%, rgba(5, 7, 8, 0.88) 78%, rgba(5, 7, 8, 0.98) 100%),
			linear-gradient(90deg, rgba(5, 7, 8, 0.55), transparent 22%, transparent 78%, rgba(5, 7, 8, 0.55));
	}

	.map-loading {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: var(--space-3);
		background: var(--canvas-deep);
	}

	.map-loading p {
		margin: 0;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--muted);
	}

	.pulse-line {
		width: 48px;
		height: 1px;
		background: var(--gold);
		opacity: 0.5;
		animation: pulse 1.4s ease-in-out infinite;
	}

	.origin-head {
		position: absolute;
		top: var(--space-3);
		left: var(--viewport-pad);
		right: var(--space-8);
		z-index: 3;
		max-width: 16ch;
		pointer-events: none;
	}

	.step-badge {
		display: inline-block;
		margin-bottom: var(--space-2);
		font-family: var(--font-display);
		font-size: var(--text-sm);
		color: var(--gold);
		letter-spacing: 0.16em;
	}

	.origin-sheet {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 3;
	}

	.origin-sheet--hint {
		padding-bottom: calc(var(--space-8) + env(safe-area-inset-bottom));
	}

	.map-hint {
		margin: 0;
		padding: var(--space-4) var(--viewport-pad);
		text-align: center;
		color: var(--text-dim);
		font-size: var(--text-sm);
		line-height: 1.55;
		max-width: 34ch;
		margin-inline: auto;
	}

	.fallback-map {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: var(--space-4);
		padding: var(--space-8);
		background: var(--canvas-deep);
	}

	.fallback-svg {
		width: min(100%, 440px);
		height: auto;
	}

	.land-shape {
		fill: rgba(20, 26, 24, 0.95);
	}

	.land-border {
		fill: none;
		stroke: rgba(64, 145, 108, 0.5);
		stroke-width: 0.35;
	}

	.fallback-svg circle {
		fill: var(--accent-bright);
		cursor: pointer;
		opacity: 0.7;
	}

	.fallback-svg g.selected circle {
		fill: var(--gold);
		opacity: 1;
	}

	.fallback-note {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--muted);
		text-align: center;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.2;
			transform: scaleX(0.5);
		}
		50% {
			opacity: 1;
			transform: scaleX(1);
		}
	}

	@media (min-width: 900px) {
		.origin-scene {
			min-height: min(86dvh, 820px);
		}

		.origin-head {
			top: var(--space-8);
			left: var(--space-8);
			max-width: 20ch;
		}

		.origin-head .display-xl {
			font-size: clamp(3rem, 4vw, 4.5rem);
		}

		.sheet-panel {
			max-width: 480px;
			margin-inline: auto;
		}
	}
</style>
