<script lang="ts">
	interface Props {
		value: number;
		max?: number;
		label?: string;
		variant?: 'default' | 'gold' | 'danger';
		showValue?: boolean;
	}

	let { value, max = 100, label, variant = 'default', showValue = true }: Props = $props();
	const pct = $derived(Math.min(100, Math.max(0, Math.round((value / max) * 100))));
</script>

<div class="progress-wrap">
	{#if label}
		<div class="progress-head">
			<span class="label">{label}</span>
			{#if showValue}
				<span class="value">{pct}%</span>
			{/if}
		</div>
	{/if}
	<div class="track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
		<div class="fill {variant}" style="width: {pct}%"></div>
	</div>
</div>

<style>
	.progress-wrap {
		width: 100%;
	}

	.progress-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.35rem;
	}

	.label {
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
		font-weight: 700;
	}

	.value {
		font-family: var(--font-display);
		font-size: var(--text-sm);
		color: var(--text);
	}

	.track {
		height: 8px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 99px;
		overflow: hidden;
	}

	.fill {
		height: 100%;
		border-radius: 99px;
		transition: width var(--duration-cinematic) var(--ease-out);
	}

	.fill.default {
		background: linear-gradient(90deg, var(--accent), var(--success));
	}

	.fill.gold {
		background: linear-gradient(90deg, #9a7209, var(--gold));
	}

	.fill.danger {
		background: linear-gradient(90deg, #8b3a2a, var(--danger));
	}
</style>
