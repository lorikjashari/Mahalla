<script lang="ts">
	import { settings } from '$lib/game/settings.svelte';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();
</script>

{#if open}
	<div class="settings-backdrop" onclick={onclose} role="presentation"></div>
	<section class="settings-panel" aria-label={sq.settings}>
		<div class="head">
			<h3>{sq.settings}</h3>
			<button type="button" class="close" onclick={onclose} aria-label={sq.close}>✕</button>
		</div>

		<label class="row">
			<span>
				<strong>{sq.settingsSound}</strong>
				<small>{sq.settingsSoundHint}</small>
			</span>
			<input
				type="checkbox"
				checked={settings.sound}
				onchange={(e) => settings.setSound(e.currentTarget.checked)}
			/>
		</label>

		<label class="row">
			<span>
				<strong>{sq.settingsHaptics}</strong>
				<small>{sq.settingsHapticsHint}</small>
			</span>
			<input
				type="checkbox"
				checked={settings.haptics}
				onchange={(e) => settings.setHaptics(e.currentTarget.checked)}
			/>
		</label>

		<label class="row">
			<span>
				<strong>{sq.settingsMotion}</strong>
				<small>{sq.settingsMotionHint}</small>
			</span>
			<input
				type="checkbox"
				checked={settings.reduceMotion}
				onchange={(e) => settings.setReduceMotion(e.currentTarget.checked)}
			/>
		</label>
	</section>
{/if}

<style>
	.settings-backdrop {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-overlay) - 1);
		background: rgba(0, 0, 0, 0.45);
	}

	.settings-panel {
		position: fixed;
		top: env(safe-area-inset-top, 0);
		right: 0;
		left: 0;
		margin: 0 auto;
		max-width: var(--shell-max);
		z-index: var(--z-overlay);
		padding: var(--space-4);
		border-radius: 0 0 var(--radius-lg) var(--radius-lg);
		border: 1px solid var(--border);
		border-top: none;
		background: var(--surface-elevated);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
		animation: slideDown var(--duration-normal) var(--ease-out);
	}

	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
	}

	h3 {
		margin: 0;
		font-family: var(--font-display);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--gold);
	}

	.close {
		background: none;
		border: none;
		color: var(--muted);
		font-size: 1.1rem;
		cursor: pointer;
		padding: var(--space-2);
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) 0;
		border-top: 1px solid var(--border-subtle);
		cursor: pointer;
	}

	.row strong {
		display: block;
		font-size: var(--text-sm);
	}

	.row small {
		display: block;
		margin-top: 0.15rem;
		font-size: var(--text-xs);
		color: var(--muted);
	}

	.row input {
		width: 18px;
		height: 18px;
		accent-color: var(--gold);
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
