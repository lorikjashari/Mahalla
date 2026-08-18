<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { wireFeedbackBridge } from '$lib/audio/bridge';
	import { game } from '$lib/game/store.svelte';
	import { randomName } from '$lib/game/names';
	import { clubById } from '$lib/data/clubs';
	import CareerMap from '$lib/components/CareerMap.svelte';
	import CareerCharts from '$lib/components/CareerCharts.svelte';
	import GazetaSportive from '$lib/components/GazetaSportive.svelte';
	import { exportSave } from '$lib/game/storage';
	import { getUrlParams } from '$lib/game/meta';
	import { municipalityById } from '$lib/data/municipalities';
	import KosovoMapScene from '$lib/ui/KosovoMapScene.svelte';
	import HomeScreen from '$lib/ui/HomeScreen.svelte';
	import CreationGenderScene from '$lib/ui/CreationGenderScene.svelte';
	import CreationNameScene from '$lib/ui/CreationNameScene.svelte';
	import CreationAcademyScene from '$lib/ui/CreationAcademyScene.svelte';
	import CausePanel from '$lib/components/CausePanel.svelte';
	import InterviewPanel from '$lib/components/InterviewPanel.svelte';
	import MemoryLog from '$lib/components/MemoryLog.svelte';
	import NationalBadge from '$lib/components/NationalBadge.svelte';
	import GameShell from '$lib/ui/GameShell.svelte';
	import LoadingScreen from '$lib/ui/LoadingScreen.svelte';
	import PlayerIdentity from '$lib/ui/PlayerIdentity.svelte';
	import EventCard from '$lib/ui/EventCard.svelte';
	import TransferOfferCard from '$lib/ui/TransferOfferCard.svelte';
	import RivalCompare from '$lib/ui/RivalCompare.svelte';
	import PositionPicker from '$lib/ui/PositionPicker.svelte';
	import GameButton from '$lib/ui/GameButton.svelte';
	import { getCareerStageTheme } from '$lib/game/careerTheme';
	import { buildNotifications } from '$lib/game/notifications';
	import MatchCard from '$lib/ui/MatchCard.svelte';
	import MatchResult from '$lib/ui/MatchResult.svelte';
	import RelationshipPanel from '$lib/ui/RelationshipPanel.svelte';
	import NotificationCenter from '$lib/ui/NotificationCenter.svelte';
	import MilestoneModal from '$lib/ui/MilestoneModal.svelte';
	import NationalTeamCall from '$lib/ui/NationalTeamCall.svelte';
	import RetireScreen from '$lib/ui/RetireScreen.svelte';
	import TransferCinematic from '$lib/ui/TransferCinematic.svelte';
	import { sq } from '$lib/i18n/sq';
	import type { Position } from '$lib/game/types';

	let { children } = $props();
	let importInput: HTMLInputElement | undefined = $state();
	let importError = $state('');

	const urlParams = $derived(getUrlParams());
	const stageTheme = $derived(getCareerStageTheme(game.save));
	const stageClass = $derived(`stage-${stageTheme}`);

	const positions: { id: Position; label: string }[] = [
		{ id: 'GK', label: sq.positionGK },
		{ id: 'DF', label: sq.positionDF },
		{ id: 'MF', label: sq.positionMF },
		{ id: 'FW', label: sq.positionFW }
	];

	const inMoment = $derived(
		!!game.save &&
			(game.save.phase === 'event' ||
				game.save.phase === 'match' ||
				game.save.phase === 'recap' ||
				game.save.phase === 'market')
	);

	const creationImmersive = $derived(
		!game.save &&
			['city', 'gender', 'position', 'name', 'interview', 'academy'].includes(game.creation.step)
	);

	onMount(() => wireFeedbackBridge());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Mahalla — Karrierë futbollistike</title>
	<meta name="description" content="Simulues karriere futbollistike kosovare. Nga lagjja te legjenda." />
	<link rel="apple-touch-icon" href="/icons/icon.svg" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta property="og:title" content="Mahalla — Karrierë futbollistike" />
	<meta property="og:description" content="Nga lagjja te legjenda. Simulues karriere kosovare." />
	<meta property="og:url" content="https://mahalla.pages.dev" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="keywords" content="Mahalla, futboll, Kosovë, karrierë, simulues, lojë" />
	<link rel="canonical" href="https://mahalla.pages.dev/" />
