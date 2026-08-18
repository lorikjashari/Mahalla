export type Gender = 'male' | 'female';
export type Position = 'GK' | 'DF' | 'MF' | 'FW';
export type LrfId = 'prishtine' | 'ferizaj' | 'gjilan' | 'mitrovice' | 'peje' | 'gjakove' | 'prizren';

export type GamePhase =
	| 'home'
	| 'city'
	| 'gender'
	| 'position'
	| 'name'
	| 'interview'
	| 'academy'
	| 'event'
	| 'recap'
	| 'market'
	| 'retire'
	| 'end';

export type CreationStep = 'home' | 'city' | 'gender' | 'position' | 'name' | 'interview' | 'academy';

export type CareerStage = 'youth' | 'senior';

export interface Municipality {
	id: string;
	name: string;
	lat: number;
	lng: number;
	lrf: LrfId;
	population?: number;
}

export interface ShfAcademy {
	id: string;
	name: string;
	municipalityId: string;
	lat: number;
	lng: number;
	lrf: LrfId;
	colors: [string, string];
	initials: string;
	logoUrl?: string;
	supportsGirls?: boolean;
}

export interface AcademyAssignment {
	type: 'local' | 'nearest';
	academy: ShfAcademy;
	distanceKm: number;
	homeMunicipality: Municipality;
}

export interface PlayerState {
	name: string;
	gender: Gender;
	position: Position;
	age: number;
	season: number;
	ovr: number;
	form: number;
	reputation: number;
	morale: number;
	goals: number;
	assists: number;
	minutes: number;
	matches: number;
	injured: boolean;
}

export interface ClubHistoryEntry {
	clubId: string;
	clubName: string;
	season: number;
	age: number;
	lat: number;
	lng: number;
	leagueTier: number;
}

export interface TransferOffer {
	id: string;
	clubId: string;
	clubName: string;
	leagueName: string;
	tier: number;
	role: string;
	minutesEstimate: number;
	ambition: string;
	lat: number;
	lng: number;
	distanceKm: number;
}

export interface SeasonRecap {
	headline: string;
	ovrDelta: number;
	minutesPct: number;
	causes: CauseEntry[];
	goals: number;
	assists: number;
}

export interface CauseEntry {
	label: string;
	value: number;
	positive: boolean;
}

export interface SeasonHistoryEntry {
	season: number;
	age: number;
	ovr: number;
	minutesPct: number;
	goals: number;
	assists: number;
	clubName: string;
	tier: number;
}

export interface MahallaSave {
	version: 2;
	seed: string;
	phase: GamePhase;
	careerStage: CareerStage;
	municipalityId: string;
	player: PlayerState;
	currentClub: ShfAcademy;
	currentTier: number;
	careerHistory: ClubHistoryEntry[];
	seasonHistory: SeasonHistoryEntry[];
	flags: string[];
	rivalName: string;
	rivalOvr: number;
	shfFriendName: string;
	friendOvr: number;
	nationalCaps: number;
	nationalLevel: 'none' | 'U15' | 'U17' | 'U21' | 'Dardanët';
	interviewProfile: string[];
	lastRecap?: SeasonRecap;
	offers: TransferOffer[];
	duelMode?: boolean;
	equippedLegacies?: string[];
}
