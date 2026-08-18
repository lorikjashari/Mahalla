<script lang="ts">
	import { buildDuelLink } from '$lib/game/meta';
	import { copyText } from '$lib/game/storage';

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

<div class="share-duel">
	<p>Sfido shokun — i njëjti seed, zgjedhje të ndryshme:</p>
	<button type="button" class="gold" onclick={share}>
		{copied ? 'U kopjua! ✓' : 'Kopjo linkun e duelit'}
	</button>
	<code class="link-preview">{buildDuelLink(seed)}</code>
</div>

<style>
	.share-duel {
		background: rgba(45, 106, 79, 0.12);
		border: 1px solid var(--accent);
		border-radius: var(--radius);
		padding: 1rem;
		margin: 1rem 0;
	}

	p {
		margin: 0 0 0.75rem;
		font-size: 0.88rem;
		color: var(--muted);
	}

	button {
		width: 100%;
		margin-bottom: 0.5rem;
	}

	.link-preview {
		display: block;
		font-size: 0.65rem;
		color: var(--muted);
		word-break: break-all;
	}
</style>
