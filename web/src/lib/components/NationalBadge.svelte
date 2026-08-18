<script lang="ts">
	import type { MahallaSave } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		level: MahallaSave['nationalLevel'];
		caps: number;
	}

	let { level, caps }: Props = $props();
</script>

{#if level !== 'none'}
	<div class="info-rail nat-rail">
		<div class="info-rail-item">
			<span>Kosovë</span>
			<strong>{level}</strong>
		</div>
		<div class="info-rail-item">
			<span>{sq.nationalCall}</span>
			<strong>{caps}</strong>
		</div>
	</div>
{/if}

<style>
	.nat-rail {
		margin-top: 0;
		padding-top: var(--space-4);
	}
</style>
