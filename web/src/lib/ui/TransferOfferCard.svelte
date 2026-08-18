<script lang="ts">
	import ClubLogo from '$lib/components/ClubLogo.svelte';
	import GameButton from '$lib/ui/GameButton.svelte';
	import type { TransferOffer } from '$lib/game/types';
	import type { ClubDefinition } from '$lib/data/clubs';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		offer: TransferOffer;
		offerClub: ClubDefinition | undefined;
		fromName: string;
		onsign: () => void;
	}

	let { offer, offerClub, fromName, onsign }: Props = $props();
</script>

<article class="offer-scene">
	<div class="offer-route">
		<div class="route-end">
			<p class="route-label">{fromName}</p>
		</div>
		<div class="route-line">
			<span class="route-km">{offer.distanceKm} {sq.km}</span>
		</div>
		<div class="route-end route-end--dest">
			<ClubLogo
				name={offer.clubName}
				initials={offerClub?.initials ?? '?'}
				colors={offerClub?.colors ?? ['#333', '#555']}
				logoUrl={offerClub?.logoUrl}
				size="md"
			/>
			<p class="display-xl">{offer.clubName}</p>
			<p class="league">{offer.leagueName}</p>
		</div>
	</div>

	<div class="info-rail">
		<div class="info-rail-item">
			<span>{sq.role}</span>
			<strong>{offer.role}</strong>
		</div>
		<div class="info-rail-item">
			<span>{sq.minutes}</span>
			<strong>~{offer.minutesEstimate}%</strong>
		</div>
		<div class="info-rail-item">
			<span>{sq.ambition}</span>
			<strong>{offer.ambition}</strong>
		</div>
	</div>

	<GameButton variant="gold" full onclick={onsign}>{sq.sign}</GameButton>
</article>

<style>
	.offer-scene {
		display: grid;
		gap: var(--space-5);
		padding: var(--space-5) 0;
		border-bottom: 1px solid var(--line);
	}

	.offer-route {
		display: grid;
		gap: var(--space-3);
	}

	.route-end {
		display: grid;
		gap: var(--space-2);
	}

	.route-end--dest .display-xl {
		font-size: clamp(1.75rem, 7vw, 2.5rem);
	}

	.route-label {
		margin: 0;
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--muted);
	}

	.league {
		margin: 0;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--gold-dim);
	}

	.route-line {
		position: relative;
		height: 48px;
		margin-left: var(--space-2);
		border-left: 1px solid var(--gold-dim);
	}

	.route-km {
		position: absolute;
		left: var(--space-3);
		top: 50%;
		transform: translateY(-50%);
		font-family: var(--font-display);
		font-size: var(--text-lg);
		color: var(--gold);
		letter-spacing: 0.06em;
	}
</style>
