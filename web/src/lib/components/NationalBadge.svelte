<script lang="ts">
	import type { MahallaSave } from '$lib/game/types';

	interface Props {
		level: MahallaSave['nationalLevel'];
		caps: number;
	}

	let { level, caps }: Props = $props();
</script>

{#if level !== 'none'}
	<div class="nat-badge">
		<span class="flag">🇽🇰</span>
		<span>{level}</span>
		<small>{caps} ndeshje</small>
	</div>
{/if}

<style>
	.nat-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		background: rgba(45, 106, 79, 0.2);
		border: 1px solid var(--accent);
		border-radius: 99px;
		padding: 0.25rem 0.65rem;
		font-size: 0.75rem;
		font-weight: 600;
		margin: 0.5rem 0;
	}

	.flag {
		font-size: 0.9rem;
	}

	small {
		color: var(--muted);
		font-weight: 400;
	}
</style>
