<script lang="ts">
	import type { ClubHistoryEntry } from '$lib/game/types';

	interface Props {
		history: ClubHistoryEntry[];
		currentId?: string;
	}

	let { history, currentId }: Props = $props();

	function project(lat: number, lng: number, bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) {
		const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 100;
		const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat || 1)) * 100;
		return { x: Math.max(4, Math.min(96, x)), y: Math.max(8, Math.min(92, y)) };
	}

	const bounds = $derived.by(() => {
		const lats = history.map((h) => h.lat);
		const lngs = history.map((h) => h.lng);
		const pad = 0.8;
		return {
			minLat: Math.min(...lats) - pad,
			maxLat: Math.max(...lats) + pad,
			minLng: Math.min(...lngs) - pad,
			maxLng: Math.max(...lngs) + pad
		};
	});

	const points = $derived(
		history.map((h, i) => ({
			...h,
			...project(h.lat, h.lng, bounds),
			index: i
		}))
	);

	const pathD = $derived(
		points.length < 2
			? ''
			: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
	);
</script>

<div class="career-map">
	<h3>Harta e karrierës</h3>
	<svg viewBox="0 0 100 55" class="map">
		<rect width="100" height="55" class="bg" />
		{#if pathD}
			<path d={pathD} class="route" fill="none" />
		{/if}
		{#each points as p (p.clubId + p.season)}
			<g class="pin" class:current={p.clubId === currentId}>
				<circle cx={p.x} cy={p.y} r={p.clubId === currentId ? 2.8 : 2} />
				<text x={p.x} y={p.y - 3.5} text-anchor="middle" class="pin-label">{p.age}v</text>
			</g>
		{/each}
	</svg>
	<ol class="timeline">
		{#each history as h, i (h.clubId + h.season)}
			<li class:current={h.clubId === currentId}>
				<span class="age">{h.age} vjeç</span>
				<strong>{h.clubName}</strong>
			</li>
		{/each}
	</ol>
</div>

<style>
	.career-map {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1rem;
		margin: 1rem 0;
	}

	h3 {
		margin: 0 0 0.75rem;
		font-size: 0.95rem;
		color: var(--gold);
	}

	.bg {
		fill: #121a16;
	}

	.route {
		stroke: var(--gold);
		stroke-width: 0.7;
		stroke-dasharray: 3 1.5;
		opacity: 0.85;
	}

	.pin circle {
		fill: var(--accent);
	}

	.pin.current circle {
		fill: var(--gold);
	}

	.pin-label {
		fill: var(--muted);
		font-size: 2.8px;
	}

	.timeline {
		list-style: none;
		padding: 0;
		margin: 0.75rem 0 0;
		display: grid;
		gap: 0.35rem;
		max-height: 140px;
		overflow-y: auto;
	}

	.timeline li {
		font-size: 0.82rem;
		padding: 0.35rem 0.5rem;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.03);
	}

	.timeline li.current {
		border-left: 2px solid var(--gold);
	}

	.age {
		color: var(--muted);
		margin-right: 0.35rem;
	}
</style>
