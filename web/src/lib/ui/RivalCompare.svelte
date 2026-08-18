<script lang="ts">
	import { sq } from '$lib/i18n/sq';

	interface Props {
		playerName: string;
		playerOvr: number;
		rivalName: string;
		rivalOvr: number;
		playerForm?: number;
		playerGoals?: number;
	}

	let {
		playerName,
		playerOvr,
		rivalName,
		rivalOvr,
		playerForm = 70,
		playerGoals = 0
	}: Props = $props();

	const delta = $derived(playerOvr - rivalOvr);
	const winning = $derived(delta >= 0);

	const verdict = $derived.by(() => {
		if (delta >= 5) return sq.duelCrushing;
		if (delta >= 1) return sq.duelAhead;
		if (delta === 0) return sq.duelEven;
		if (delta >= -4) return sq.duelBehind;
		return sq.duelLosing;
	});
</script>

<section class="detail-section duel-compare" class:winning class:losing={!winning}>
	<p class="detail-kicker">{sq.rivalCompare}</p>

	<div class="versus-grid">
		<div class="side you">
			<p class="side-label">{sq.you}</p>
			<p class="side-name">{playerName}</p>
			<p class="stat-huge">{playerOvr}<span class="stat-huge-label">OVR</span></p>
			<p class="side-stat">{sq.form} {playerForm}</p>
		</div>

		<div class="vs-mark">
			<span>VS</span>
			{#if playerGoals > 0}
				<span class="goals">{playerGoals}G</span>
			{/if}
		</div>

		<div class="side rival">
			<p class="side-label">{sq.rival}</p>
			<p class="side-name">{rivalName}</p>
			<p class="stat-huge">{rivalOvr}<span class="stat-huge-label">OVR</span></p>
			<p class="side-stat">{sq.duelGen}</p>
		</div>
	</div>

	<p class="verdict">
		<span class:positive={delta > 0} class:negative={delta < 0}>
			{delta > 0 ? '+' : ''}{delta} OVR
		</span>
		· {verdict}
	</p>
</section>

<style>
	.versus-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: var(--space-4);
		align-items: end;
		margin: var(--space-4) 0;
	}

	.side-label {
		margin: 0 0 var(--space-2);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--muted);
	}

	.side-name {
		margin: 0 0 var(--space-2);
		font-size: var(--text-sm);
		font-weight: 700;
		line-height: 1.2;
	}

	.side-stat {
		margin: var(--space-2) 0 0;
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
	}

	.vs-mark {
		display: grid;
		gap: var(--space-1);
		justify-items: center;
		padding-bottom: var(--space-6);
		font-family: var(--font-display);
		font-size: var(--text-lg);
		color: var(--muted);
	}

	.goals {
		font-size: var(--text-xs);
		color: var(--gold);
	}

	.verdict {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--text-dim);
		font-style: italic;
	}

	.positive {
		color: var(--success);
		font-style: normal;
		font-weight: 700;
	}

	.negative {
		color: var(--danger);
		font-style: normal;
		font-weight: 700;
	}

	.winning .you .stat-huge {
		color: var(--gold);
	}

	.losing .rival .stat-huge {
		color: var(--danger);
	}
</style>
