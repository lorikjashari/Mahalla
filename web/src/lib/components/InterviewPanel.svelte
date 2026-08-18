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
	<div class="interview card">
		<p class="journalist">Gazetar: "Para sezonit të parë — pyetje të shpejta…"</p>
		<h2 class="screen-title">{question.question}</h2>
		<div class="choice-list">
			{#each question.choices as choice (choice.id)}
				<button type="button" onclick={() => onanswer(choice.id)}>{choice.label}</button>
			{/each}
		</div>
		<p class="progress">{step + 1} / {INTERVIEW.length}</p>
	</div>
{/if}

<style>
	.interview {
		margin: 1rem 0;
	}

	.journalist {
		font-size: 0.82rem;
		color: var(--muted);
		font-style: italic;
		margin: 0 0 0.75rem;
	}

	.progress {
		text-align: center;
		font-size: 0.75rem;
		color: var(--muted);
		margin: 0.75rem 0 0;
	}
</style>
