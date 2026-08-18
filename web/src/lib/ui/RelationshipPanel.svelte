<script lang="ts">
	import { buildRelationships } from '$lib/game/relationships';
	import type { MahallaSave } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		save: MahallaSave;
	}

	let { save }: Props = $props();

	const relationships = $derived(buildRelationships(save));
</script>

<section class="detail-section relationships" aria-labelledby="rel-title">
	<p class="detail-kicker" id="rel-title">{sq.relationships}</p>

	<ul class="rel-list">
		{#each relationships as rel (rel.id)}
			<li>
				<div class="rel-head">
					<strong>{rel.name}</strong>
					<span class="rel-value">{rel.value}%</span>
				</div>
				<p class="rel-role">{rel.role}</p>
				<div class="rel-track">
					<div class="rel-fill" style="width: {rel.value}%"></div>
				</div>
				<p class="rel-status">{rel.status}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.rel-list {
		list-style: none;
		padding: 0;
		margin: var(--space-4) 0 0;
		display: grid;
		gap: 0;
	}

	.rel-list li {
		padding: var(--space-4) 0;
		border-bottom: 1px solid var(--line);
	}

	.rel-list li:last-child {
		border-bottom: none;
	}

	.rel-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-3);
	}

	.rel-head strong {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.rel-value {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		color: var(--gold);
		line-height: 1;
	}

	.rel-role {
		margin: 0.15rem 0 var(--space-2);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.rel-track {
		height: 2px;
		background: var(--line);
		margin-bottom: var(--space-2);
	}

	.rel-fill {
		height: 100%;
		background: var(--accent-bright);
		transition: width var(--duration-cinematic) var(--ease-out);
	}

	.rel-status {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--text-dim);
		line-height: 1.4;
	}
</style>
