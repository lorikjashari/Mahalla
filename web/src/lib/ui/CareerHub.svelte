<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import type { MahallaSave, GamePhase } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		save: MahallaSave;
		phase: GamePhase;
		hasEvent: boolean;
		oncontinue: () => void;
	}

	let { save, phase, hasEvent, oncontinue }: Props = $props();

	const headline = $derived.by(() => {
		if (phase === 'event' && hasEvent) return sq.hubEvent;
		if (phase === 'match') return sq.hubMatch;
		if (phase === 'recap') return sq.hubRecap;
		if (phase === 'market') return sq.hubMarket;
		return sq.hubDefault;
	});

	const cta = $derived.by(() => {
		if (phase === 'event' && hasEvent) return sq.nextEvent;
		if (phase === 'match') return sq.nextMatch;
		if (phase === 'recap') return sq.nextRecap;
		if (phase === 'market') return sq.nextMarket;
		return sq.continue;
	});
</script>

<section class="scene career-moment">
	<p class="kicker">{sq.season} {String(save.player.season).padStart(2, '0')}</p>
	<h2 class="display-xl">{headline}</h2>
	<p class="context">{save.currentClub.name} · {save.player.age} {sq.yearsOld}</p>
	<GameButton variant="gold" size="lg" full onclick={oncontinue}>{cta}</GameButton>
</section>

<style>
	.career-moment {
		min-height: min(50dvh, 480px);
		justify-content: center;
		padding-top: var(--space-8);
	}

	.context {
		margin: 0 0 var(--space-6);
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}
</style>
