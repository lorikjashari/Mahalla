<script lang="ts">
	import type { PantheonEntry } from '$lib/game/meta';
	import { municipalityById } from '$lib/data/municipalities';

	interface Props {
		entries: PantheonEntry[];
	}

	let { entries }: Props = $props();

	const sorted = $derived([...entries].sort((a, b) => b.score - a.score).slice(0, 10));
</script>

{#if sorted.length > 0}
	<div class="pantheon">
		<h3>Panteoni i Mahallës</h3>
		<ol>
			{#each sorted as entry, i (entry.id)}
				<li>
					<span class="rank">#{i + 1}</span>
					<div>
						<strong>{entry.playerName}</strong>
						<span class="meta">
							{entry.badge} · {entry.score} pikë
							{#if entry.duelMode}· duel{/if}
						</span>
						<span class="meta">
							{municipalityById[entry.municipalityId]?.name ?? entry.municipalityId}
						</span>
					</div>
				</li>
			{/each}
		</ol>
	</div>
{/if}

<style>
	.pantheon {
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

	ol {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.5rem;
	}

	li {
		display: flex;
		gap: 0.65rem;
		align-items: flex-start;
		padding: 0.5rem;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.03);
	}

	.rank {
		color: var(--gold);
		font-weight: 800;
		min-width: 1.75rem;
	}

	.meta {
		display: block;
		font-size: 0.78rem;
		color: var(--muted);
	}
</style>
