<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { game } from '$lib/game/store.svelte';
	import { assignAcademy, getLrfLabel } from '$lib/game/academy';
	import { getAgeGroup } from '$lib/game/engine';
	import { randomName } from '$lib/game/names';
	import { clubById } from '$lib/data/clubs';
	import CareerMap from '$lib/components/CareerMap.svelte';
	import CareerCharts from '$lib/components/CareerCharts.svelte';
	import LegendCard from '$lib/components/LegendCard.svelte';
	import ShareDuel from '$lib/components/ShareDuel.svelte';
	import ShareLegend from '$lib/components/ShareLegend.svelte';
	import GazetaSportive from '$lib/components/GazetaSportive.svelte';
	import LegacyPicker from '$lib/components/LegacyPicker.svelte';
	import PantheonPanel from '$lib/components/PantheonPanel.svelte';
	import { exportSave } from '$lib/game/storage';
	import { getUrlParams } from '$lib/game/meta';
	import { municipalityById } from '$lib/data/municipalities';
	import KosovoMap from '$lib/components/KosovoMap.svelte';
	import ClubLogo from '$lib/components/ClubLogo.svelte';
	import CausePanel from '$lib/components/CausePanel.svelte';
	import TravelMap from '$lib/components/TravelMap.svelte';
	import InterviewPanel from '$lib/components/InterviewPanel.svelte';
	import MemoryLog from '$lib/components/MemoryLog.svelte';
	import NationalBadge from '$lib/components/NationalBadge.svelte';
	import { getTierLabel } from '$lib/data/clubs';
	import { sq } from '$lib/i18n/sq';
	import type { Gender, Position } from '$lib/game/types';

	let { children } = $props();
	let importInput: HTMLInputElement | undefined = $state();
	let importError = $state('');

	const urlParams = $derived(getUrlParams());

	const positions: { id: Position; label: string }[] = [
		{ id: 'GK', label: sq.positionGK },
		{ id: 'DF', label: sq.positionDF },
		{ id: 'MF', label: sq.positionMF },
		{ id: 'FW', label: sq.positionFW }
	];

	const selectedMunicipality = $derived(
		game.creation.municipalityId ? municipalityById[game.creation.municipalityId] : null
	);

	const previewAssignment = $derived(
		game.creation.municipalityId && game.creation.gender
			? assignAcademy(game.creation.municipalityId, game.creation.gender)
			: game.creation.municipalityId
				? assignAcademy(game.creation.municipalityId, 'male')
				: null
	);
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
	<meta name="twitter:card" content="summary" />
</svelte:head>

{@render children()}

