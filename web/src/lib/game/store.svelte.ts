import type {
	AcademyAssignment,
	GamePhase,
	Gender,
	MahallaSave,
	Position,
	SeasonRecap,
	TransferOffer
} from '$lib/game/types';
import { assignAcademy } from '$lib/game/academy';
import { clubDefinitionToCurrentClub, generateOffers } from '$lib/game/mercato';
import { clubById } from '$lib/data/clubs';
import {
	applyChoice,
	createPlayer,
	getSeasonEvent,
	RETIRE_AGE,
	simulateSeason,
	type GameEvent
} from '$lib/game/engine';
import { applyInterviewProfile } from '$lib/game/interview';
import { computeLegendScore, getLegendBadge } from '$lib/game/legend';
import { applyMatchChoice, generateMatchMoment, type MatchMoment } from '$lib/game/match';
import { detectNewMilestones, type MilestoneDef } from '$lib/game/milestones';
import type { TransferAnim } from '$lib/game/transfer';
import { emitFeedback } from '$lib/game/feedback';
import {
	applyLegaciesToPlayer,
	emptyMeta,
	getDailySeedValue,
	getDuelConfig,
	getEquippedLegacyFlags,
	getUrlParams,
	type DuelConfig,
	type MahallaMeta,
	unlockLegaciesFromScore
} from '$lib/game/meta';
import { randomName } from '$lib/game/names';
import { createSeed, SeededRng } from '$lib/game/rng';
import {
	clearSave,
	importSaveFromFile,
	loadMeta,
	loadSave,
	persistMeta,
	persistSave
} from '$lib/game/storage';

export type CreationStep = 'home' | 'city' | 'gender' | 'position' | 'name' | 'interview' | 'academy';

function emptyCreation() {
	return {
		step: 'home' as CreationStep,
		municipalityId: '',
		gender: null as Gender | null,
		position: null as Position | null,
		name: '',
		assignment: null as AcademyAssignment | null,
		interviewStep: 0,
		interviewChoices: [] as string[]
	};
}

function patchSaveV2(raw: MahallaSave): MahallaSave {
	return {
		...raw,
		shfFriendName: raw.shfFriendName ?? 'Shoku',
		friendOvr: raw.friendOvr ?? raw.rivalOvr ?? 50,
		nationalLevel: raw.nationalLevel ?? 'none',
		interviewProfile: raw.interviewProfile ?? []
	};
}

function migrateSave(raw: unknown): MahallaSave | null {
	if (!raw || typeof raw !== 'object') return null;
	const data = raw as Record<string, unknown>;
	if (data.version === 2) return patchSaveV2(data as unknown as MahallaSave);
	if (data.version === 1) {
		const v1 = data as unknown as MahallaSave;
		return patchSaveV2({
			...v1,
			version: 2,
			currentTier: 0,
			seasonHistory: [],
			rivalName: 'Rivali',
			nationalCaps: 0,
			shfFriendName: 'Shoku',
			friendOvr: 50,
			nationalLevel: 'none',
			interviewProfile: []
		});
	}
	return null;
}

function loadMetaState(raw: string | null): MahallaMeta {
	if (!raw) return emptyMeta();
	try {
		const parsed = JSON.parse(raw) as MahallaMeta;
		if (parsed.version === 1) return parsed;
	} catch {
		/* ignore */
	}
	return emptyMeta();
}

class GameStore {
	save = $state<MahallaSave | null>(null);
	meta = $state<MahallaMeta>(emptyMeta());
	creation = $state(emptyCreation());
	currentEvent = $state<GameEvent | null>(null);
	lastRecap = $state<SeasonRecap | null>(null);
	offers = $state<TransferOffer[]>([]);
	rng = $state<SeededRng | null>(null);
	showCareerPanel = $state(false);
	lastTransferAnim = $state<TransferAnim | null>(null);
	selectedLegacies = $state<string[]>([]);
	duelConfig = $state<DuelConfig | null>(null);
	newlyUnlockedLegacies = $state<string[]>([]);
	careerFinished = $state(false);
	ready = $state(false);
	savedAt = $state(Date.now());
	lastMatch = $state<MatchMoment | null>(null);
	matchResolved = $state(false);
	shownMilestones = $state<string[]>([]);
	pendingMilestone = $state<MilestoneDef | null>(null);
	pendingNationalCall = $state(false);

