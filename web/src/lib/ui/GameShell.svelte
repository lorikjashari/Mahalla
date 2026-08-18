<script lang="ts">
	import type { Snippet } from 'svelte';
	import SaveIndicator from '$lib/ui/SaveIndicator.svelte';
	import SettingsPanel from '$lib/ui/SettingsPanel.svelte';
	import { MAHALLA_VERSION } from '$lib/version';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		stageClass?: string;
		showSave?: boolean;
		savedAt?: number;
		immersive?: boolean;
		fullBleed?: boolean;
		onToggleMap?: () => void;
		onToggleDetails?: () => void;
		mapOpen?: boolean;
		children: Snippet;
	}

	let {
		stageClass = '',
		showSave = false,
		savedAt = Date.now(),
		immersive = false,
		fullBleed = false,
		onToggleMap,
		onToggleDetails,
		mapOpen = false,
		children
	}: Props = $props();

	let settingsOpen = $state(false);
</script>

<div class="viewport pitch-bg {stageClass}" class:immersive class:full-bleed={fullBleed}>
	<header class="hud">
		<div class="hud-brand">
			<span class="logo">MAHALLA</span>
		</div>
		<div class="hud-actions">
			{#if immersive && onToggleMap}
				<button type="button" class="hud-btn" class:is-active={mapOpen} onclick={onToggleMap}>
					{sq.navMap}
				</button>
			{/if}
			{#if immersive && onToggleDetails}
				<button type="button" class="hud-btn" onclick={onToggleDetails}>{sq.navDetails}</button>
			{/if}
			{#if showSave}
				<SaveIndicator {savedAt} />
			{/if}
			<button type="button" class="hud-icon" onclick={() => (settingsOpen = !settingsOpen)} aria-label={sq.settings}>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M12 15a3 3 0 100-6 3 3 0 000 6z"
						stroke="currentColor"
						stroke-width="1.5"
					/>
					<path
						d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
						stroke="currentColor"
						stroke-width="1.5"
					/>
				</svg>
			</button>
		</div>
	</header>

	<SettingsPanel open={settingsOpen} onclose={() => (settingsOpen = false)} />

	<main class="stage-canvas">
		{@render children()}
	</main>

	<footer class="hud-footer">
		<span>v{MAHALLA_VERSION}</span>
		<span>·</span>
		<a href="https://mahalla.pages.dev" target="_blank" rel="noopener">mahalla.pages.dev</a>
	</footer>
</div>

<style>
	.viewport {
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		padding: env(safe-area-inset-top) var(--viewport-pad) 0 var(--viewport-pad-r);
	}

	.immersive .hud-footer {
		display: none;
	}

	.hud {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) 0 var(--space-4);
		z-index: var(--z-elevated);
	}

	.logo {
		font-family: var(--font-display);
		font-size: 1.1rem;
		letter-spacing: 0.22em;
		color: var(--text-dim);
	}

	.hud-actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.hud-btn {
		min-height: 36px;
		padding: 0 var(--space-3);
		background: transparent;
		border: none;
		color: var(--muted);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 700;
	}

	.hud-btn.is-active,
	.hud-btn:hover {
		color: var(--gold);
	}

	.hud-icon {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		background: transparent;
		border: none;
		color: var(--muted);
		padding: 0;
	}

	.hud-icon:hover {
		color: var(--text);
	}

	.full-bleed {
		padding-left: 0;
		padding-right: 0;
	}

	.full-bleed .hud-footer {
		display: none;
	}

	.full-bleed .stage-canvas {
		padding-bottom: 0;
	}

	.full-bleed .hud {
		position: absolute;
		top: env(safe-area-inset-top);
		left: var(--viewport-pad);
		right: var(--viewport-pad-r);
		z-index: var(--z-elevated);
		padding-top: var(--space-3);
		background: linear-gradient(180deg, rgba(5, 7, 8, 0.92) 0%, transparent 100%);
	}

	.stage-canvas {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.hud-footer {
		padding: var(--space-4) 0 calc(var(--space-4) + env(safe-area-inset-bottom));
		text-align: center;
		font-size: var(--text-2xs);
		color: var(--muted-deep);
	}

	.hud-footer a {
		color: inherit;
		text-decoration: none;
	}
</style>
