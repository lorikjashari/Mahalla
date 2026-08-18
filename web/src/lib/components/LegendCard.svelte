<script lang="ts">
	import type { MahallaSave } from '$lib/game/types';
	import { computeLegendScore, getLegendBadge, getRivalVerdict } from '$lib/game/legend';
	import { getTierLabel } from '$lib/data/clubs';
	import ClubLogo from '$lib/components/ClubLogo.svelte';

	interface Props {
		save: MahallaSave;
	}

	let { save }: Props = $props();

	const score = $derived(computeLegendScore(save));
	const badge = $derived(getLegendBadge(save));
	const verdict = $derived(getRivalVerdict(save));
</script>

<div class="legend-card" id="legend-card">
	<p class="badge">{badge}</p>
	<h2>{save.player.name}</h2>
	<p class="score">{score} pikë karriere</p>

	<div class="club-row">
		<ClubLogo
			name={save.currentClub.name}
			initials={save.currentClub.initials}
			colors={save.currentClub.colors}
			logoUrl={save.currentClub.logoUrl}
			size="lg"
		/>
		<div>
			<p><strong>{save.currentClub.name}</strong></p>
			<p class="meta">{getTierLabel(save.currentTier)} · {save.player.age} vjeç</p>
		</div>
	</div>

	<div class="stats-row">
		<div><span>{save.player.goals}</span><small>Gola</small></div>
		<div><span>{save.player.assists}</span><small>Asistime</small></div>
		<div><span>{save.nationalCaps}</span><small>Kombëtarja</small></div>
		<div><span>{save.careerHistory.length}</span><small>Klube</small></div>
	</div>

	<p class="verdict">{verdict}</p>
	<p class="footer">Mahalla — nga lagjja te legjenda</p>
</div>

<style>
	.legend-card {
		background: linear-gradient(160deg, #1a2332 0%, #0f1419 100%);
		border: 2px solid var(--gold);
		border-radius: var(--radius);
		padding: 1.25rem;
		text-align: center;
	}

	.badge {
		color: var(--gold);
		font-weight: 700;
		font-size: 0.85rem;
		margin: 0 0 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.score {
		color: var(--muted);
		margin: 0.25rem 0 1rem;
	}

	.club-row {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		text-align: left;
		background: rgba(0, 0, 0, 0.25);
		padding: 0.75rem;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.meta {
		margin: 0;
		font-size: 0.82rem;
		color: var(--muted);
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.stats-row span {
		display: block;
		font-size: 1.25rem;
		font-weight: 800;
	}

	.stats-row small {
		color: var(--muted);
		font-size: 0.65rem;
	}

	.verdict {
		font-style: italic;
		color: var(--text);
		margin: 0 0 0.75rem;
		font-size: 0.9rem;
	}

	.footer {
		margin: 0;
		font-size: 0.7rem;
		color: var(--muted);
	}
</style>
