<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import { buildDailyLink, formatDailyLabel, getDailySeedValue } from '$lib/game/meta';
	import { copyText } from '$lib/game/storage';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		active?: boolean;
		compact?: boolean;
	}

	let { active = false, compact = false }: Props = $props();

	const dailyKey = $derived(getDailySeedValue().replace('daily-', ''));
	const dailyLabel = $derived(formatDailyLabel(dailyKey));
	let copied = $state(false);

	async function shareDaily() {
		const ok = await copyText(buildDailyLink(dailyKey));
		copied = ok;
		if (ok) setTimeout(() => (copied = false), 2500);
	}
</script>

<section class="meta-strip daily-strip" class:active aria-labelledby="daily-title">
	<p class="detail-kicker">{sq.dailyChallenge}</p>
	<h3 class="meta-strip-title" id="daily-title">{dailyLabel}</h3>
	<p class="meta-strip-hint">{sq.dailyHint}</p>
	{#if active}
		<p class="live-tag">{sq.dailyLive}</p>
	{:else if !compact}
		<p class="seed">Seed · {dailyKey}</p>
	{/if}
	{#if !compact}
		<GameButton variant="ghost" full onclick={shareDaily}>
			{copied ? sq.dailyCopied : sq.dailyShare}
		</GameButton>
	{/if}
</section>

<style>
	.daily-strip.active .meta-strip-title {
		color: var(--gold);
	}

	.live-tag {
		margin: 0;
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--live);
		font-weight: 700;
	}

	.seed {
		margin: 0;
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}
</style>
