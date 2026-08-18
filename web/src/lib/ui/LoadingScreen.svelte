<script lang="ts">
	import { sq } from '$lib/i18n/sq';

	const messages = [sq.loadingMap, sq.loadingCareer, sq.loadingForm, sq.loadingMarket];

	let idx = $state(0);

	$effect(() => {
		const t = setInterval(() => {
			idx = (idx + 1) % messages.length;
		}, 2200);
		return () => clearInterval(t);
	});
</script>

<div class="loading-scene">
	<p class="kicker">{sq.loading}</p>
	<h1 class="display-mega">MAHALLA</h1>
	<p class="msg">{messages[idx]}</p>
	<div class="pulse-line" aria-hidden="true"></div>
</div>

<style>
	.loading-scene {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: var(--space-8) var(--viewport-pad);
		gap: var(--space-4);
		background: var(--canvas-deep);
	}

	.msg {
		margin: 0;
		color: var(--muted);
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		min-height: 1.5em;
	}

	.pulse-line {
		width: 64px;
		height: 1px;
		background: var(--gold);
		opacity: 0.4;
		animation: pulse 1.4s ease-in-out infinite;
		margin-top: var(--space-6);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.2;
			transform: scaleX(0.6);
		}
		50% {
			opacity: 1;
			transform: scaleX(1);
		}
	}
</style>
