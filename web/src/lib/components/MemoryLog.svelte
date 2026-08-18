<script lang="ts">
	import { getActiveMemories } from '$lib/game/flags';

	interface Props {
		flags: string[];
	}

	let { flags }: Props = $props();

	const memories = $derived(getActiveMemories(flags));
</script>

{#if memories.length > 0}
	<div class="memory-log">
		<h3>Kujtesa aktive</h3>
		<ul>
			{#each memories as m (m.id)}
				<li>{m.label}</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.memory-log {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.85rem 1rem;
		margin: 0.75rem 0;
	}

	h3 {
		margin: 0 0 0.5rem;
		font-size: 0.85rem;
		color: var(--gold);
	}

	ul {
		margin: 0;
		padding-left: 1.1rem;
		font-size: 0.82rem;
		color: var(--muted);
	}

	li {
		margin-bottom: 0.25rem;
	}
</style>
