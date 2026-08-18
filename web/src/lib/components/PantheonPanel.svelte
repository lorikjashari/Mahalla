<script lang="ts">
	import type { PantheonEntry } from '$lib/game/meta';
	import { municipalityById } from '$lib/data/municipalities';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		entries: PantheonEntry[];
	}

	let { entries }: Props = $props();

	const sorted = $derived([...entries].sort((a, b) => b.score - a.score).slice(0, 10));
	const leaders = $derived(sorted.slice(0, 3));
	const rest = $derived(sorted.slice(3));

	function formatDate(ts: number): string {
		return new Date(ts).toLocaleDateString('sq-AL', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

{#if sorted.length > 0}
	<section class="detail-section pantheon" aria-labelledby="pantheon-title">
		<p class="detail-kicker" id="pantheon-title">{sq.pantheon}</p>
		<p class="pantheon-count">{sorted.length} {sq.pantheonLegends}</p>

		{#if leaders.length > 0}
			<div class="podium-readout">
				{#each leaders as entry, i (entry.id)}
					<div class="podium-entry" class:lead={i === 0}>
						<span class="rank-num" class:rank-num--lead={i === 0}>#{i + 1}</span>
						<div>
							<strong>{entry.playerName}</strong>
							<span class="meta">{entry.score} {sq.legendPoints} · {entry.badge}</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if rest.length > 0}
			<ol class="rank-list">
				{#each rest as entry, i (entry.id)}
					<li>
						<span class="rank-num">#{i + 4}</span>
						<div>
							<strong>{entry.playerName}</strong>
							<span class="meta">
								{entry.badge} · {entry.score} {sq.legendPoints}
								· {municipalityById[entry.municipalityId]?.name ?? entry.municipalityId}
								· {formatDate(entry.completedAt)}
							</span>
						</div>
					</li>
				{/each}
			</ol>
		{/if}
	</section>
{/if}

<style>
	.pantheon-count {
		margin: 0 0 var(--space-4);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.podium-readout {
		display: grid;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.podium-entry {
		display: flex;
		gap: var(--space-3);
		align-items: baseline;
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--line);
	}

	.podium-entry.lead strong {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.meta {
		display: block;
		font-size: var(--text-xs);
		color: var(--muted);
		line-height: 1.4;
		margin-top: 0.15rem;
	}
</style>