	async init() {
		if (this.ready || typeof window === 'undefined') return;
		const metaRaw = await loadMeta();
		this.meta = loadMetaState(metaRaw);
		this.selectedLegacies = [...this.meta.equippedLegacies];
		this.duelConfig = this.resolveDuelConfig();
		await this.tryLoad();
		this.ready = true;
	}

	constructor() {
		if (typeof window !== 'undefined') {
			void this.init();
		}
	}

	resolveDuelConfig(): DuelConfig | null {
		const { duel } = getUrlParams();
		if (!duel) return null;
		return getDuelConfig(duel);
	}

	async tryLoad() {
		const raw = await loadSave();
		if (!raw) return;
		try {
			const parsed = migrateSave(JSON.parse(raw));
			if (parsed) {
				this.save = parsed;
				this.rng = new SeededRng(parsed.seed);
				this.offers = parsed.offers ?? [];
				this.lastRecap = parsed.lastRecap ?? null;
				this.creation.step = 'home';
				if (parsed.phase === 'end') this.finishCareer(false);
			}
		} catch {
			await clearSave();
		}
	}

	persist() {
		if (!this.save) return;
		void persistSave(JSON.stringify(this.save)).then(() => {
			this.savedAt = Date.now();
		});
	}

	persistMetaState() {
		this.meta.equippedLegacies = [...this.selectedLegacies];
		void persistMeta(JSON.stringify(this.meta));
	}

	reset() {
		this.save = null;
		this.creation = emptyCreation();
		this.currentEvent = null;
		this.lastRecap = null;
		this.offers = [];
		this.rng = null;
		this.showCareerPanel = false;
		this.lastTransferAnim = null;
		this.careerFinished = false;
		this.newlyUnlockedLegacies = [];
		this.lastMatch = null;
		this.matchResolved = false;
		this.shownMilestones = [];
		this.pendingMilestone = null;
		this.pendingNationalCall = false;
		void clearSave();
	}

	startNew() {
		this.reset();
		if (this.duelConfig) {
			this.creation.municipalityId = this.duelConfig.municipalityId;
			this.creation.gender = this.duelConfig.gender;
			this.creation.position = this.duelConfig.position;
			this.creation.step = 'name';
			return;
		}
		this.creation.step = 'city';
	}

