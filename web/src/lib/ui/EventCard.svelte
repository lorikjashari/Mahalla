<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import { emitFeedback } from '$lib/game/feedback';
	import type { GameEvent } from '$lib/game/engine';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		event: GameEvent;
		onchoose: (id: string) => void;
	}

	let { event, onchoose }: Props = $props();

	let resolving = $state(false);
	let pickedLabel = $state('');

	function pick(id: string, label: string) {
		if (resolving) return;
		resolving = true;
		pickedLabel = label;
		emitFeedback('choice');
		setTimeout(() => {
			emitFeedback('confirm');
			onchoose(id);
			resolving = false;
			pickedLabel = '';
		}, 700);
	}
</script>

<section class="scene scene--center event-scene" aria-live="polite">
	<div class="event-copy">
		<p class="kicker">{sq.eventMoment}</p>
		<h2 class="display-xl">{event.title}</h2>
		<p class="body-story body-story--wide">"{event.body}"</p>
	</div>

	{#if resolving}
		<p class="picked-line">{pickedLabel}</p>
	{:else}
		<div class="choice-stack">
			{#each event.choices as choice, i (choice.id)}
				<GameButton
					variant={i === 0 ? 'gold' : 'ghost'}
					size="lg"
					full
					onclick={() => pick(choice.id, choice.label)}
				>
					{choice.label}
				</GameButton>
			{/each}
		</div>
	{/if}
</section>

<style>
	.event-scene {
		justify-content: space-between;
		min-height: min(82dvh, 760px);
		padding-top: var(--space-10);
	}

	.event-copy {
		align-self: flex-start;
		text-align: left;
		width: 100%;
		max-width: 520px;
	}

	.picked-line {
		align-self: center;
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--gold);
		animation: sceneIn var(--duration-normal) var(--ease-out);
	}
</style>
