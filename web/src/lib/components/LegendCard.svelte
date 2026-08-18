<script lang="ts">
	import type { MahallaSave } from '$lib/game/types';
	import { computeLegendScore, getLegendBadge, getRivalVerdict } from '$lib/game/legend';
	import { getTierLabel } from '$lib/data/clubs';
	import { municipalityById } from '$lib/data/municipalities';
	import { isDailySeed } from '$lib/game/meta';
	import ClubLogo from '$lib/components/ClubLogo.svelte';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		save: MahallaSave;
	}

	let { save }: Props = $props();

	const score = $derived(computeLegendScore(save));
	const badge = $derived(getLegendBadge(save));
	const verdict = $derived(getRivalVerdict(save));
	const city = $derived(municipalityById[save.municipalityId]?.name ?? save.municipalityId);
	const modeTag = $derived(
		save.duelMode ? sq.duelMode : isDailySeed(save.seed) ? sq.dailyChallenge : null
	);
</script>

<article class="legend-cover" id="legend-card">
	<p class="kicker">{badge}{#if modeTag} · {modeTag}{/if}</p>
	<h2 class="display-mega">{save.player.name}</h2>
	<p class="origin">{city} · {save.player.position}</p>
	<p class="score-line">{score} {sq.legendPoints}</p>

	<div class="club-block">
		<ClubLogo
			name={save.currentClub.name}
			initials={save.currentClub.initials}
			colors={save.currentClub.colors}
			logoUrl={save.currentClub.logoUrl}
			size="md"
		/>
		<div>
			<p class="club-name">{save.currentClub.name}</p>
			<p class="meta">{getTierLabel(save.currentTier)} · {save.player.age} {sq.yearsOld}</p>
		</div>
	</div>

	<div class="info-rail">
		<div class="info-rail-item">
			<span>{sq.legendGoals}</span>
			<strong>{save.player.goals}</strong>
		</div>
		<div class="info-rail-item">
			<span>{sq.legendAssists}</span>
			<strong>{save.player.assists}</strong>
		</div>
		<div class="info-rail-item">
			<span>{sq.nationalCall}</span>
			<strong>{save.nationalCaps}</strong>
		</div>
		<div class="info-rail-item">
			<span>{sq.ovr}</span>
			<strong>{save.player.ovr}</strong>
		</div>
	</div>

	<p class="verdict">"{verdict}"</p>
	<p class="footer">{sq.legendFooter}</p>
</article>

<style>
	.legend-cover {
		padding: var(--space-6) 0;
		border-top: 2px solid var(--gold-dim);
		border-bottom: 1px solid var(--line);
		text-align: left;
	}

	.origin {
		margin: var(--space-2) 0 0;
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.score-line {
		margin: var(--space-4) 0;
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		color: var(--gold);
		letter-spacing: 0.06em;
	}

	.club-block {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.club-name {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-lg);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.meta {
		margin: 0.2rem 0 0;
		font-size: var(--text-xs);
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.verdict {
		margin: var(--space-4) 0;
		font-size: var(--text-md);
		font-style: italic;
		color: var(--text-dim);
		line-height: 1.5;
		max-width: 36ch;
	}

	.footer {
		margin: 0;
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--muted);
	}
</style>