	startDaily() {
		this.reset();
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('daily', getDailySeedValue().replace('daily-', ''));
			url.searchParams.delete('duel');
			url.searchParams.delete('d');
			window.history.replaceState({}, '', url);
		}
		this.creation.step = 'city';
	}

	setLegacies(ids: string[]) {
		this.selectedLegacies = ids.slice(0, 2);
		this.persistMetaState();
	}

	selectCity(id: string) {
		this.creation.municipalityId = id;
	}

	selectGender(gender: Gender) {
		this.creation.gender = gender;
		this.creation.step = 'position';
	}

	selectPosition(position: Position) {
		this.creation.position = position;
		this.creation.step = 'name';
	}

	setName(name: string) {
		this.creation.name = name.trim();
	}

	confirmName() {
		if (!this.creation.name || !this.creation.gender || !this.creation.position) return;
		this.creation.assignment = assignAcademy(this.creation.municipalityId, this.creation.gender);
		this.creation.interviewStep = 0;
		this.creation.interviewChoices = [];
		this.creation.step = 'interview';
	}

	answerInterview(choiceId: string) {
		this.creation.interviewChoices.push(choiceId);
		if (this.creation.interviewStep < 2) {
			this.creation.interviewStep += 1;
		} else {
			this.creation.step = 'academy';
		}
	}

	beginCareer() {
		const { assignment, gender, position, name, municipalityId } = this.creation;
		if (!assignment || !gender || !position || !name) return;

		const { daily } = getUrlParams();
		let seed: string;
		if (this.duelConfig) seed = this.duelConfig.seed;
		else if (daily) seed = `daily-${daily}`;
		else seed = createSeed();
		const academy = assignment.academy;
		const player = createPlayer(name, gender, position, academy);
		applyLegaciesToPlayer(player, this.selectedLegacies);
		applyInterviewProfile(player, this.creation.interviewChoices);
		const legacyFlags = getEquippedLegacyFlags(this.selectedLegacies);
		const rivalName = this.duelConfig?.rivalName ?? randomName(gender);
		const friendName = randomName(gender);

		this.save = {
			version: 2,
			seed,
			phase: 'event',
			careerStage: 'youth',
			municipalityId,
			player,
			currentClub: academy,
			currentTier: 0,
			careerHistory: [
				{
					clubId: academy.id,
					clubName: academy.name,
					season: 1,
					age: 10,
					lat: academy.lat,
					lng: academy.lng,
					leagueTier: 0
				}
			],
			seasonHistory: [],
			flags: [...legacyFlags],
			rivalOvr: player.ovr + 2,
			rivalName,
			shfFriendName: friendName,
			friendOvr: player.ovr - 1,
			nationalCaps: 0,
			nationalLevel: 'none',
			interviewProfile: [...this.creation.interviewChoices],
			offers: [],
			duelMode: !!this.duelConfig,
			equippedLegacies: [...this.selectedLegacies]
		};
		this.rng = new SeededRng(seed);
		this.creation.step = 'home';
		this.careerFinished = false;
		this.startEvent();
		this.persist();
	}

	finishCareer(persistEnd = true) {
		if (!this.save || this.careerFinished) return;
		const score = computeLegendScore(this.save);
		const badge = getLegendBadge(this.save);
		this.meta.pantheon.unshift({
			id: `${this.save.seed}-${Date.now()}`,
			playerName: this.save.player.name,
			score,
			badge,
			seed: this.save.seed,
			municipalityId: this.save.municipalityId,
			completedAt: Date.now(),
			duelMode: this.save.duelMode
		});
		this.meta.pantheon = this.meta.pantheon.slice(0, 20);
		this.newlyUnlockedLegacies = unlockLegaciesFromScore(this.meta, score);
		this.careerFinished = true;
		this.persistMetaState();
		if (persistEnd && this.save) {
			this.save.phase = 'end';
			this.persist();
		}
	}

	async importCareer(file: File) {
		const json = await importSaveFromFile(file);
		const parsed = migrateSave(JSON.parse(json));
		if (!parsed) throw new Error('Skedar i pavlefshëm');
		this.save = parsed;
		this.rng = new SeededRng(parsed.seed);
		this.offers = parsed.offers ?? [];
		this.lastRecap = parsed.lastRecap ?? null;
		this.creation.step = 'home';
		if (parsed.phase === 'end') this.finishCareer(false);
		else this.persist();
	}

	dismissTransferAnim() {
		this.lastTransferAnim = null;
	}

	startEvent() {
		if (!this.save || !this.rng) return;
		if (this.save.player.age >= RETIRE_AGE) {
			this.finishCareer();
			return;
		}
		this.currentEvent = getSeasonEvent(this.save, this.rng);
		this.save.phase = 'event';
		this.persist();
	}

	private queueMilestones() {
		if (!this.save) return;
		const next = detectNewMilestones(this.save, this.shownMilestones);
		if (next.length > 0 && !this.pendingMilestone) {
			this.pendingMilestone = next[0];
		}
	}

	dismissMilestone() {
		if (!this.pendingMilestone) return;
		this.shownMilestones = [...this.shownMilestones, this.pendingMilestone.id];
		this.pendingMilestone = null;
		this.queueMilestones();
	}

	acceptNationalCall() {
		this.pendingNationalCall = false;
	}

	chooseEvent(choiceId: string) {
		if (!this.save || !this.currentEvent || !this.rng) return;
		const choice = this.currentEvent.choices.find((c) => c.id === choiceId);
		if (!choice) return;

		const capsBefore = this.save.nationalCaps;
		const flags = [...this.save.flags];
		Object.assign(
			this.save.player,
			applyChoice(this.save.player, choice.effects, flags, this.save)
		);
		this.save.flags = flags;

		this.lastRecap = simulateSeason(this.save, this.rng, choice.effects);
		this.save.lastRecap = this.lastRecap;
		this.currentEvent = null;
		this.matchResolved = false;
		this.lastMatch = generateMatchMoment(this.save, this.lastRecap, this.rng);
		this.save.phase = 'match';

		if (this.save.nationalCaps > capsBefore) {
			this.pendingNationalCall = true;
		}

		this.persist();
	}

	resolveMatch(choiceId: string) {
		if (!this.save || !this.lastMatch) return;
		applyMatchChoice(this.save.player, choiceId);
		this.matchResolved = true;
		emitFeedback('match');
		this.persist();
	}

	continueFromMatch() {
		if (!this.save) return;
		this.matchResolved = false;
		this.lastMatch = null;
		this.save.phase = 'recap';
		this.queueMilestones();
		this.persist();
	}

	advanceFromRecap() {
		if (!this.save || !this.rng) return;

		if (this.save.player.age >= RETIRE_AGE) {
			this.finishCareer();
			return;
		}

		if (this.save.player.age >= 16) {
			this.offers = generateOffers(this.save, this.rng);
			if (this.offers.length > 0) {
				this.save.offers = this.offers;
				this.save.phase = 'market';
				this.persist();
				return;
			}
		}

		this.nextSeason();
	}

	signOffer(offerId: string) {
		if (!this.save) return;
		const offer = this.offers.find((o) => o.id === offerId);
		if (!offer) return;

		const fromName = this.save.currentClub.name;
		const fromLat = this.save.currentClub.lat;
		const fromLng = this.save.currentClub.lng;
		const fromTier = this.save.currentTier;
		const clubDef = clubById[offer.clubId];

		this.save.careerHistory.push({
			clubId: offer.clubId,
			clubName: offer.clubName,
			season: this.save.player.season,
			age: this.save.player.age,
			lat: offer.lat,
			lng: offer.lng,
			leagueTier: offer.tier
		});

		this.save.currentTier = offer.tier;

		if (offer.tier >= 10 && !this.save.flags.includes('abroad-first')) {
			this.save.flags.push('abroad-first');
		}
		if (this.save.careerStage === 'youth' && !this.save.flags.includes('first-pro')) {
			this.save.flags.push('first-pro');
		}

		this.save.currentClub = clubDef
			? clubDefinitionToCurrentClub(clubDef)
			: {
					...this.save.currentClub,
					id: offer.clubId,
					name: offer.clubName,
					lat: offer.lat,
					lng: offer.lng,
					initials: '?'
				};

		if (this.selectedLegacies.includes('lagje') && offer.tier >= 10) {
			this.save.player.morale = Math.max(10, this.save.player.morale - 3);
		}

		const goingAbroad = offer.tier >= 10 && fromTier < 10;
		if (goingAbroad && !this.save.flags.includes('adaptim-active')) {
			this.save.flags.push('adaptim-active');
		}

		this.lastTransferAnim = {
			from: fromName,
			to: offer.clubName,
			km: offer.distanceKm,
			fromLat,
			fromLng,
			toLat: offer.lat,
			toLng: offer.lng,
			tier: offer.tier,
			abroad: goingAbroad
		};
		this.save.careerStage = 'senior';
		this.offers = [];
		this.save.offers = [];
		this.queueMilestones();
		this.nextSeason();
	}

	stayAtClub() {
		this.offers = [];
		if (this.save) this.save.offers = [];
		this.nextSeason();
	}

	retireEarly() {
		if (!this.save || this.save.player.age < 16) return;
		this.offers = [];
		this.save.offers = [];
		this.finishCareer();
	}

	nextSeason() {
		if (!this.save || !this.rng) return;
		this.startEvent();
	}

	get phase(): GamePhase {
		return this.save?.phase ?? 'home';
	}
}

export const game = new GameStore();
