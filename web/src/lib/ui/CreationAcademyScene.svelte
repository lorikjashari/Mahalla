<script lang="ts">
	import ClubLogo from '$lib/components/ClubLogo.svelte';
	import TravelMap from '$lib/components/TravelMap.svelte';
	import GameButton from '$lib/ui/GameButton.svelte';
	import type { AcademyAssignment } from '$lib/game/types';
	import type { Position } from '$lib/game/types';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		assignment: AcademyAssignment;
		playerName: string;
		positionLabel: string;
		onstart: () => void;
	}

	let { assignment, playerName, positionLabel, onstart }: Props = $props();

	const a = $derived(assignment);
</script>

<section class="scene academy-scene">
	<p class="map-step">06</p>
	<p class="kicker">{sq.academyTitle}</p>

	<div class="academy-hero">
		<ClubLogo
			name={a.academy.name}
			initials={a.academy.initials}
			colors={a.academy.colors}
			logoUrl={a.academy.logoUrl}
			size="lg"
		/>
		<h2 class="display-xl">{a.academy.name}</h2>
		<p class="academy-meta">
			{a.type === 'local' ? sq.academyLocal : sq.academyNearest} · {a.distanceKm} {sq.km}
		</p>
	</div>

	{#if a.type === 'nearest'}
		<div class="travel-wrap">
			<TravelMap
				fromLat={a.homeMunicipality.lat}
				fromLng={a.homeMunicipality.lng}
				toLat={a.academy.lat}
				toLng={a.academy.lng}
				fromName={a.homeMunicipality.name}
				toName={a.academy.name}
				distanceKm={a.distanceKm}
			/>
		</div>
	{/if}

	<div class="info-rail">
		<div class="info-rail-item">
			<span>{sq.age}</span>
			<strong>10</strong>
		</div>
		<div class="info-rail-item">
			<span>{playerName}</span>
			<strong>{positionLabel}</strong>
		</div>
		<div class="info-rail-item">
			<span>{a.homeMunicipality.name}</span>
			<strong>U11</strong>
		</div>
	</div>

	<p class="body-story">Futbolli yt fillon këtu.</p>

	<GameButton variant="gold" size="lg" full onclick={onstart}>{sq.startCareer}</GameButton>
</section>

<style>
	.academy-scene {
		min-height: min(85dvh, 760px);
		justify-content: flex-end;
		gap: var(--space-5);
	}

	.academy-hero {
		display: grid;
		gap: var(--space-3);
	}

	.academy-meta {
		margin: 0;
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.travel-wrap {
		width: 100%;
		max-width: 520px;
		opacity: 0.9;
	}

	.body-story {
		font-style: italic;
		color: var(--gold-dim);
	}
</style>
