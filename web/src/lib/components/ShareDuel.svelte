<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import { buildDuelLink } from '$lib/game/meta';
	import { copyText } from '$lib/game/storage';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		seed: string;
	}

	let { seed }: Props = $props();

	let copied = $state(false);

	async function share() {
		const ok = await copyText(buildDuelLink(seed));
		copied = ok;
		if (ok) setTimeout(() => (copied = false), 2500);
	}
</script>

<section class="share-duel">
	<p class="kicker">{sq.duelMode}</p>
	<p class="body">{sq.duelShareHint}</p>
	<GameButton variant="gold" full onclick={share}>
		{copied ? sq.duelCopied : sq.shareDuel}
	</GameButton>
	<code class="link-preview">{buildDuelLink(seed)}</code>
</section>

<style>
	.share-duel {
		border-radius: var(--radius-lg);
		border: 1px solid var(--accent);
		background:
			linear-gradient(135deg, rgba(45, 106, 79, 0.15), transparent 60%),
			var(--surface);
		padding: var(--space-4);
		margin: var(--space-4) 0;
		text-align: center;
	}

	.kicker {
		margin: 0 0 var(--space-2);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--gold);
		font-weight: 700;
	}

	.body {
		margin: 0 0 var(--space-3);
		font-size: var(--text-sm);
		color: var(--muted);
		line-height: 1.45;
	}

	.link-preview {
		display: block;
		margin-top: var(--space-2);
		font-size: 0.62rem;
		color: var(--muted);
		word-break: break-all;
	}
</style>
