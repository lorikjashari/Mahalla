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
		<div class="top-bar">
			<span>Edicioni digital · Kosovë</span>
			<span>{today}</span>
		</div>
		<h2 class="paper-name">GAZETA SPORTIVE</h2>
		<p class="tag">Çdo sezon ka historinë e vet</p>
	</header>

	<div class="hero">
		<span class="kicker">Sezoni {season} · {age} vjeç · {clubName}</span>
		<h3>{headline}</h3>
	</div>

	<div class="stats-row">
		<div><strong>{recap.goals}</strong><span>Gola</span></div>
		<div><strong>{recap.assists}</strong><span>Asistime</span></div>
		<div><strong>{recap.minutesPct}%</strong><span>Minuta</span></div>
		<div><strong>{recap.ovrDelta >= 0 ? '+' : ''}{recap.ovrDelta}</strong><span>OVR</span></div>
	</div>
</article>

<style>
	.gazeta {
		background: #f8f4ec;
		color: #1a1a1a;
		border: 2px solid #2a2a2a;
		border-radius: 4px;
		overflow: hidden;
		margin: 1rem 0;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
	}

	.masthead {
		background: #1a1a1a;
		color: #f8f4ec;
		padding: 0.65rem 0.85rem 0.75rem;
		text-align: center;
	}

	.top-bar {
		display: flex;
		justify-content: space-between;
		font-size: 0.58rem;
		opacity: 0.75;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: 0.35rem;
	}

	.paper-name {
		margin: 0;
		font-size: 1.35rem;
		letter-spacing: 0.14em;
		font-weight: 900;
		font-family: Georgia, 'Times New Roman', serif;
	}

	.tag {
		margin: 0.15rem 0 0;
		font-size: 0.65rem;
		opacity: 0.7;
		font-style: italic;
	}

	.hero {
		padding: 0.85rem;
		border-bottom: 3px double #1a1a1a;
	}

	.kicker {
		display: block;
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #555;
		margin-bottom: 0.35rem;
	}

	.hero h3 {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.35;
		font-family: Georgia, 'Times New Roman', serif;
		font-weight: 700;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		background: #fff;
	}

	.stats-row div {
		padding: 0.55rem 0.35rem;
		text-align: center;
		border-right: 1px solid #ddd;
	}

	.stats-row div:last-child {
		border-right: none;
	}

	.stats-row strong {
		display: block;
		font-size: 1.1rem;
		color: #1a1a1a;
	}

	.stats-row span {
		font-size: 0.6rem;
		text-transform: uppercase;
		color: #666;
	}
</style>
