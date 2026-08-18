<script lang="ts">
	import GameButton from '$lib/ui/GameButton.svelte';
	import PantheonPanel from '$lib/components/PantheonPanel.svelte';
	import LegacyPicker from '$lib/components/LegacyPicker.svelte';
	import DailyChallengeCard from '$lib/ui/DailyChallengeCard.svelte';
	import DuelModeBanner from '$lib/ui/DuelModeBanner.svelte';
	import InstallPrompt from '$lib/ui/InstallPrompt.svelte';
	import type { MahallaMeta } from '$lib/game/meta';
	import type { DuelConfig } from '$lib/game/meta';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		pantheon: MahallaMeta['pantheon'];
		meta: MahallaMeta;
		selectedLegacies: string[];
		duelConfig: DuelConfig | null;
		dailyActive: boolean;
		onplay: () => void;
		ondaily: () => void;
		onimport: () => void;
		onlegacies: (ids: string[]) => void;
		importError?: string;
	}

	let {
		pantheon,
		meta,
		selectedLegacies,
		duelConfig,
		dailyActive,
		onplay,
		ondaily,
		onimport,
		onlegacies,
		importError = ''
	}: Props = $props();
</script>

<div class="home-canvas">
	<div class="home-title-block">
		<p class="kicker kicker--green">{sq.tagline}</p>
		<h1 class="display-mega">MAHALLA</h1>
	</div>

	<div class="home-side">
		<div class="home-meta">
			<InstallPrompt />
			{#if duelConfig}
				<DuelModeBanner config={duelConfig} />
			{:else}
				<DailyChallengeCard active={dailyActive} />
			{/if}
			<PantheonPanel entries={pantheon} />
			<LegacyPicker meta={meta} selected={selectedLegacies} onchange={onlegacies} />
		</div>

		<div class="home-actions">
			<GameButton variant="gold" size="lg" full onclick={onplay}>{sq.play}</GameButton>
			<GameButton variant="ghost" full onclick={ondaily}>{sq.dailyChallenge}</GameButton>
			<GameButton variant="ghost" full onclick={onimport}>{sq.importSave}</GameButton>
			{#if importError}
				<p class="import-error">{importError}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.import-error {
		margin: 0;
		text-align: center;
		color: var(--danger);
		font-size: var(--text-sm);
	}
</style>
