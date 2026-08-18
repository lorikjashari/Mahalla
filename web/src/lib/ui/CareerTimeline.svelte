<script lang="ts">
	import ClubLogo from '$lib/components/ClubLogo.svelte';
	import { clubById } from '$lib/data/clubs';
	import type { ClubHistoryEntry, MahallaSave } from '$lib/game/types';
	import { getTierLabel } from '$lib/data/clubs';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		history: ClubHistoryEntry[];
		currentId?: string;
	}

	let { history, currentId }: Props = $props();
</script>

<section class="career-timeline" aria-labelledby="timeline-title">
	<h3 id="timeline-title">{sq.careerTimeline}</h3>
	<div class="scroll-track">
		{#each history as h, i (h.clubId + h.season)}
			{@const def = clubById[h.clubId]}
			<article class="stop" class:current={h.clubId === currentId}>
				<ClubLogo
					name={h.clubName}
					initials={def?.initials ?? h.clubName.slice(0, 2).toUpperCase()}
					colors={def?.colors ?? ['#333', '#555']}
					logoUrl={def?.logoUrl}
					size="md"
				/>
				<strong>{h.clubName}</strong>
				<span class="meta">{h.age} {sq.yearsOld}</span>
				<span class="tier">{getTierLabel(h.leagueTier)}</span>
				{#if i < history.length - 1}
					<span class="arrow" aria-hidden="true">→</span>
				{/if}
			</article>
		{/each}
	</div>
</section>

<style>
	.career-timeline {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid var(--border);
		background: var(--surface);
	}

	h3 {
		margin: 0 0 var(--space-3);
		font-family: var(--font-display);
		font-size: var(--text-lg);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--gold);
	}

	.scroll-track {
		display: flex;
		gap: var(--space-2);
		overflow-x: auto;
		padding-bottom: var(--space-2);
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
	}

	.stop {
		position: relative;
		flex: 0 0 120px;
		scroll-snap-align: start;
		text-align: center;
		padding: var(--space-3) var(--space-2);
		border-radius: var(--radius);
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid transparent;
	}

	.stop.current {
		border-color: var(--gold);
		background: var(--gold-soft);
	}

	.stop strong {
		display: block;
		margin-top: var(--space-2);
		font-size: 0.72rem;
		line-height: 1.2;
	}

	.meta,
	.tier {
		display: block;
		font-size: 0.58rem;
		color: var(--muted);
		margin-top: 0.15rem;
	}

	.tier {
		color: var(--accent-hover);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.arrow {
		position: absolute;
		right: -0.65rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--gold);
		font-size: 0.85rem;
		z-index: 1;
	}
</style>
