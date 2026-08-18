<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import type { MatchMoment } from '$lib/game/match';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		match: MatchMoment;
		onchoice: (id: string) => void;
	}

	let { match, onchoice }: Props = $props();
</script>

<section class="scene scene--match match-scene">
	<div class="match-head">
		<p class="kicker kicker--live">{sq.matchLive}</p>
		<p class="minute">{match.minute}'</p>
	</div>

	<div class="scoreboard">
		<div class="team">
			<span class="team-name">{match.homeTeam}</span>
		</div>
		<div class="score">
			<span>{match.homeScore}</span>
			<span class="dash">—</span>
			<span>{match.awayScore}</span>
		</div>
		<div class="team away">
			<span class="team-name">{match.awayTeam}</span>
		</div>
	</div>

	<p class="pressure">"{sq.matchPressure}"</p>

	<div class="decision-block">
		<p class="kicker">{sq.matchDecision}</p>
		<div class="choice-stack">
			<GameButton variant="gold" size="lg" full onclick={() => onchoice('attack')}>
				{sq.matchAttack}
			</GameButton>
			<GameButton variant="ghost" size="lg" full onclick={() => onchoice('control')}>
				{sq.matchControl}
			</GameButton>
			<GameButton variant="ghost" size="lg" full onclick={() => onchoice('defend')}>
				{sq.matchDefend}
			</GameButton>
		</div>
	</div>
</section>

<style>
	.match-head {
		text-align: center;
	}

	.minute {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		color: var(--gold);
	}

	.scoreboard {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: var(--space-3);
		text-align: center;
	}

	.team-name {
		display: block;
		font-family: var(--font-display);
		font-size: clamp(1rem, 4vw, 1.35rem);
		text-transform: uppercase;
		line-height: 1.05;
	}

	.away .team-name {
		color: var(--text-dim);
	}

	.score {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 18vw, 6rem);
		line-height: 0.85;
	}

	.dash {
		color: var(--muted-deep);
		font-size: 0.55em;
	}

	.pressure {
		text-align: center;
		margin: 0;
		font-style: italic;
		color: var(--muted);
		font-size: var(--text-md);
	}

	.decision-block {
		width: 100%;
		max-width: 420px;
		align-self: center;
		text-align: center;
	}
</style>
