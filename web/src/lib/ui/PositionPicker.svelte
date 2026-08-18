<script lang="ts">
	import type { Position } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		selected: Position | null;
		onselect: (p: Position) => void;
		oncontinue?: () => void;
	}

	let { selected, onselect, oncontinue }: Props = $props();

	const positions: {
		id: Position;
		label: string;
		tagline: string;
		zone: string;
		y: string;
	}[] = [
		{ id: 'GK', label: sq.positionGK, tagline: sq.posGKTag, zone: 'gk', y: '88%' },
		{ id: 'DF', label: sq.positionDF, tagline: sq.posDFTag, zone: 'df', y: '68%' },
		{ id: 'MF', label: sq.positionMF, tagline: sq.posMFTag, zone: 'mf', y: '48%' },
		{ id: 'FW', label: sq.positionFW, tagline: sq.posFWTag, zone: 'fw', y: '22%' }
	];

	const active = $derived(positions.find((p) => p.id === selected));
</script>

<section class="scene position-scene">
	<p class="map-step">03</p>
	<p class="kicker">{sq.choosePosition}</p>
	<p class="body-story">{sq.positionHint}</p>

	<div class="pitch-stage" aria-hidden="true">
		<div class="pitch-lines">
			<div class="half-line"></div>
			<div class="box top"></div>
			<div class="box bottom"></div>
		</div>

		{#each positions as p (p.id)}
			<button
				type="button"
				class="zone-btn"
				class:selected={selected === p.id}
				style="top: {p.y}"
				onclick={() => onselect(p.id)}
				aria-label={p.label}
			>
				<span class="zone-abbr">{p.id}</span>
			</button>
		{/each}
	</div>

	{#if active}
		<div class="selection-readout">
			<p class="display-xl">{active.label}</p>
			<p class="tagline">{active.tagline}</p>
		</div>
		{#if oncontinue}
			<div class="choice-stack">
				<button type="button" class="continue-btn" onclick={oncontinue}>{sq.eventContinue}</button>
			</div>
		{/if}
	{/if}
</section>

<style>
	.position-scene {
		min-height: min(82dvh, 720px);
		justify-content: flex-end;
		gap: var(--space-5);
	}

	.pitch-stage {
		position: relative;
		width: 100%;
		max-width: 420px;
		height: min(42dvh, 360px);
		margin: var(--space-4) 0;
	}

	.pitch-lines {
		position: absolute;
		inset: 0;
		border: 1px solid rgba(45, 106, 79, 0.35);
		background: linear-gradient(180deg, rgba(45, 106, 79, 0.06), transparent 40%);
	}

	.half-line {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: rgba(255, 255, 255, 0.08);
	}

	.box {
		position: absolute;
		left: 22%;
		right: 22%;
		height: 24%;
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.box.top {
		top: 0;
		border-top: none;
	}

	.box.bottom {
		bottom: 0;
		border-bottom: none;
	}

	.zone-btn {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 56px;
		height: 56px;
		border-radius: 50%;
		border: 1px solid var(--line);
		background: rgba(255, 255, 255, 0.04);
		color: var(--muted);
		transition: all var(--duration-normal) var(--ease-out);
	}

	.zone-btn.selected {
		border-color: var(--gold);
		color: var(--gold);
		box-shadow: 0 0 0 4px rgba(212, 168, 83, 0.15);
		transform: translate(-50%, -50%) scale(1.08);
	}

	.zone-abbr {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		letter-spacing: 0.08em;
	}

	.selection-readout {
		width: 100%;
		max-width: 420px;
		padding-top: var(--space-2);
		border-top: 1px solid var(--line);
	}

	.tagline {
		margin: var(--space-2) 0 0;
		font-size: var(--text-sm);
		color: var(--text-dim);
		font-style: italic;
		line-height: 1.5;
		max-width: 36ch;
	}

	.continue-btn {
		min-height: 56px;
		width: 100%;
		border: none;
		background: var(--gold);
		color: var(--canvas-deep);
		font-family: var(--font-display);
		font-size: var(--text-lg);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 700;
	}

	.continue-btn:hover {
		filter: brightness(1.05);
	}
</style>