</svelte:head>

{@render children()}

{#if !game.ready}
	<LoadingScreen />
{:else}
	<GameShell
		stageClass={game.save ? stageClass : 'stage-mahalla'}
		showSave={!!game.save}
		savedAt={game.savedAt}
		immersive={!!game.save && game.save.phase !== 'end'}
		fullBleed={creationImmersive}
		mapOpen={game.showCareerPanel}
		onToggleMap={() => (game.showCareerPanel = !game.showCareerPanel)}
		onToggleDetails={() => (game.showCareerPanel = !game.showCareerPanel)}
	>
		{#if !game.save && game.creation.step === 'home'}
			<HomeScreen
				pantheon={game.meta.pantheon}
				meta={game.meta}
				selectedLegacies={game.selectedLegacies}
				duelConfig={game.duelConfig}
				dailyActive={!!urlParams.daily}
				onplay={() => game.startNew()}
				ondaily={() => game.startDaily()}
				onimport={() => importInput?.click()}
				onlegacies={(ids) => game.setLegacies(ids)}
				importError={importError}
			/>
			<input
				bind:this={importInput}
				type="file"
				accept="application/json,.json"
				hidden
				onchange={async (e) => {
					importError = '';
					const file = e.currentTarget.files?.[0];
					if (!file) return;
					try {
						await game.importCareer(file);
					} catch {
						importError = sq.importError;
					}
					e.currentTarget.value = '';
				}}
			/>
		{:else if !game.save && game.creation.step === 'city'}
			<KosovoMapScene
				selectedId={game.creation.municipalityId}
				onselect={(id) => game.selectCity(id)}
				onconfirm={() => (game.creation.step = 'gender')}
			/>
		{:else if !game.save && game.creation.step === 'gender'}
			<CreationGenderScene onselect={(gender) => game.selectGender(gender)} />
		{:else if !game.save && game.creation.step === 'position'}
			<PositionPicker
				selected={game.creation.position}
				onselect={(p) => game.selectPosition(p)}
				oncontinue={() => (game.creation.step = 'name')}
			/>
		{:else if !game.save && game.creation.step === 'name'}
			<CreationNameScene
				name={game.creation.name}
				duelLabel={game.duelConfig
					? `Duel · ${municipalityById[game.duelConfig.municipalityId]?.name ?? ''}`
					: undefined}
				oninput={(value) => game.setName(value)}
				onrandom={() => game.creation.gender && game.setName(randomName(game.creation.gender))}
				onconfirm={() => game.confirmName()}
			/>
		{:else if !game.save && game.creation.step === 'interview'}
			<InterviewPanel
				step={game.creation.interviewStep}
				choices={game.creation.interviewChoices}
				onanswer={(id) => game.answerInterview(id)}
			/>
		{:else if !game.save && game.creation.step === 'academy' && game.creation.assignment}
			<CreationAcademyScene
				assignment={game.creation.assignment}
				playerName={game.creation.name}
				positionLabel={positions.find((p) => p.id === game.creation.position)?.label ?? ''}
				onstart={() => game.beginCareer()}
			/>
		{:else if game.save}
			{@const s = game.save}
			{@const club = s.currentClub}

			{#if game.lastTransferAnim}
				<TransferCinematic
					transfer={game.lastTransferAnim}
					ondismiss={() => game.dismissTransferAnim()}
				/>
			{/if}

			{#if s.phase === 'end'}
				<RetireScreen
					save={s}
					newLegacies={game.newlyUnlockedLegacies}
					onnewCareer={() => game.reset()}
					onexport={() => exportSave(JSON.stringify(s))}
				/>
			{:else}
				<PlayerIdentity save={s} stage={stageTheme} minimal={inMoment} />

				{#if game.showCareerPanel}
					<div class="details-layer">
						<CareerMap history={s.careerHistory} currentId={club.id} />
						<RivalCompare
							playerName={s.player.name}
							playerOvr={s.player.ovr}
							rivalName={s.rivalName}
							rivalOvr={s.rivalOvr}
							playerForm={s.player.form}
							playerGoals={s.player.goals}
						/>
						<RelationshipPanel save={s} />
						<NotificationCenter notifications={buildNotifications(s, game.offers.length)} />
						<NationalBadge level={s.nationalLevel} caps={s.nationalCaps} />
						<MemoryLog flags={s.flags} />
						{#if s.seasonHistory.length > 0}
							<CareerCharts history={s.seasonHistory} />
						{/if}
					</div>
				{/if}

				<div class="moment-layer">
					{#if s.phase === 'event' && game.currentEvent}
						<EventCard event={game.currentEvent} onchoose={(id) => game.chooseEvent(id)} />
					{:else if s.phase === 'match' && game.lastMatch && !game.matchResolved}
						<MatchCard match={game.lastMatch} onchoice={(id) => game.resolveMatch(id)} />
					{:else if s.phase === 'match' && game.lastMatch && game.matchResolved}
						<MatchResult match={game.lastMatch} oncontinue={() => game.continueFromMatch()} />
					{:else if s.phase === 'recap' && game.lastRecap}
						<section class="scene recap-scene">
							<GazetaSportive
								headline={game.lastRecap.headline}
								season={s.player.season - 1}
								age={s.player.age - 1}
								clubName={club.name}
								recap={game.lastRecap}
							/>
							<CausePanel causes={game.lastRecap.causes} minutesPct={game.lastRecap.minutesPct} />
							<GameButton variant="gold" size="lg" full onclick={() => game.advanceFromRecap()}>
								{sq.nextSeason}
							</GameButton>
						</section>
					{:else if s.phase === 'market'}
						<section class="scene market-scene">
							<p class="kicker">{sq.marketTitle}</p>
							<h2 class="display-xl">{sq.hubMarket}</h2>
							{#each game.offers as offer (offer.id)}
								<TransferOfferCard
									{offer}
									offerClub={clubById[offer.clubId]}
									fromName={club.name}
									onsign={() => game.signOffer(offer.id)}
								/>
							{/each}
							{#if game.offers.length === 0}
								<p class="body-story">{sq.noOffers}</p>
							{/if}
							<div class="choice-stack">
								<GameButton variant="ghost" full onclick={() => game.stayAtClub()}>{sq.stay}</GameButton>
								{#if s.player.age >= 16}
									<GameButton variant="danger" full onclick={() => game.retireEarly()}>{sq.earlyRetire}</GameButton>
								{/if}
							</div>
						</section>
					{/if}
				</div>

				<div class="career-dock">
					<button type="button" class="dock-btn" onclick={() => exportSave(JSON.stringify(s))}>{sq.exportSave}</button>
					<button type="button" class="dock-btn" onclick={() => game.reset()}>{sq.newCareer}</button>
				</div>

				{#if game.pendingMilestone}
					<MilestoneModal milestone={game.pendingMilestone} ondismiss={() => game.dismissMilestone()} />
				{/if}
				{#if game.pendingNationalCall && s.nationalLevel !== 'none'}
					<NationalTeamCall level={s.nationalLevel} oncontinue={() => game.acceptNationalCall()} />
				{/if}
			{/if}
		{/if}
	</GameShell>
{/if}

<style>
	.details-layer {
		padding: var(--space-4) 0;
		border-top: 1px solid var(--line);
		margin-bottom: var(--space-4);
		animation: sceneIn var(--duration-normal) var(--ease-out);
	}

	.moment-layer {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.recap-scene,
	.market-scene {
		min-height: min(70dvh, 640px);
		justify-content: flex-end;
		gap: var(--space-4);
	}

</style>
