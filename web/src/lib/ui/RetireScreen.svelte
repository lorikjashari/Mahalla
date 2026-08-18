<script lang="ts">
	import LegendCard from '$lib/components/LegendCard.svelte';
	import ShareDuel from '$lib/components/ShareDuel.svelte';
	import ShareLegend from '$lib/components/ShareLegend.svelte';
	import CareerMap from '$lib/components/CareerMap.svelte';
	import GameButton from '$lib/ui/GameButton.svelte';
	import { computeLegendScore } from '$lib/game/legend';
	import type { MahallaSave } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		save: MahallaSave;
		newLegacies: string[];
		onnewCareer: () => void;
		onexport: () => void;
	}

	let { save, newLegacies, onnewCareer, onexport }: Props = $props();

	const score = $derived(computeLegendScore(save));
	const peakOvr = $derived(Math.max(...save.seasonHistory.map((h) => h.ovr), save.player.ovr));
	const totalGoals = $derived(save.player.goals);
	const totalSeasons = $derived(save.player.season - 1);
</script>

<section class="scene retire-scene">
	<p class="kicker">{sq.retireKicker}</p>
	<h2 class="display-mega">{save.player.name}</h2>
	<p class="retire-sub">{score} {sq.legendPoints} · {totalSeasons} {sq.retireSeasons}</p>

	<div class="info-rail">
		<div class="info-rail-item">
			<span>{sq.retirePeakOvr}</span>
			<strong>{peakOvr}</strong>
		</div>
		<div class="info-rail-item">
			<span>{sq.legendGoals}</span>
			<strong>{totalGoals}</strong>
		</div>
		<div class="info-rail-item">
			<span>{sq.nationalCall}</span>
			<strong>{save.nationalCaps}</strong>
		</div>
		<div class="info-rail-item">
			<span>{sq.legendClubs}</span>
			<strong>{save.careerHistory.length}</strong>
		</div>
	</div>

	<CareerMap history={save.careerHistory} currentId={save.currentClub.id} />

	<LegendCard {save} />

	{#if newLegacies.length > 0}
		<div class="legacy-unlock">
			<p class="kicker kicker--green">{sq.newLegacies}</p>
			<p class="legacy-list">{newLegacies.join(' · ')}</p>
		</div>
	{/if}

	<ShareLegend />
	<ShareDuel seed={save.seed} />

	<div class="choice-stack">
		<GameButton variant="gold" size="lg" full onclick={onnewCareer}>{sq.newCareer}</GameButton>
		<GameButton variant="ghost" full onclick={onexport}>{sq.exportSave}</GameButton>
	</div>
</section>

<style>
	.retire-scene {
		min-height: min(88dvh, 820px);
		justify-content: flex-end;
		gap: var(--space-5);
		padding-bottom: var(--space-8);
	}

	.retire-sub {
		margin: 0;
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.legacy-unlock {
		padding: var(--space-4) 0;
		border-top: 1px solid var(--line);
	}

	.legacy-list {
		margin: var(--space-2) 0 0;
		color: var(--text-dim);
		font-size: var(--text-sm);
		line-height: 1.5;
	}
</style>
