<script lang="ts">
	import { INTERVIEW } from '$lib/game/interview';

	interface Props {
		step: number;
		choices: string[];
		onanswer: (choiceId: string) => void;
	}

	let { step, choices, onanswer }: Props = $props();

	const question = $derived(INTERVIEW[step]);
</script>

{#if question}
	<section class="scene interview-scene">
		<p class="map-step">05</p>
		<p class="kicker">Gazetar · Para sezonit të parë</p>
		<h2 class="display-xl question">{question.question}</h2>
		<p class="progress">{step + 1} / {INTERVIEW.length}</p>

		<div class="choice-stack">
			{#each question.choices as choice (choice.id)}
				<button type="button" class="choice-btn" onclick={() => onanswer(choice.id)}>
					{choice.label}
				</button>
			{/each}
		</div>
	</section>
{/if}

<style>
	.interview-scene {
		min-height: min(82dvh, 720px);
		justify-content: flex-end;
		gap: var(--space-5);
	}

	.question {
		max-width: 16ch;
	}

	.progress {
		margin: 0;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--muted);
	}

	.choice-btn {
		min-height: 56px;
		padding: var(--space-3) var(--space-4);
		text-align: left;
		background: transparent;
		border: none;
		border-top: 1px solid var(--line);
		color: var(--text);
		font-size: var(--text-md);
		line-height: 1.35;
		transition: color var(--duration-normal) var(--ease-out),
			border-color var(--duration-normal) var(--ease-out);
	}

	.choice-btn:hover,
	.choice-btn:focus-visible {
		color: var(--gold);
		border-color: var(--gold-dim);
	}
</style>
