<script lang="ts">
	import { emitFeedback } from '$lib/game/feedback';

	interface Props {
		variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost';
		size?: 'md' | 'lg';
		full?: boolean;
		disabled?: boolean;
		type?: 'button' | 'submit';
		onclick?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		full = false,
		disabled = false,
		type = 'button',
		onclick,
		children
	}: Props = $props();

	function handleClick() {
		if (disabled) return;
		emitFeedback('click');
		onclick?.();
	}
</script>

<button
	{type}
	class="game-btn {variant} {size}"
	class:full
	{disabled}
	onclick={handleClick}
>
	{@render children?.()}
</button>

<style>
	.game-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--touch-min);
		padding: 0.9rem 1.35rem;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-sm);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			transform var(--duration-fast) var(--ease-out),
			background var(--duration-fast),
			color var(--duration-fast),
			border-color var(--duration-fast);
	}

	.game-btn:active:not(:disabled) {
		transform: scale(0.98);
	}

	.game-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.game-btn.full {
		width: 100%;
	}

	.game-btn.lg {
		min-height: 56px;
		padding: 1rem 1.5rem;
		font-size: var(--text-md);
	}

	.primary {
		background: var(--accent);
		color: #fff;
	}

	.primary:hover:not(:disabled) {
		background: var(--accent-bright);
	}

	.secondary {
		background: transparent;
		border-color: var(--line-strong);
		color: var(--text);
	}

	.gold {
		background: var(--gold);
		color: #120e06;
	}

	.gold:hover:not(:disabled) {
		filter: brightness(1.05);
	}

	.danger {
		background: transparent;
		border-color: rgba(224, 90, 66, 0.45);
		color: var(--danger);
	}

	.ghost {
		background: transparent;
		border-color: var(--line);
		color: var(--text-dim);
	}

	.ghost:hover:not(:disabled) {
		color: var(--text);
		border-color: var(--line-strong);
	}
</style>
