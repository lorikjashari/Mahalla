<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import GameButton from '$lib/ui/GameButton.svelte';
	import { assignmentFromShf, getLrfLabel } from '$lib/game/academy';
	import { SHF_ACADEMIES, shfById } from '$lib/data/shf';
	import { municipalityById } from '$lib/data/municipalities';
	import { createJourneyMap, preloadMapLibre, type JourneyMapHandle } from '$lib/map/initMap';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		selectedShfId?: string;
		onselect: (shfId: string) => void;
		onclear?: () => void;
		onconfirm?: () => void;
	}

	let { selectedShfId = '', onselect, onclear, onconfirm }: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let mapReady = $state(false);
	let loading = $state(true);
	let markerPos = $state<Record<string, { x: number; y: number }>>({});

	let handle: JourneyMapHandle | null = null;
	let resizeObserver: ResizeObserver | null = null;
	let detachMapListeners: (() => void) | null = null;

	const selectedTeam = $derived(selectedShfId ? shfById[selectedShfId] : null);
	const home = $derived(selectedTeam ? municipalityById[selectedTeam.municipalityId] : null);
	const preview = $derived(selectedShfId ? assignmentFromShf(selectedShfId) : null);

	function updateMarkerPositions() {
		if (!handle?.map) return;
		const next: Record<string, { x: number; y: number }> = {};
		for (const team of SHF_ACADEMIES) {
			const p = handle.map.project([team.lng, team.lat]);
			next[team.id] = { x: p.x, y: p.y };
		}
		markerPos = next;
	}

	function pickTeam(id: string) {
		onselect(id);
		handle?.flyToTeam(id, true);
	}

	function clearSelection() {
		onclear?.();
		handle?.flyToOverview();
		handle?.syncSelection('');
	}

	preloadMapLibre();

	onMount(async () => {
		await tick();
		if (!container) return;

		try {
			handle = await createJourneyMap({
				container,
				selectedShfId,
				onselect
			});
			mapReady = true;

			const hideLoading = () => {
				loading = false;
			};
			handle.map.once('load', hideLoading);
			handle.map.once('render', hideLoading);
			window.setTimeout(hideLoading, 2500);

			const syncMarkers = () => updateMarkerPositions();
			handle.map.on('move', syncMarkers);
			handle.map.on('zoom', syncMarkers);
			handle.map.on('render', syncMarkers);
			handle.map.once('load', syncMarkers);
			window.setTimeout(syncMarkers, 500);

			detachMapListeners = () => {
				handle?.map.off('move', syncMarkers);
				handle?.map.off('zoom', syncMarkers);
				handle?.map.off('render', syncMarkers);
			};

			resizeObserver = new ResizeObserver(() => {
				handle?.resize();
				updateMarkerPositions();
			});
			resizeObserver.observe(container);
		} catch (err) {
			console.error('Journey map failed:', err);
			loading = false;
		}
	});

	$effect(() => {
		if (!handle || !mapReady) return;
		handle.syncSelection(selectedShfId);
	});

	onDestroy(() => {
		detachMapListeners?.();
		resizeObserver?.disconnect();
		handle?.destroy();
		handle = null;
	});
</script>

