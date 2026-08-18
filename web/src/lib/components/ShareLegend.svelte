<script lang="ts">
	import { toPng } from 'html-to-image';
	import GameButton from '$lib/ui/GameButton.svelte';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		targetId?: string;
	}

	let { targetId = 'legend-card' }: Props = $props();

	let busy = $state(false);
	let done = $state(false);

	async function downloadPng() {
		const node = document.getElementById(targetId);
		if (!node || busy) return;
		busy = true;
		try {
			const dataUrl = await toPng(node, {
				cacheBust: true,
				pixelRatio: 2,
				backgroundColor: '#0f1419'
			});
			const a = document.createElement('a');
			a.href = dataUrl;
			a.download = `mahalla-legjenda-${Date.now()}.png`;
			a.click();
			done = true;
			setTimeout(() => (done = false), 2500);
		} finally {
			busy = false;
		}
	}
</script>

<GameButton variant="secondary" full disabled={busy} onclick={downloadPng}>
	{done ? sq.legendDownloaded : busy ? sq.legendDownloading : sq.legendDownload}
</GameButton>
