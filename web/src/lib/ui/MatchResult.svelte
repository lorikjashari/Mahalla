<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import type { MatchMoment } from '$lib/game/match';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		match: MatchMoment;
		oncontinue: () => void;
	}

	let { match, oncontinue }: Props = $props();

	const resultLabel = $derived(
		match.won ? sq.matchWin : match.drew ? sq.matchDraw : sq.matchLoss
	);
</script>

<section class="scene scene--center match-result-scene">
	<p class="kicker kicker--live">{match.minute}'</p>
	<div class="score">
		<span>{match.homeScore}</span>
		<span class="dash">—</span>
		<span>{match.awayScore}</span>
	</div>
	<h2 class="display-xl result">{resultLabel}</h2>
	<p class="body-story">"{match.keyMoment}"</p>
	{#if match.playerGoals > 0 || match.playerAssists > 0}
		<p class="stats-line">
			{#if match.playerGoals > 0}{match.playerGoals}G{/if}
			{#if match.playerAssists > 0}{match.playerAssists}A{/if}
		</p>
	{/if}
	<GameButton variant="gold" size="lg" full onclick={oncontinue}>{sq.matchContinue}</GameButton>
</section>

<style>
	.match-result-scene {
		min-height: min(78dvh, 720px);
		gap: var(--space-4);
	}

	.score {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		font-family: var(--font-display);
		font-size: clamp(4rem, 20vw, 7rem);
		line-height: 0.85;
	}

	.dash {
		color: var(--muted-deep);
	}

	.result {
		color: var(--gold);
	}

	.stats-line {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		color: var(--success);
		letter-spacing: 0.08em;
	}
</style>
