<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import type { MahallaSave } from '$lib/game/types';
	import { emitFeedback } from '$lib/game/feedback';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		level: MahallaSave['nationalLevel'];
		oncontinue: () => void;
	}

	let { level, oncontinue }: Props = $props();

	$effect(() => {
		emitFeedback('achievement');
	});
</script>

<div class="national-overlay" role="dialog" aria-modal="true">
	<section class="scene national-scene">
		<p class="kicker kicker--green">Kosovë</p>
		<p class="detail-kicker">{sq.nationalCallTitle}</p>
		<h2 class="display-xl">{sq.nationalCallBody}</h2>
		<p class="stat-huge">{level}<span class="stat-huge-label">{sq.nationalCall}</span></p>
		<GameButton variant="gold" size="lg" full onclick={oncontinue}>{sq.nationalCallAccept}</GameButton>
	</section>
</div>

<style>
	.national-overlay {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background:
			radial-gradient(ellipse 80% 50% at 50% 100%, rgba(45, 106, 79, 0.12), transparent 60%),
			rgba(5, 7, 8, 0.94);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: var(--viewport-pad);
		animation: sceneIn var(--duration-cinematic) var(--ease-cine);
	}

	.national-scene {
		min-height: auto;
		padding-bottom: calc(var(--space-8) + env(safe-area-inset-bottom));
		gap: var(--space-5);
	}
</style>
