<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import type { MilestoneDef } from '$lib/game/milestones';
	import { emitFeedback } from '$lib/game/feedback';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		milestone: MilestoneDef;
		ondismiss: () => void;
	}

	let { milestone, ondismiss }: Props = $props();

	$effect(() => {
		emitFeedback('milestone');
	});
</script>

<div class="milestone-overlay" role="dialog" aria-modal="true">
	<section class="scene milestone-scene">
		<p class="kicker">{sq.milestoneUnlocked}</p>
		<h2 class="display-xl">{milestone.title}</h2>
		<p class="body-story body-story--wide">{milestone.body}</p>
		<GameButton variant="gold" size="lg" full onclick={ondismiss}>{sq.milestoneContinue}</GameButton>
	</section>
</div>

<style>
	.milestone-overlay {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: rgba(5, 7, 8, 0.92);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: var(--viewport-pad);
		animation: sceneIn var(--duration-cinematic) var(--ease-cine);
	}

	.milestone-scene {
		min-height: auto;
		padding-bottom: calc(var(--space-8) + env(safe-area-inset-bottom));
	}
</style>
