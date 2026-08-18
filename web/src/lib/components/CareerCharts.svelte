<script lang="ts">
	import type { SeasonHistoryEntry } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

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

<section class="detail-section charts" aria-labelledby="charts-title">
	<p class="detail-kicker" id="charts-title">{sq.chartsTitle}</p>

	<div class="chart-block">
		<span class="chart-label">{sq.chartsOvr}</span>
		<svg viewBox="0 0 100 45" class="chart-svg" role="img" aria-label={sq.chartsOvr}>
			<polyline points={linePoints} class="ovr-line" fill="none" />
			{#each recent as h, i (h.season)}
				{@const x = 8 + (i / Math.max(recent.length - 1, 1)) * 84}
				<circle cx={x} cy={ovrY(h.ovr)} r="1.8" class="dot" />
				<text x={x} y="43" text-anchor="middle" class="axis">{h.age}</text>
			{/each}
		</svg>
	</div>

	<div class="chart-block">
		<span class="chart-label">{sq.chartsMinutes}</span>
		<div class="bars">
			{#each recent as h (h.season)}
				<div class="bar-col" title="{h.season}: {h.minutesPct}%">
					<div class="bar" style="height:{h.minutesPct}%"></div>
					<small>{h.age}</small>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.chart-block {
		margin-top: var(--space-4);
	}

	.chart-block + .chart-block {
		margin-top: var(--space-5);
	}

	.chart-label {
		display: block;
		margin-bottom: var(--space-2);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--muted);
	}

	.chart-svg {
		width: 100%;
		height: auto;
	}

	.ovr-line {
		stroke: var(--accent-bright);
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
		height: 72px;
		padding-top: var(--space-2);
		border-top: 1px solid var(--line);
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
		max-width: 20px;
		background: linear-gradient(180deg, var(--gold), var(--accent));
		min-height: 4px;
	}

	.bar-col small {
		font-size: 0.55rem;
		color: var(--muted);
		margin-top: 4px;
	}
</style>
