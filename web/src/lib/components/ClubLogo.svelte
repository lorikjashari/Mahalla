<script lang="ts">
	interface Props {
		name: string;
		initials?: string;
		colors?: [string, string];
		logoUrl?: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let {
		name,
		initials = '?',
		colors = ['#2d6a4f', '#1b4332'],
		logoUrl,
		size = 'md'
	}: Props = $props();

	let imgError = $state(false);

	const px = $derived(size === 'sm' ? 36 : size === 'lg' ? 72 : 52);
</script>

<div
	class="club-logo"
	class:sm={size === 'sm'}
	class:lg={size === 'lg'}
	style="--c1:{colors[0]};--c2:{colors[1]};width:{px}px;height:{px}px"
	title={name}
>
	{#if logoUrl && !imgError}
		<img src={logoUrl} alt={name} onerror={() => (imgError = true)} />
	{:else if initials && initials !== '?'}
		<span class="initials">{initials}</span>
	{:else}
		<span class="unknown">?</span>
	{/if}
</div>

<style>
	.club-logo {
		border-radius: 50%;
		background: linear-gradient(145deg, var(--c1), var(--c2));
		display: grid;
		place-items: center;
		border: 2px solid rgba(255, 255, 255, 0.12);
		flex-shrink: 0;
		overflow: hidden;
	}

	.club-logo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.initials {
		font-weight: 800;
		font-size: 0.85rem;
		color: #fff;
		letter-spacing: -0.02em;
	}

	.sm .initials {
		font-size: 0.65rem;
	}

	.lg .initials {
		font-size: 1.1rem;
	}

	.unknown {
		font-size: 1.25rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.5);
	}

	.lg .unknown {
		font-size: 1.75rem;
	}
</style>
