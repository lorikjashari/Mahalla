<script lang="ts">
	import type { SeasonHistoryEntry } from '$lib/game/types';

	interface Props {
		history: SeasonHistoryEntry[];
	}

	let { history }: Props = $props();

	const recent = $derived(history.slice(-8));
	const maxOvr = $derived(Math.max(...recent.map((h) => h.ovr), 50));
	const minOvr = $derived(Math.min(...recent.map((h) => h.ovr), 45));

	function ovrY(ovr: number): number {
		const range = maxOvr - minOvr || 1;
		return 40 - ((ovr - minOvr) / range) * 32;
	}

	const linePoints = $derived(
		recent
			.map((h, i) => {
				const x = 8 + (i / Math.max(recent.length - 1, 1)) * 84;
				return `${x},${ovrY(h.ovr)}`;
			})
			.join(' ')
	);
</script>

<div class="charts">
	<h3>Progresi yt</h3>

	<div class="chart-block">
		<span class="chart-label">Vlerësimi (OVR)</span>
		<svg viewBox="0 0 100 45" class="chart-svg">
			<polyline points={linePoints} class="ovr-line" fill="none" />
			{#each recent as h, i (h.season)}
				{@const x = 8 + (i / Math.max(recent.length - 1, 1)) * 84}
				<circle cx={x} cy={ovrY(h.ovr)} r="1.8" class="dot" />
				<text x={x} y="43" text-anchor="middle" class="axis">{h.age}</text>
			{/each}
		</svg>
	</div>

	<div class="chart-block">
		<span class="chart-label">Minuta (%)</span>
		<div class="bars">
			{#each recent as h (h.season)}
				<div class="bar-col" title="{h.season}: {h.minutesPct}%">
					<div class="bar" style="height:{h.minutesPct}%"></div>
					<small>{h.age}</small>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.charts {
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

	.chart-block {
		margin-bottom: 1rem;
	}

	.chart-block:last-child {
		margin-bottom: 0;
	}

	.chart-label {
		font-size: 0.75rem;
		color: var(--muted);
		display: block;
		margin-bottom: 0.35rem;
	}

	.chart-svg {
		width: 100%;
		height: auto;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
	}

	.ovr-line {
		stroke: var(--accent);
		stroke-width: 1.2;
	}

	.dot {
		fill: var(--gold);
	}

	.axis {
		fill: var(--muted);
		font-size: 4px;
	}

	.bars {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		height: 64px;
		padding: 0 4px;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
	}

	.bar-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		justify-content: flex-end;
	}

	.bar {
		width: 100%;
		max-width: 24px;
		background: linear-gradient(180deg, var(--gold), var(--accent));
		border-radius: 3px 3px 0 0;
		min-height: 4px;
	}

	.bar-col small {
		font-size: 0.6rem;
		color: var(--muted);
		margin-top: 2px;
	}
</style>
