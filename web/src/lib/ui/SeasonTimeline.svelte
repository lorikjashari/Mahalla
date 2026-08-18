<script lang="ts">
	import type { GamePhase } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		phase: GamePhase;
	}

	let { phase }: Props = $props();

	const steps = [
		{ id: 'event', label: sq.timelineEvent },
		{ id: 'match', label: sq.timelineMatch },
		{ id: 'recap', label: sq.timelineRecap },
		{ id: 'market', label: sq.timelineMarket }
	] as const;

	function stepState(id: string): 'done' | 'current' | 'future' {
		const order = ['event', 'match', 'recap', 'market'];
		const pi = order.indexOf(phase);
		const si = order.indexOf(id);
		if (si < pi) return 'done';
		if (si === pi) return 'current';
		return 'future';
	}
</script>

<nav class="season-timeline" aria-label={sq.seasonTimeline}>
	<p class="timeline-title">{sq.seasonTimeline}</p>
	<ol>
		{#each steps as step, i (step.id)}
			<li class={stepState(step.id)}>
				<span class="dot"></span>
				<span class="label">{step.label}</span>
				{#if i < steps.length - 1}
					<span class="connector"></span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	.season-timeline {
		margin-bottom: var(--space-4);
		padding: var(--space-3) var(--space-4);
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius);
	}

	.timeline-title {
		margin: 0 0 0.65rem;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: space-between;
		gap: 0.25rem;
	}

	li {
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid var(--border);
		background: var(--bg);
		transition: all var(--duration-normal) var(--ease-out);
	}

	.label {
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--muted);
		text-align: center;
	}

	.connector {
		position: absolute;
		top: 5px;
		left: calc(50% + 8px);
		width: calc(100% - 16px);
		height: 2px;
		background: var(--border);
		z-index: 0;
	}

	li.done .dot {
		background: var(--accent);
		border-color: var(--accent);
	}

	li.done .label {
		color: var(--success);
	}

	li.current .dot {
		background: var(--gold);
		border-color: var(--gold);
		box-shadow: 0 0 12px rgba(212, 168, 83, 0.45);
		transform: scale(1.15);
	}

	li.current .label {
		color: var(--text);
		font-weight: 700;
	}

	li.future .dot {
		opacity: 0.5;
	}
</style>
