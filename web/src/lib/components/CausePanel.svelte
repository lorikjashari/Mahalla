<script lang="ts">
	import type { CauseEntry } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		causes: CauseEntry[];
		minutesPct: number;
	}

	let { causes, minutesPct }: Props = $props();

	const headline = $derived(minutesPct >= 50 ? sq.causePlay : sq.causeBench);

	const summary = $derived.by(() => {
		const top = [...causes].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0];
		if (!top) return '';
		if (minutesPct >= 50) {
			return `${top.label} ndikon pozitivisht — ${minutesPct}% minuta sezonin e kaluar.`;
		}
		return `${top.label} po të pengon — vetëm ${minutesPct}% minuta.`;
	});

	const topCauses = $derived([...causes].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 3));
</script>

<section class="cause-scene" aria-labelledby="cause-title">
	<p class="kicker" id="cause-title">{headline}</p>
	<p class="body-story">{summary}</p>

	<div class="info-rail">
		<div class="info-rail-item">
			<span>{sq.minutes}</span>
			<strong>{minutesPct}%</strong>
		</div>
		{#each topCauses as c (c.label)}
			<div class="info-rail-item">
				<span>{c.label}</span>
				<strong class:pos={c.positive} class:neg={!c.positive}>
					{c.value > 0 ? '+' : ''}{c.value}
				</strong>
			</div>
		{/each}
	</div>
</section>

<style>
	.cause-scene {
		padding: var(--space-4) 0;
		border-top: 1px solid var(--line);
	}

	.pos {
		color: var(--success);
	}

	.neg {
		color: var(--danger);
	}
</style>
