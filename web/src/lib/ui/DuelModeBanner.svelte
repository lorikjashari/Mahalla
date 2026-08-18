<script lang="ts">
	import type { DuelConfig } from '$lib/game/meta';
	import { sq } from '$lib/i18n/sq';
	import { municipalityById } from '$lib/data/municipalities';

	interface Props {
		config: DuelConfig;
	}

	let { config }: Props = $props();

	const city = $derived(municipalityById[config.municipalityId]?.name ?? config.municipalityId);
</script>

<section class="meta-strip duel-strip" aria-label={sq.duelMode}>
	<p class="detail-kicker">{sq.duelMode}</p>
	<h3 class="meta-strip-title">{sq.duelVs} {config.rivalName}</h3>
	<p class="meta-strip-hint">
		{city} · {config.position} · {config.gender === 'male' ? sq.male : sq.female}
	</p>
	<p class="duel-note">{sq.duelHint}</p>
</section>

<style>
	.duel-strip .meta-strip-title {
		color: var(--gold);
	}

	.duel-note {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--text-dim);
		line-height: 1.45;
		max-width: 36ch;
	}
</style>
