<script lang="ts">
	import { MUNICIPALITIES } from '$lib/data/municipalities';
	import { toMapCoords } from '$lib/game/geo';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		selectedId?: string;
		onselect: (id: string) => void;
	}

	let { selectedId, onselect }: Props = $props();

	const points = MUNICIPALITIES.map((m) => ({
		...m,
		...toMapCoords(m.lat, m.lng)
	}));
</script>

<div class="map-wrap">
	<svg viewBox="0 0 100 72" class="kosovo-map" role="img" aria-label="Harta e Kosovës">
		<rect x="0" y="0" width="100" height="72" rx="4" class="map-bg" />
		<text x="50" y="8" text-anchor="middle" class="map-title">KOSOVA</text>
		{#each points as m (m.id)}
			<g
				class="municipality"
				class:selected={selectedId === m.id}
				role="button"
				tabindex="0"
				onclick={() => onselect(m.id)}
				onkeydown={(e) => e.key === 'Enter' && onselect(m.id)}
			>
				<circle cx={m.x} cy={m.y + 4} r={selectedId === m.id ? 3.2 : 2.2} />
				{#if selectedId === m.id}
					<text x={m.x} y={m.y - 1} text-anchor="middle" class="label">{m.name}</text>
				{/if}
			</g>
		{/each}
	</svg>
	<p class="map-hint">{sq.chooseCityHint}</p>
</div>

<style>
	.map-wrap {
		width: 100%;
		max-width: 420px;
		margin: 0 auto;
	}

	.kosovo-map {
		width: 100%;
		height: auto;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: linear-gradient(160deg, #0f1a14 0%, #0f1419 100%);
	}

	.map-bg {
		fill: #121a16;
	}

	.map-title {
		fill: var(--muted);
		font-size: 4px;
		letter-spacing: 0.8px;
		font-weight: 700;
	}

	.municipality circle {
		fill: var(--accent);
		opacity: 0.55;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.municipality:hover circle,
	.municipality:focus circle {
		opacity: 1;
		r: 3;
	}

	.municipality.selected circle {
		fill: var(--gold);
		opacity: 1;
	}

	.label {
		fill: var(--text);
		font-size: 3.5px;
		font-weight: 600;
	}

	.map-hint {
		margin-top: 0.75rem;
		color: var(--muted);
		font-size: 0.875rem;
		text-align: center;
		line-height: 1.5;
	}
</style>
