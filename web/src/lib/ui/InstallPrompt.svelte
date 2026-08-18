<script lang="ts">
	import { onMount } from 'svelte';
	import GameButton from '$lib/ui/GameButton.svelte';
	import { sq } from '$lib/i18n/sq';

	interface InstallPromptEvent extends Event {
		prompt(): Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	let deferredPrompt = $state<InstallPromptEvent | null>(null);
	let dismissed = $state(false);
	let installed = $state(false);

	onMount(() => {
		if (typeof window === 'undefined') return;
		dismissed = localStorage.getItem('mahalla-install-dismissed') === '1';
		installed =
			window.matchMedia('(display-mode: standalone)').matches ||
			// @ts-expect-error iOS standalone
			window.navigator.standalone === true;

		const onInstall = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e as InstallPromptEvent;
		};
		const onInstalled = () => {
			installed = true;
			deferredPrompt = null;
		};

		window.addEventListener('beforeinstallprompt', onInstall);
		window.addEventListener('appinstalled', onInstalled);
		return () => {
			window.removeEventListener('beforeinstallprompt', onInstall);
			window.removeEventListener('appinstalled', onInstalled);
		};
	});

	async function install() {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		await deferredPrompt.userChoice;
		deferredPrompt = null;
	}

	function dismiss() {
		dismissed = true;
		localStorage.setItem('mahalla-install-dismissed', '1');
	}
</script>

{#if deferredPrompt && !dismissed && !installed}
	<section class="meta-strip install-strip" aria-label={sq.installTitle}>
		<p class="detail-kicker">{sq.installTitle}</p>
		<p class="meta-strip-hint">{sq.installHint}</p>
		<div class="install-actions">
			<GameButton variant="gold" onclick={install}>{sq.installCta}</GameButton>
			<button type="button" class="text-dismiss" onclick={dismiss}>{sq.installLater}</button>
		</div>
	</section>
{/if}

<style>
	.install-actions {
		display: grid;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}

	.text-dismiss {
		background: none;
		border: none;
		color: var(--muted);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 700;
		padding: var(--space-2) 0;
	}

	.text-dismiss:hover {
		color: var(--text);
	}
</style>
