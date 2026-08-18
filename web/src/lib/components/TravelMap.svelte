<script lang="ts">
	import { toMapCoords } from '$lib/game/geo';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		fromLat: number;
		fromLng: number;
		toLat: number;
		toLng: number;
		fromName: string;
		toName: string;
		distanceKm: number;
	}

	let { fromLat, fromLng, toLat, toLng, fromName, toName, distanceKm }: Props = $props();

	const from = $derived(toMapCoords(fromLat, fromLng));
	const to = $derived(toMapCoords(toLat, toLng));
	const mx = $derived((from.x + to.x) / 2);
	const my = $derived(Math.min(from.y, to.y) - 8);
</script>

<div class="travel-map">
	<svg viewBox="0 0 100 50" class="mini-map">
		<rect width="100" height="50" class="bg" />
		<path
			d="M {from.x} {from.y + 2} Q {mx} {my} {to.x} {to.y + 2}"
			class="route"
			fill="none"
		/>
		<circle cx={from.x} cy={from.y + 2} r="2.5" class="from-dot" />
		<circle cx={to.x} cy={to.y + 2} r="2.5" class="to-dot" />
	</svg>
	<p>
		{sq.travel}: <strong>{fromName}</strong> → <strong>{toName}</strong>
		· {distanceKm} {sq.km}
	</p>
</div>

<style>
	.travel-map {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.75rem;
	}

	.mini-map {
		width: 100%;
		height: auto;
		margin-bottom: 0.5rem;
	}

	.bg {
		fill: #121a16;
	}

	.route {
		stroke: var(--gold);
		stroke-width: 0.6;
		stroke-dasharray: 2 1;
		opacity: 0.9;
		animation: dash 2s linear infinite;
	}

	@keyframes dash {
		to {
			stroke-dashoffset: -6;
		}
	}

	.from-dot {
		fill: var(--muted);
	}

	.to-dot {
		fill: var(--accent);
	}

	p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--muted);
		line-height: 1.4;
	}

	strong {
		color: var(--text);
	}
</style>
