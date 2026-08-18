<script lang="ts">
import type { MahallaMeta } from '$lib/game/meta';
import { LEGACIES } from '$lib/game/meta';

interface Props {
	meta: MahallaMeta;
	selected: string[];
	onchange: (ids: string[]) => void;
}

let { meta, selected, onchange }: Props = $props();

const unlocked = $derived(LEGACIES.filter((l) => meta.unlockedLegacies.includes(l.id)));

function toggle(id: string) {
	if (selected.includes(id)) {
		onchange(selected.filter((x) => x !== id));
		return;
	}
	if (selected.length >= 2) return;
	onchange([...selected, id]);
}
</script>

{#if unlocked.length > 0}
	<div class="legacy-picker">
		<h3>Trashëgimi (max 2)</h3>
		<p class="hint">Bonus nga karriera e kaluar — me trade-off.</p>
		<div class="legacy-list">
			{#each unlocked as leg (leg.id)}
				<button
					type="button"
					class="legacy-card"
					class:active={selected.includes(leg.id)}
					disabled={!selected.includes(leg.id) && selected.length >= 2}
					onclick={() => toggle(leg.id)}
				>
					<strong>{leg.name}</strong>
					<span class="buff">{leg.buff}</span>
					<span class="debuff">{leg.debuff}</span>
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.legacy-picker {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1rem;
		margin: 1rem 0;
	}

	h3 {
		margin: 0 0 0.25rem;
		font-size: 0.95rem;
		color: var(--gold);
	}

	.hint {
		margin: 0 0 0.75rem;
		font-size: 0.82rem;
		color: var(--muted);
	}

	.legacy-list {
		display: grid;
		gap: 0.5rem;
	}

	.legacy-card {
		text-align: left;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid var(--border);
		padding: 0.65rem 0.75rem;
		border-radius: 8px;
		display: grid;
		gap: 0.2rem;
	}

	.legacy-card.active {
		border-color: var(--gold);
		background: rgba(212, 168, 83, 0.08);
	}

	.legacy-card:disabled:not(.active) {
		opacity: 0.45;
	}

	.buff {
		font-size: 0.78rem;
		color: #52b788;
	}

	.debuff {
		font-size: 0.78rem;
		color: #e76f51;
	}
</style>
