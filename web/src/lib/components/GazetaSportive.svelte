<script lang="ts">
	import type { SeasonRecap } from '$lib/game/types';

	interface Props {
		headline: string;
		season: number;
		age: number;
		clubName: string;
		recap: SeasonRecap;
	}

	let { headline, season, age, clubName, recap }: Props = $props();

	const today = $derived(
		new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })
	);
</script>

<article class="gazeta">
	<header class="masthead">
		<p class="paper-kicker">GAZETA SPORTIVE · {today}</p>
		<p class="season-line">Sezoni {season} · {age} vjeç · {clubName}</p>
	</header>

	<h3 class="headline">{headline}</h3>

	<div class="info-rail gazeta-stats">
		<div class="info-rail-item">
			<span>Gola</span>
			<strong>{recap.goals}</strong>
		</div>
		<div class="info-rail-item">
			<span>Asistime</span>
			<strong>{recap.assists}</strong>
		</div>
		<div class="info-rail-item">
			<span>Minuta</span>
			<strong>{recap.minutesPct}%</strong>
		</div>
		<div class="info-rail-item">
			<span>OVR</span>
			<strong>{recap.ovrDelta >= 0 ? '+' : ''}{recap.ovrDelta}</strong>
		</div>
	</div>
</article>

<style>
	.gazeta {
		padding: var(--space-5) 0;
		border-top: 2px solid var(--line-strong);
		border-bottom: 1px solid var(--line);
	}

	.masthead {
		margin-bottom: var(--space-4);
	}

	.paper-kicker {
		margin: 0 0 var(--space-2);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--gold-dim);
	}

	.season-line {
		margin: 0;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
	}

	.headline {
		margin: 0 0 var(--space-4);
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 6vw, 2.25rem);
		line-height: 1.1;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		max-width: 22ch;
	}

	.gazeta-stats {
		margin-top: 0;
		padding-top: var(--space-4);
		border-top: 1px solid var(--line);
	}
</style>
