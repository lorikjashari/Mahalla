<script lang="ts">
	import type { MahallaMeta } from '$lib/game/meta';
	import { LEGACIES } from '$lib/game/meta';
	import { sq } from '$lib/i18n/sq';

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
	<section class="detail-section legacy-picker" aria-labelledby="legacy-title">
		<p class="detail-kicker" id="legacy-title">Trashëgimi</p>
		<p class="meta-strip-hint">Zgjedh deri në 2 bonus nga karriera e kaluar — me trade-off.</p>

		<div class="legacy-choices">
			{#each unlocked as leg (leg.id)}
				<button
					type="button"
					class="legacy-row"
					class:active={selected.includes(leg.id)}
					disabled={!selected.includes(leg.id) && selected.length >= 2}
					onclick={() => toggle(leg.id)}
				>
					<span class="legacy-name">{leg.name}</span>
					<span class="legacy-buff">{leg.buff}</span>
					<span class="legacy-debuff">{leg.debuff}</span>
				</button>
			{/each}
		</div>
	</section>
{/if}

<style>
	.legacy-choices {
		display: grid;
		gap: 0;
		margin-top: var(--space-4);
	}

	.legacy-row {
		display: grid;
		gap: 0.2rem;
		padding: var(--space-3) 0;
		text-align: left;
		background: transparent;
		border: none;
		border-top: 1px solid var(--line);
		color: var(--text);
		transition: color var(--duration-normal) var(--ease-out);
	}

	.legacy-row:last-child {
		border-bottom: 1px solid var(--line);
	}

	.legacy-row.active {
		color: var(--gold);
	}

	.legacy-row:disabled:not(.active) {
		opacity: 0.4;
	}

	.legacy-name {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.legacy-buff {
		font-size: var(--text-sm);
		color: var(--success);
	}

	.legacy-debuff {
		font-size: var(--text-sm);
		color: var(--danger);
	}

	.legacy-row.active .legacy-buff,
	.legacy-row.active .legacy-debuff {
		opacity: 0.85;
	}
</style>