{#if !game.ready}
	<div class="app-shell loading-screen">
		<p class="loading-text">{sq.loading}</p>
	</div>
{:else}
<div class="app-shell">
	<header class="top-bar">
		<div>
			<h1 class="logo-mark">{sq.appName}</h1>
			<p class="tagline">{sq.tagline}</p>
		</div>
		<a class="live-badge" href="https://mahalla.pages.dev" target="_blank" rel="noopener">
			{sq.live}
		</a>
	</header>

	{#if !game.save && game.creation.step === 'home'}
		{#if game.duelConfig}
			<div class="mode-banner duel">
				<strong>{sq.duelMode}</strong>
				<p>{sq.duelHint}</p>
			</div>
		{/if}
		{#if urlParams.daily}
			<div class="mode-banner daily">
				<strong>{sq.dailyChallenge}</strong>
				<p>{sq.dailyHint}</p>
			</div>
		{/if}

		<PantheonPanel entries={game.meta.pantheon} />
		<LegacyPicker
			meta={game.meta}
			selected={game.selectedLegacies}
			onchange={(ids) => game.setLegacies(ids)}
		/>

		<div class="actions">
			<button class="gold" onclick={() => game.startNew()}>{sq.play}</button>
			<button class="secondary" onclick={() => game.startDaily()}>{sq.dailyChallenge}</button>
		</div>

		<div class="actions">
			<button
				class="secondary"
				onclick={() => importInput?.click()}
			>
				{sq.importSave}
			</button>
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
						importError = 'Skedari nuk është valid.';
					}
					e.currentTarget.value = '';
				}}
			/>
		</div>
		{#if importError}
			<p class="screen-hint" style="color:var(--danger)">{importError}</p>
		{/if}
	{:else if !game.save && game.creation.step === 'city'}
		<h2 class="screen-title">{sq.chooseCity}</h2>
		<KosovoMap
			selectedId={game.creation.municipalityId}
			onselect={(id) => game.selectCity(id)}
		/>
		{#if selectedMunicipality}
			<div class="card" style="margin-top:1rem">
				<strong>{selectedMunicipality.name}</strong>
				<p class="screen-hint" style="margin:0.25rem 0 0">
					{getLrfLabel(selectedMunicipality.lrf)}
				</p>
			</div>
			<div class="actions">
				<button
					disabled={!game.creation.municipalityId}
					onclick={() => (game.creation.step = 'gender')}
				>
					Vazhdo →
				</button>
			</div>
		{/if}
	{:else if !game.save && game.creation.step === 'gender'}
		<h2 class="screen-title">{sq.chooseGender}</h2>
		<p class="screen-hint">{sq.genderHint}</p>
		<div class="grid-2">
			<button onclick={() => game.selectGender('male')}>👦 {sq.male}</button>
			<button onclick={() => game.selectGender('female')}>👧 {sq.female}</button>
		</div>
	{:else if !game.save && game.creation.step === 'position'}
		<h2 class="screen-title">{sq.choosePosition}</h2>
		<p class="screen-hint">{sq.positionHint}</p>
		<div class="grid-4">
			{#each positions as p (p.id)}
				<button class="secondary" onclick={() => game.selectPosition(p.id)}>{p.label}</button>
			{/each}
		</div>
	{:else if !game.save && game.creation.step === 'name'}
		{#if game.duelConfig}
			<div class="card" style="margin-bottom:1rem">
				<p class="screen-hint" style="margin:0">
					Duel: {municipalityById[game.duelConfig.municipalityId]?.name} ·
					{game.duelConfig.gender === 'male' ? sq.male : sq.female} ·
					{positions.find((p) => p.id === game.duelConfig?.position)?.label}
				</p>
			</div>
		{/if}
		<h2 class="screen-title">{sq.yourName}</h2>
		<input
			type="text"
			placeholder={sq.namePlaceholder}
			value={game.creation.name}
			oninput={(e) => game.setName(e.currentTarget.value)}
			maxlength="24"
		/>
		<button
			class="secondary"
			onclick={() => {
				if (game.creation.gender) game.setName(randomName(game.creation.gender));
			}}
		>
			{sq.randomName}
		</button>
		<div class="actions">
			<button disabled={!game.creation.name.trim()} onclick={() => game.confirmName()}>
				Vazhdo →
			</button>
		</div>
	{:else if !game.save && game.creation.step === 'interview'}
		<h2 class="screen-title">{sq.interviewTitle}</h2>
		<p class="screen-hint">{sq.interviewHint}</p>
		<InterviewPanel
			step={game.creation.interviewStep}
			choices={game.creation.interviewChoices}
			onanswer={(id) => game.answerInterview(id)}
		/>
	{:else if !game.save && game.creation.step === 'academy' && game.creation.assignment}
		{@const a = game.creation.assignment}
		<h2 class="screen-title">{sq.academyTitle}</h2>
		<div class="club-header">
			<ClubLogo
				name={a.academy.name}
				initials={a.academy.initials}
				colors={a.academy.colors}
				logoUrl={a.academy.logoUrl}
				size="lg"
			/>
			<div>
				<h2>{a.academy.name}</h2>
				<p class="screen-hint" style="margin:0">
					{a.type === 'local' ? sq.academyLocal : sq.academyNearest}
					· {a.distanceKm} {sq.km}
				</p>
			</div>
		</div>

		{#if a.type === 'nearest'}
			<TravelMap
				fromLat={a.homeMunicipality.lat}
				fromLng={a.homeMunicipality.lng}
				toLat={a.academy.lat}
				toLng={a.academy.lng}
				fromName={a.homeMunicipality.name}
				toName={a.academy.name}
				distanceKm={a.distanceKm}
			/>
		{/if}

		<div class="card">
			<p>
				<strong>{game.creation.name}</strong> ·
				{game.creation.gender === 'male' ? sq.male : sq.female} ·
				{positions.find((p) => p.id === game.creation.position)?.label}
			</p>
			<p class="screen-hint">
				Fillon në moshën <strong>10 vjeç</strong> · U11 · {a.homeMunicipality.name}
			</p>
		</div>

		<div class="actions">
			<button class="gold" onclick={() => game.beginCareer()}>{sq.startCareer}</button>
		</div>
	{:else if game.save}
		{@const s = game.save}
		{@const club = s.currentClub}

		{#if game.lastTransferAnim}
			<div class="transfer-toast">
				{sq.travel}: {game.lastTransferAnim.from} → {game.lastTransferAnim.to} ·
				{game.lastTransferAnim.km} {sq.km}
			</div>
		{/if}

		{#if s.phase === 'end'}
			<LegendCard save={s} />
			{#if game.newlyUnlockedLegacies.length > 0}
				<div class="mode-banner daily">
					<strong>{sq.newLegacies}</strong>
					<p>{game.newlyUnlockedLegacies.join(', ')}</p>
				</div>
			{/if}
			<ShareDuel seed={s.seed} />
			<ShareLegend />
			<div class="actions">
				<button class="gold" onclick={() => game.reset()}>{sq.newCareer}</button>
				<button class="secondary" onclick={() => exportSave(JSON.stringify(s))}>
					{sq.exportSave}
				</button>
			</div>
		{:else}
			<div class="club-header">
				<ClubLogo
					name={club.name}
					initials={club.initials}
					colors={club.colors}
					logoUrl={club.logoUrl}
				/>
				<div>
					<strong>{s.player.name}</strong>
					<p class="screen-hint" style="margin:0">
						{club.name} · {getAgeGroup(s.player.age)} · {getTierLabel(s.currentTier)}
					</p>
				</div>
			</div>

			<div class="stat-grid">
				<div class="stat"><span class="stat-label">{sq.age}</span><span>{s.player.age} {sq.yearsOld}</span></div>
				<div class="stat"><span class="stat-label">{sq.season}</span><span>{s.player.season}</span></div>
				<div class="stat"><span class="stat-label">{sq.ovr}</span><span>{s.player.ovr}</span></div>
				<div class="stat"><span class="stat-label">{sq.reputation}</span><span>{s.player.reputation}</span></div>
				<div class="stat"><span class="stat-label">Gola</span><span>{s.player.goals}</span></div>
				<div class="stat"><span class="stat-label">{s.rivalName}</span><span>OVR {s.rivalOvr}</span></div>
				<div class="stat"><span class="stat-label">{s.shfFriendName}</span><span>OVR {s.friendOvr}</span></div>
			</div>

			<NationalBadge level={s.nationalLevel} caps={s.nationalCaps} />
			<MemoryLog flags={s.flags} />

			<button
				class="secondary tab-btn"
				onclick={() => (game.showCareerPanel = !game.showCareerPanel)}
			>
				{game.showCareerPanel ? 'Fshih karrierën' : 'Shfaq hartën & grafikët'}
			</button>

			{#if game.showCareerPanel}
				<CareerMap history={s.careerHistory} currentId={club.id} />
				{#if s.seasonHistory.length > 0}
					<CareerCharts history={s.seasonHistory} />
				{/if}
			{/if}

			{#if s.phase === 'event' && game.currentEvent}
				<div class="card">
					<h2 class="screen-title">{game.currentEvent.title}</h2>
					<p>{game.currentEvent.body}</p>
					<div class="choice-list">
						{#each game.currentEvent.choices as choice (choice.id)}
							<button onclick={() => game.chooseEvent(choice.id)}>{choice.label}</button>
						{/each}
					</div>
				</div>
			{:else if s.phase === 'recap' && game.lastRecap}
				<GazetaSportive
					headline={game.lastRecap.headline}
					season={s.player.season - 1}
					age={s.player.age - 1}
					clubName={club.name}
					recap={game.lastRecap}
				/>
				<CausePanel causes={game.lastRecap.causes} minutesPct={game.lastRecap.minutesPct} />
				<div class="stat-grid">
					<div class="stat"><span class="stat-label">Gola sezonit</span><span>{game.lastRecap.goals}</span></div>
					<div class="stat">
						<span class="stat-label">Asistime</span><span>{game.lastRecap.assists}</span>
					</div>
				</div>
				<div class="actions">
					<button class="gold" onclick={() => game.advanceFromRecap()}>Vazhdo →</button>
				</div>
			{:else if s.phase === 'market' && game.offers.length > 0}
				<h2 class="screen-title">{sq.marketTitle}</h2>
				<p class="screen-hint">Mosha {s.player.age} — zgjedh rrugën tënde</p>
				{#each game.offers as offer (offer.id)}
					{@const offerClub = clubById[offer.clubId]}
					<div class="card offer-card">
						<div class="club-header" style="margin:0">
							<ClubLogo
								name={offer.clubName}
								initials={offerClub?.initials ?? '?'}
								colors={offerClub?.colors ?? ['#333', '#555']}
								logoUrl={offerClub?.logoUrl}
							/>
							<div>
								<strong>{offer.clubName}</strong>
								<p class="meta">{offer.leagueName} · Nivel {offer.tier}</p>
							</div>
						</div>
						<p class="meta">{sq.role}: {offer.role}</p>
						<p class="meta">{sq.minutes}: ~{offer.minutesEstimate}%</p>
						<p class="meta">{sq.ambition}: {offer.ambition}</p>
						<TravelMap
							fromLat={club.lat}
							fromLng={club.lng}
							toLat={offer.lat}
							toLng={offer.lng}
							fromName={club.name}
							toName={offer.clubName}
							distanceKm={offer.distanceKm}
						/>
						<button onclick={() => game.signOffer(offer.id)}>{sq.sign}</button>
					</div>
				{/each}
				<button class="secondary" onclick={() => game.stayAtClub()}>{sq.stay}</button>
				{#if s.player.age >= 16}
					<button class="secondary danger" onclick={() => game.retireEarly()}>{sq.earlyRetire}</button>
				{/if}
			{/if}

			<div class="actions">
				<button class="secondary" onclick={() => exportSave(JSON.stringify(s))}>
					{sq.exportSave}
				</button>
				<button class="secondary" onclick={() => game.reset()}>{sq.newCareer}</button>
			</div>
		{/if}
	{/if}

	<footer class="site-footer">
		<a href="https://github.com/lorikjashari/Mahalla" target="_blank" rel="noopener">{sq.github}</a>
		<span>·</span>
		<a href="https://mahalla.pages.dev" target="_blank" rel="noopener">mahalla.pages.dev</a>
	</footer>
</div>
{/if}