<section class="origin-scene" aria-label={sq.chooseTeam}>
	<div class="map-stage" bind:this={container} class:is-ready={mapReady}></div>

	{#if mapReady}
		<div class="map-markers" aria-hidden={loading}>
			{#each SHF_ACADEMIES as team (team.id)}
				{@const pos = markerPos[team.id]}
				{#if pos}
					<button
						type="button"
						class="team-dot"
						class:selected={selectedShfId === team.id}
						class:dimmed={!!selectedShfId && selectedShfId !== team.id}
						style:left="{pos.x}px"
						style:top="{pos.y}px"
						aria-label={team.name}
						onclick={() => pickTeam(team.id)}
					>
						<span class="team-dot-core"></span>
						<span class="team-dot-ring"></span>
					</button>
				{/if}
			{/each}
		</div>
	{/if}

	<div class="origin-vignette"></div>

	{#if loading}
		<div class="map-loading" aria-live="polite">
			<span class="pulse-line"></span>
			<p>{sq.loadingMap}</p>
		</div>
	{/if}

	{#if selectedTeam && preview && home}
		<button
			type="button"
			class="map-close"
			aria-label={sq.mapClearSelection}
			onclick={clearSelection}
		>
			×
		</button>
	{/if}

	<header class="origin-head">
		<span class="step-badge">01</span>
		<p class="kicker">{sq.chooseTeamKicker}</p>
		<h1 class="display-xl">{sq.chooseTeam}</h1>
	</header>

	{#if selectedTeam && preview && home}
		<div class="origin-sheet">
			<div class="sheet-panel">
				<p class="kicker kicker--green">{getLrfLabel(home.lrf)}</p>
				<h2 class="sheet-title">{selectedTeam.name}</h2>
				<p class="sheet-meta">{preview.distanceKm} {sq.km}</p>
				<p class="sheet-story">"{sq.mapOriginStory}"</p>
				<GameButton variant="gold" size="lg" full onclick={() => onconfirm?.()}>
					{sq.mapStartHere}
				</GameButton>
			</div>
		</div>
	{:else}
		<div class="origin-sheet origin-sheet--hint">
			<p class="map-hint">{sq.chooseTeamHint}</p>
			<p class="map-legend">
				<span class="legend-dot"></span>
				{sq.teamDotLegend}
			</p>
		</div>
	{/if}
</section>

<style>
	.origin-scene {
		position: relative;
		flex: 1;
		min-height: min(84dvh, 780px);
		height: 100%;
		margin: calc(var(--space-4) * -1) calc(var(--viewport-pad) * -1)
			calc(var(--space-6) * -1);
		width: calc(100% + var(--viewport-pad) + var(--viewport-pad-r));
		overflow: hidden;
	}

	.map-stage {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		min-height: 420px;
		z-index: 0;
	}

	.map-stage :global(.maplibregl-canvas) {
		width: 100% !important;
		height: 100% !important;
		outline: none;
	}

	.map-stage :global(.maplibregl-map) {
		width: 100%;
		height: 100%;
	}

	.map-markers {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		overflow: hidden;
	}

	.team-dot {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 28px;
		height: 28px;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		pointer-events: auto;
	}

	.team-dot-core {
		position: absolute;
		inset: 7px;
		border-radius: 50%;
		background: #b7e4c7;
		border: 2px solid #fff;
		box-shadow: 0 0 12px rgba(183, 228, 199, 0.85);
		transition:
			transform var(--duration-fast) var(--ease-out),
			background var(--duration-fast) var(--ease-out),
			box-shadow var(--duration-fast) var(--ease-out);
	}

	.team-dot-ring {
		position: absolute;
		inset: 2px;
		border-radius: 50%;
		border: 1px solid rgba(149, 213, 178, 0.45);
		opacity: 0.8;
	}

	.team-dot:hover .team-dot-core,
	.team-dot:focus-visible .team-dot-core {
		transform: scale(1.15);
		background: #d8f3dc;
	}

	.team-dot.selected .team-dot-core {
		inset: 5px;
		background: #d4a853;
		border-color: #fff;
		box-shadow: 0 0 18px rgba(212, 168, 83, 0.95);
	}

	.team-dot.selected .team-dot-ring {
		inset: 0;
		border-color: rgba(212, 168, 83, 0.6);
		opacity: 1;
	}

	.team-dot.dimmed {
		opacity: 0.35;
	}

	.map-close {
		position: absolute;
		top: calc(env(safe-area-inset-top) + var(--space-3) + 52px);
		right: var(--viewport-pad);
		z-index: 4;
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 50%;
		background: rgba(5, 7, 8, 0.72);
		color: var(--text);
		font-size: 1.6rem;
		line-height: 1;
		cursor: pointer;
		backdrop-filter: blur(8px);
	}

	.map-close:hover {
		border-color: rgba(212, 168, 83, 0.45);
		color: var(--gold);
	}

	.origin-vignette {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background:
			linear-gradient(180deg, rgba(5, 7, 8, 0.6) 0%, rgba(5, 7, 8, 0.02) 16%, transparent 42%, transparent 60%, rgba(5, 7, 8, 0.75) 82%, rgba(5, 7, 8, 0.92) 100%),
			linear-gradient(90deg, rgba(5, 7, 8, 0.28), transparent 16%, transparent 84%, rgba(5, 7, 8, 0.28));
	}

	.map-loading {
		position: absolute;
		inset: 0;
		z-index: 3;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: var(--space-3);
		background: rgba(5, 7, 8, 0.85);
		pointer-events: none;
		transition: opacity var(--duration-normal) var(--ease-out);
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
		pointer-events: none;
	}

	.origin-sheet :global(.game-btn),
	.origin-sheet .sheet-panel {
		pointer-events: auto;
	}

	.origin-sheet--hint {
		padding-bottom: calc(var(--space-8) + env(safe-area-inset-bottom));
	}

	.map-hint {
		margin: 0;
		padding: var(--space-4) var(--viewport-pad) var(--space-2);
		text-align: center;
		color: var(--text-dim);
		font-size: var(--text-sm);
		line-height: 1.55;
		max-width: 34ch;
		margin-inline: auto;
	}

	.map-legend {
		margin: 0;
		padding: 0 var(--viewport-pad) var(--space-4);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.legend-dot {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #b7e4c7;
		box-shadow: 0 0 0 2px #fff, 0 0 10px rgba(183, 228, 199, 0.6);
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

		.map-close {
			top: calc(env(safe-area-inset-top) + var(--space-8) + 56px);
			right: var(--space-8);
		}
	}
</style>
