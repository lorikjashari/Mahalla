<script lang="ts">
	import { getActiveMemories } from '$lib/game/flags';

	interface Props {
		flags: string[];
	}

	let { flags }: Props = $props();

	const memories = $derived(getActiveMemories(flags));
</script>

{#if memories.length > 0}
	<section class="detail-section memory-log" aria-labelledby="memory-title">
		<p class="detail-kicker" id="memory-title">Kujtesa aktive</p>
		<ul class="memory-list">
			{#each memories as m (m.id)}
				<li>{m.label}</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.memory-list {
		list-style: none;
		margin: var(--space-3) 0 0;
		padding: 0;
		display: grid;
		gap: var(--space-2);
	}

	.memory-list li {
		font-size: var(--text-sm);
		color: var(--text-dim);
		line-height: 1.45;
		padding-left: var(--space-3);
		border-left: 2px solid var(--line-strong);
	}
</style>
