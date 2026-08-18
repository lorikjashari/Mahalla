<script lang="ts">
	import type { CauseEntry } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		causes: CauseEntry[];
		minutesPct: number;
	}

	let { causes, minutesPct }: Props = $props();
</script>

<div class="cause-panel">
	<h3>{sq.causePanel}</h3>
	<div class="minutes-bar">
		<div class="fill" style="width:{minutesPct}%"></div>
	</div>
	<p class="pct">{minutesPct}% minuta</p>
	<ul>
		{#each causes as c (c.label)}
			<li class:pos={c.positive} class:neg={!c.positive}>
				<span>{c.label}</span>
				<span>{c.value > 0 ? '+' : ''}{c.value}%</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.cause-panel {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1rem;
	}

	h3 {
		margin: 0 0 0.75rem;
		font-size: 0.95rem;
		color: var(--gold);
	}

	.minutes-bar {
		height: 8px;
		background: var(--border);
		border-radius: 99px;
		overflow: hidden;
	}

	.fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), var(--gold));
		border-radius: 99px;
		transition: width 0.4s ease;
	}

	.pct {
		margin: 0.35rem 0 0.75rem;
		font-size: 0.8rem;
		color: var(--muted);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.35rem;
	}

	li {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		padding: 0.35rem 0.5rem;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.03);
	}

	.pos span:last-child {
		color: #52b788;
	}

	.neg span:last-child {
		color: #e76f51;
	}
</style>
