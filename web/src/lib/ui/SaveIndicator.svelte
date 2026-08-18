<script lang="ts">
	import { sq } from '$lib/i18n/sq';

	interface Props {
		savedAt: number;
	}

	let { savedAt }: Props = $props();
</script>

<div class="save-indicator" aria-live="polite">
	<span class="dot"></span>
	{sq.saved}
</div>

<style>
	.save-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: var(--text-xs);
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--success);
		box-shadow: 0 0 8px var(--success);
	}
</style>
