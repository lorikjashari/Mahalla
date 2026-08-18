<script lang="ts">
	import { sq } from '$lib/i18n/sq';

	interface Props {
		onselect: (gender: 'male' | 'female') => void;
	}

	let { onselect }: Props = $props();
</script>

<section class="scene creation-scene">
	<p class="map-step">02</p>
	<p class="kicker">{sq.chooseGender}</p>
	<p class="body-story body-story--wide">{sq.genderHint}</p>

	<div class="choice-duo">
		<button type="button" class="choice-hero" onclick={() => onselect('male')}>
			<span class="choice-label">{sq.male}</span>
			<span class="choice-tag">{sq.genderMaleTag}</span>
		</button>
		<button type="button" class="choice-hero" onclick={() => onselect('female')}>
			<span class="choice-label">{sq.female}</span>
			<span class="choice-tag">{sq.genderFemaleTag}</span>
		</button>
	</div>
</section>

<style>
	.creation-scene {
		min-height: min(82dvh, 720px);
		justify-content: flex-end;
		gap: var(--space-6);
	}

	.choice-duo {
		display: grid;
		gap: var(--space-2);
		width: 100%;
		max-width: 480px;
	}

	.choice-hero {
		min-height: 88px;
		padding: var(--space-4) var(--space-5);
		text-align: left;
		background: transparent;
		border: none;
		border-top: 1px solid var(--line);
		color: var(--text);
		transition: color var(--duration-normal) var(--ease-out),
			border-color var(--duration-normal) var(--ease-out);
	}

	.choice-hero:hover,
	.choice-hero:focus-visible {
		border-color: var(--gold);
		color: var(--gold);
	}

	.choice-label {
		display: block;
		font-family: var(--font-display);
		font-size: clamp(2rem, 8vw, 2.75rem);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		line-height: 0.95;
	}

	.choice-tag {
		display: block;
		margin-top: var(--space-2);
		font-size: var(--text-sm);
		color: var(--muted);
		line-height: 1.45;
		max-width: 32ch;
	}

	.choice-hero:hover .choice-tag,
	.choice-hero:focus-visible .choice-tag {
		color: var(--text-dim);
	}

	@media (min-width: 900px) {
		.choice-duo {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-8);
		}

		.choice-hero {
			border-top: none;
			border-left: 1px solid var(--line);
			padding-left: var(--space-6);
		}

		.choice-hero:first-child {
			border-left: none;
			padding-left: 0;
		}
	}
</style>
