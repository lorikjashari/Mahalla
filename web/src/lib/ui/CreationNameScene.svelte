<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		name: string;
		duelLabel?: string;
		oninput: (value: string) => void;
		onrandom: () => void;
		onconfirm: () => void;
	}

	let { name, duelLabel, oninput, onrandom, onconfirm }: Props = $props();
</script>

<section class="scene creation-scene">
	<p class="map-step">04</p>
	<p class="kicker">{sq.yourName}</p>

	{#if duelLabel}
		<p class="duel-note">{duelLabel}</p>
	{/if}

	<div class="name-block">
		<input
			type="text"
			class="name-input"
			placeholder={sq.namePlaceholder}
			value={name}
			oninput={(e) => oninput(e.currentTarget.value)}
			maxlength="24"
			autocomplete="off"
			spellcheck="false"
		/>
		{#if name.trim()}
			<p class="name-preview">{name.trim().toUpperCase()}</p>
		{/if}
	</div>

	<div class="name-actions">
		<button type="button" class="text-action" onclick={onrandom}>{sq.randomName}</button>
		<GameButton variant="gold" size="lg" full disabled={!name.trim()} onclick={onconfirm}>
			{sq.eventContinue}
		</GameButton>
	</div>
</section>

<style>
	.creation-scene {
		min-height: min(82dvh, 720px);
		justify-content: flex-end;
		gap: var(--space-6);
	}

	.duel-note {
		margin: 0;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--gold-dim);
	}

	.name-block {
		width: 100%;
		max-width: 520px;
	}

	.name-input {
		width: 100%;
		padding: var(--space-3) 0;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--line-strong);
		color: var(--text);
		font-family: var(--font-display);
		font-size: clamp(2rem, 10vw, 3.5rem);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		line-height: 1;
	}

	.name-input::placeholder {
		color: var(--muted);
		opacity: 0.5;
	}

	.name-input:focus {
		outline: none;
		border-color: var(--gold);
	}

	.name-preview {
		margin: var(--space-3) 0 0;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--muted);
	}

	.name-actions {
		display: grid;
		gap: var(--space-3);
		width: 100%;
		max-width: 420px;
	}

	.text-action {
		background: none;
		border: none;
		color: var(--muted);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 700;
		padding: var(--space-2) 0;
	}

	.text-action:hover {
		color: var(--text);
	}
</style>
