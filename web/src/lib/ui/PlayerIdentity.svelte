<script lang="ts">
	import type { MahallaSave } from '$lib/game/types';
	import { getTierLabel } from '$lib/data/clubs';
	import { stageLabel, type CareerStageTheme } from '$lib/game/careerTheme';
	import { sq } from '$lib/i18n/sq';
	import type { Position } from '$lib/game/types';

	interface Props {
		save: MahallaSave;
		stage: CareerStageTheme;
		minimal?: boolean;
	}

	let { save, stage, minimal = false }: Props = $props();

	const positionLabels: Record<Position, string> = {
		GK: sq.positionGK,
		DF: sq.positionDF,
		MF: sq.positionMF,
		FW: sq.positionFW
	};
</script>

<header class="player-cover stage-{stage}" class:minimal>
	<div class="cover-top">
		<div class="age-block">
			<span class="age-num">{save.player.age}</span>
			<span class="age-label">{sq.yearsOld}</span>
		</div>
		{#if !minimal}
			<span class="stage">{stageLabel(stage)}</span>
		{/if}
	</div>

	<h1 class="name">{save.player.name}</h1>
	<p class="role">{positionLabels[save.player.position]}</p>
	<p class="club">{save.currentClub.name}</p>

	<div class="ovr-row">
		<span class="ovr-num">{save.player.ovr}</span>
		<span class="ovr-label">{sq.ovr}</span>
	</div>

	{#if !minimal}
		<div class="info-rail">
			<div class="info-rail-item">
				<span>{sq.form}</span>
				<strong>{save.player.form}</strong>
			</div>
			<div class="info-rail-item">
				<span>{sq.season}</span>
				<strong>{save.player.season}</strong>
			</div>
			<div class="info-rail-item">
				<span>G</span>
				<strong>{save.player.goals}</strong>
			</div>
			<div class="info-rail-item">
				<span>A</span>
				<strong>{save.player.assists}</strong>
			</div>
		</div>
		<p class="tier">{getTierLabel(save.currentTier)}</p>
	{/if}
</header>

<style>
	.player-cover {
		padding: var(--space-2) 0 var(--space-5);
		animation: sceneIn var(--duration-cinematic) var(--ease-cine);
	}

	.minimal {
		padding-bottom: var(--space-3);
	}

	.cover-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-4);
	}

	.age-block {
		display: flex;
		flex-direction: column;
	}

	.age-num {
		font-family: var(--font-display);
		font-size: clamp(2rem, 8vw, 2.75rem);
		line-height: 0.9;
		color: var(--gold);
	}

	.age-label {
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--muted);
	}

	.stage {
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--stage-accent, var(--accent-bright));
		padding-top: 0.35rem;
	}

	.name {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 10vw, 3.5rem);
		line-height: 0.92;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		max-width: 12ch;
	}

	.role {
		margin: var(--space-2) 0 0;
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--muted);
	}

	.club {
		margin: var(--space-1) 0 0;
		font-family: var(--font-display);
		font-size: var(--text-xl);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-dim);
	}

	.ovr-row {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
		margin-top: var(--space-5);
	}

	.ovr-num {
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 16vw, 5rem);
		line-height: 0.85;
		letter-spacing: -0.02em;
	}

	.ovr-label {
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--muted);
	}

	.tier {
		margin: var(--space-3) 0 0;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted-deep);
	}
</style>
