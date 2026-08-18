import type {
	CauseEntry,
	Gender,
	MahallaSave,
	PlayerState,
	Position,
	SeasonRecap,
	ShfAcademy
} from '$lib/game/types';
import { getCurrentTier } from '$lib/game/mercato';
import { nationalLevelForAge } from '$lib/game/interview';
import { pickHeadline } from '$lib/game/headlines';
import { SeededRng } from '$lib/game/rng';

const POSITION_OVR: Record<Position, number> = { GK: 48, DF: 47, MF: 49, FW: 50 };

export function createPlayer(
	name: string,
	gender: Gender,
	position: Position,
	_academy: ShfAcademy
): PlayerState {
	return {
		name,
		gender,
		position,
		age: 10,
		season: 1,
		ovr: POSITION_OVR[position],
		form: 70,
		reputation: 5,
		morale: 75,
		goals: 0,
		assists: 0,
		minutes: 0,
		matches: 0,
		injured: false
	};
}

export interface GameEvent {
	id: string;
	title: string;
	body: string;
	choices: { id: string; label: string; effects: string[] }[];
}

const YOUTH_EVENTS: Omit<GameEvent, 'id'>[] = [
	{
		title: 'Stërvitja e parë në lagje',
		body: 'Trajneri thotë se je i shpejtë, por duhet të punosh më shumë me topin.',
		choices: [
			{ id: 'work', label: 'Stërvitje ekstra pas shkollës', effects: ['+form', '+ovr'] },
			{ id: 'fun', label: 'Luaj për kënaqësi me shokët', effects: ['+morale'] },
			{ id: 'skip', label: 'Mungon stërvitjen — je i lodhur', effects: ['-form'] }
		]
	},
	{
		title: 'Derbi i qytetit — LRF',
		body: 'Ndeshje rajonale. Tribuna ka disa scoutë nga klube më të mëdha.',
		choices: [
			{ id: 'hero', label: 'Luaj pa frikë — do të dukesh', effects: ['+reputation', '+minutes'] },
			{ id: 'safe', label: 'Luaj thjesht — mos bëj gabime', effects: ['+form'] },
			{ id: 'nervous', label: 'Nervoz — heq dorë nga topi shpejt', effects: ['-morale'] }
		]
	},
	{
		title: 'Prindi dhe futbolli',
		body: 'Baba thotë: "Nëse do futbollist, duhet edhe notat e mira në shkollë."',
		choices: [
			{ id: 'balance', label: 'Balancë — shkollë dhe fushë', effects: ['+morale', '+ovr'] },
			{ id: 'football', label: 'Vetëm futboll — shkolla prapa', effects: ['+form', '-morale'] },
			{ id: 'school', label: 'Fokus shkollë — pak stërvitje', effects: ['-minutes'] }
		]
	},
	{
		title: 'Agjenti në Instagram',
		body: 'Dikush të shkruan: "Do të të coj te klub i madh — paguaj 200€ provë."',
		choices: [
			{ id: 'scam', label: 'Paguaj — ëndrra është e madhe', effects: ['-morale', 'flag:scammed'] },
			{ id: 'ignore', label: 'Blloko — duket mashtrim', effects: ['+reputation'] },
			{ id: 'tell', label: 'I thuaj trajnerit', effects: ['+morale', '+form'] }
		]
	},
	{
		title: 'Play-Off Nacional — Hajvali',
		body: 'Je thirrur në kamp kombëtar. Konkurrencë e fortë nga të gjitha LRF-të.',
		choices: [
			{ id: 'shine', label: 'Jep maksimumin — dëshiro scoutë', effects: ['+ovr', '+reputation', '+minutes'] },
			{ id: 'team', label: 'Luaj për ekipin', effects: ['+form', '+morale'] },
			{ id: 'injury', label: 'Forcon shumë — rrezik lëndimi', effects: ['+ovr', 'injury'] }
		]
	},
	{
		title: 'Shoku i SHF-së',
		body: 'Shoku yt nga stërvitja firmos te klub më i madh. A je xheloz?',
		choices: [
			{ id: 'motivated', label: 'Motivohem — edhe unë do arrij', effects: ['+morale', '+form'] },
			{ id: 'bitter', label: 'I bllokon në Instagram', effects: ['-morale', 'flag:bitter'] },
			{ id: 'support', label: 'I uron fat — mbetemi shokë', effects: ['+reputation', '+morale'] }
		]
	},
	{
		title: 'Stadiumi i qytetit',
		body: 'Fusha e re sintetike në qytet. Lagjja mblidhet — ndjen presionin.',
		choices: [
			{ id: 'love', label: 'E dashuron — këtu je në shtëpi', effects: ['+morale', '+form'] },
			{ id: 'pressure', label: 'Tremb — të gjithë të shikojnë', effects: ['-form', '-morale'] },
			{ id: 'focus', label: 'Vetëm futboll — asgjë tjetër', effects: ['+ovr'] }
		]
	},
	{
		title: 'Derbi LRFGJ — Presingu vs Kosova-Viti',
		body: 'Tribuna plot. Lagjja jote kundër lagjes fqinje — kush del më i madh?',
		choices: [
			{ id: 'derby', label: 'Gol në derbi — hero i lagjes', effects: ['+reputation', '+morale', 'flag:derby-hero'] },
			{ id: 'assist', label: 'Asistim — ekipi fiton', effects: ['+form', '+minutes'] },
			{ id: 'red', label: 'Kartoni i kuq — skandal', effects: ['-reputation', '-minutes'] }
		]
	},
	{
		title: 'Pushimi i dimrit',
		body: 'Pa stërvitje zyrtare. Shokët thërrasin në fushë me borë.',
		choices: [
			{ id: 'train', label: 'Stërvitje private — je përpara', effects: ['+form', '+ovr'] },
			{ id: 'rest', label: 'Pushim — rikuperim', effects: ['+morale'] },
			{ id: 'party', label: 'Natë e gjatë — humb formën', effects: ['-form', '+morale'] }
		]
	},
	{
		title: 'Trajneri i ri',
		body: 'Trajneri i vjetër shkoi. I riu thotë: "Duhet të fitosh vendin."',
		choices: [
			{ id: 'impress', label: 'Impresion — stërvitje ekstra', effects: ['+form', '+minutes'] },
			{ id: 'wait', label: 'Prit — mos u ekspozo', effects: ['-minutes'] },
			{ id: 'clash', label: 'Konflikt publik', effects: ['-morale', '-reputation'] }
		]
	},
	{
		title: 'TikTok viral',
		body: 'Video e stërvitjes shkon viral. Scoutë të shkruajnë në DM.',
		choices: [
			{ id: 'focus', label: 'Injoro famën — fokus fushë', effects: ['+form', '+ovr'] },
			{ id: 'fame', label: 'E shfrytëzon — sponsorë lokalë', effects: ['+reputation', '-form'] },
			{ id: 'agent', label: 'Merr agjent — menaxhim', effects: ['+reputation'] }
		]
	}
];

const SENIOR_EVENTS: Omit<GameEvent, 'id'>[] = [
	{
		title: 'Kontrata e parë',
		body: 'Klubi të ofron kontratë profesionale. Pag e ulët, por fillim i ëndrrës.',
		choices: [
			{ id: 'sign', label: 'Firmos — filloj rrugën', effects: ['+reputation', '+morale'] },
			{ id: 'agent', label: 'Kërkoj agjent para se të firmos', effects: ['+reputation'] },
			{ id: 'wait', label: 'Pres ofertë më të mirë', effects: ['-morale'] }
		]
	},
	{
		title: 'Derbi i Superligës',
		body: 'Stadiumi plot. Media kosovare. Momenti yt.',
		choices: [
			{ id: 'star', label: 'Shkëlqes — titulli i gazetës', effects: ['+reputation', '+ovr', '+minutes'] },
			{ id: 'solid', label: 'Luaj mirë pa u ekspozuar', effects: ['+form'] },
			{ id: 'choke', label: 'Gabim i madh — presion', effects: ['-morale', '-form'] }
		]
	},
	{
		title: 'Thirrje te Dardanët',
		body: 'FFK thërret në kombëtar. U21 ose senior.',
		choices: [
			{ id: 'accept', label: 'Pranoj me krenari', effects: ['+national', '+reputation', '+morale'] },
			{ id: 'injured', label: 'Refuzoj — jam i lënduar', effects: ['-reputation'] },
			{ id: 'focus', label: 'Fokus klub — jo tani', effects: ['+form'] }
		]
	},
	{
		title: 'Jashtë vendit — adaptimi',
		body: 'Klub i ri, gjuhë e re, qytet i ri. Homesick?',
		choices: [
			{ id: 'adapt', label: 'Përshtatem — stërvitje ekstra', effects: ['+form', '+ovr'] },
			{ id: 'homesick', label: 'Mendoj për shtëpinë', effects: ['-morale', '-form'] },
			{ id: 'diaspora', label: 'Gjej kosovarë atje', effects: ['+morale'] }
		]
	},
	{
		title: 'Merkato verore',
		body: 'Agjenti thotë ka interes nga jashtë. Klubi yt refuzon lehtë.',
		choices: [
			{ id: 'push', label: 'Pres transfer — kam merituar', effects: ['+reputation'] },
			{ id: 'loyal', label: 'Qëndro — klubi më besoi', effects: ['+morale'] },
			{ id: 'force', label: 'Krijoj konflikt me drejtuesit', effects: ['+reputation', '-morale'] }
		]
	},
	{
		title: 'Tifozët e klubit',
		body: 'Ultrasit të bëjnë kor — ose të sfidojnë pas një humbje.',
		choices: [
			{ id: 'embrace', label: 'I afër tifozëve — lidhje e fortë', effects: ['+morale', '+reputation'] },
			{ id: 'ignore', label: 'Fokus vetëm te loja', effects: ['+form'] },
			{ id: 'clash', label: 'Përplasje me tifozë — media', effects: ['-reputation', '-morale'] }
		]
	},
	{
		title: 'Telefonata nga shtëpia',
		body: 'Nëna thotë: "Kthehu — na mungon." Jashtë vendit je vetëm.',
		choices: [
			{ id: 'strong', label: 'Jam këtu për ëndrrën', effects: ['+morale', '+form'] },
			{ id: 'visit', label: 'Vizitë e shkurtër — humb stërvitje', effects: ['+morale', '-form'] },
			{ id: 'quit', label: 'Mendon të kthehesh…', effects: ['-morale', '-reputation'] }
		]
	},
	{
		title: 'Finale kundër rivalit',
		body: '{rival} luajt mirë gjithë sezonin. Tani ballë për ballë.',
		choices: [
			{ id: 'win', label: 'E mposht — je më i mirë', effects: ['+ovr', '+reputation', '+morale'] },
			{ id: 'draw', label: 'Barazim — mjafton', effects: ['+form'] },
			{ id: 'lose', label: 'Humb — rivalit i kalon', effects: ['-morale', '-reputation'] }
		]
	},
	{
		title: 'UECL — nata evropiane',
		body: 'Klubi yt luan në Evropë. Stadiumi plot — Kosova të shikon.',
		choices: [
			{ id: 'hero', label: 'Gol në Evropë — legjendë lokale', effects: ['+reputation', '+ovr', '+national'] },
			{ id: 'solid', label: 'Luaj mirë — ekipi kualifikohet', effects: ['+form', '+morale'] },
			{ id: 'miss', label: 'Humb penalltinë — kritikë', effects: ['-morale', '-reputation'] }
		]
	},
	{
		title: 'Agjent i vërtetë',
		body: 'Agjent i licencuar ofron kontratë. Klubi yt refuzon negociatat.',
		choices: [
			{ id: 'trust', label: 'Beso agjentin — pres transfer', effects: ['+reputation'] },
			{ id: 'club', label: 'Beso klubin — mos prish marrëdhënien', effects: ['+morale'] },
			{ id: 'leak', label: 'Lejon leak në media', effects: ['+reputation', '-morale'] }
		]
	},
	{
		title: 'Lëndim i rëndë',
		body: 'Kërcim i keq — mjekët thonë 3 muaj jashtë.',
		choices: [
			{ id: 'rehab', label: 'Rehabilitim serioz', effects: ['+form'] },
			{ id: 'rush', label: 'Kthehesh shpejt — rrezik', effects: ['injury', '-form'] },
			{ id: 'mental', label: 'Punë mentale — mbet i fortë', effects: ['+morale'] }
		]
	},
	{
		title: 'Partneri dhe presioni',
		body: 'Partneri thotë: "Ose më shumë kohë, ose…" Jashtë vendit je i vetmuar.',
		choices: [
			{ id: 'balance', label: 'Balancë — vizita e shkurtër', effects: ['+morale', '-form'] },
			{ id: 'career', label: 'Karriera para gjithçkaje', effects: ['+form', '-morale'] },
			{ id: 'break', label: 'Ndare — fokus total', effects: ['+form', '+ovr'] }
		]
	},
	{
		title: 'Mentor legjendë',
		body: 'Ish-lojtari i kombëtares të jep këshilla para ndeshjes së madhe.',
		choices: [
			{ id: 'listen', label: 'Dëgjon — eksperiencë', effects: ['+ovr', '+morale'] },
			{ id: 'ignore', label: 'Vetëm instinkt', effects: ['+form'] },
			{ id: 'photo', label: 'Selfie për Instagram', effects: ['+reputation', '-form'] }
		]
	},
	{
		title: 'Superliga — titulli në duar',
		body: 'Ndeshja e fundit. Fitore = kampion. Gjithë qyteti pret.',
		choices: [
			{ id: 'title', label: 'Gol i titullit — hero', effects: ['+reputation', '+ovr', '+morale'] },
			{ id: 'assist', label: 'Asistim — ekipi fiton', effects: ['+form', '+reputation'] },
			{ id: 'choke', label: 'Humbje — season i prishur', effects: ['-morale', '-reputation'] }
		]
	}
];

function playOffEvent(age: number): GameEvent {
	const group = age <= 14 ? 'U15' : 'U17';
	return {
		id: `hajvali-${age}`,
		title: `Play-Off Nacional — Hajvali (${group})`,
		body: `Kampi kombëtar në Hajvali. Scoutë nga Drita, Ballkani, Prishtina. ${group} — momenti yt.`,
		choices: [
			{
				id: 'star',
				label: 'Shkëlqes — dëshiro të të shohin',
				effects: ['+ovr', '+reputation', '+minutes', `flag:hajvali-${group.toLowerCase()}`]
			},
			{ id: 'team', label: 'Luaj për ekipin', effects: ['+form', '+morale'] },
			{ id: 'hide', label: 'Fshihesh — frikë nga presioni', effects: ['-morale', '-reputation'] }
		]
	};
}

export function getSeasonEvent(save: MahallaSave, rng: SeededRng): GameEvent {
	if (
		save.flags.includes('scammed') &&
		!save.flags.some((f) => f.startsWith('immune:scammed')) &&
		rng.chance(0.25)
	) {
		return {
			id: 'scam-return',
			title: 'Agjenti i rremë kthehet',
			body: 'Ai numri përsëri të shkruan. Këtë herë kërkon më shumë para.',
			choices: [
				{ id: 'learned', label: 'E raportoj te FFK', effects: ['+reputation'] },
				{ id: 'again', label: 'Paguaj përsëri…', effects: ['-morale', '-ovr'] }
			]
		};
	}

	if (save.player.age === 13 && save.player.reputation >= 6 && !save.flags.includes('hajvali-u15')) {
		return playOffEvent(13);
	}
	if (save.player.age === 15 && save.player.reputation >= 10 && !save.flags.includes('hajvali-u17')) {
		return playOffEvent(15);
	}

	if (
		save.careerStage === 'senior' &&
		getCurrentTier(save) >= 10 &&
		save.player.morale < 35 &&
		!save.flags.includes('returned-home') &&
		rng.chance(0.35)
	) {
		return {
			id: 'return-home',
			title: 'Kthimi në Kosovë?',
			body: 'Jashtë vendit nuk shkon. Superliga të pret — ose vazhdo të vuash.',
			choices: [
				{
					id: 'return',
					label: 'Kthehem — mjaft',
					effects: ['+morale', 'flag:returned-home', '-reputation']
				},
				{ id: 'stay', label: 'Ngulm — do ta bëj', effects: ['+form', '-morale'] },
				{ id: 'fight', label: 'Kërkoj transfer tjetër', effects: ['+reputation'] }
			]
		};
	}

	if (save.shfFriendName && rng.chance(0.2)) {
		return {
			id: 'friend-update',
			title: `Lajm nga ${save.shfFriendName}`,
			body: `${save.shfFriendName} (shoku yt nga SHF) ${save.friendOvr >= save.player.ovr ? 'po kalon para teje' : 'po mbetet prapa'}.`,
			choices: [
				{ id: 'motivate', label: 'E motivon — jeni shokë', effects: ['+morale'] },
				{ id: 'compete', label: 'Konkurrencë — do ta mposht', effects: ['+form', '+ovr'] },
				{ id: 'ignore', label: 'Nuk të intereson', effects: ['-morale'] }
			]
		};
	}

	if (
		save.careerStage === 'senior' &&
		getCurrentTier(save) >= 8 &&
		['ballkani', 'drita', 'prishtina'].includes(save.currentClub.id) &&
		rng.chance(0.15)
	) {
		return {
			id: 'uecl-event',
			title: 'UECL — nata evropiane',
			body: `${save.currentClub.name} në Evropë. Tribuna plot — momenti yt.`,
			choices: [
				{ id: 'hero', label: 'Shkëlqes në Evropë', effects: ['+reputation', '+ovr', '+national'] },
				{ id: 'solid', label: 'Luaj mirë për ekipin', effects: ['+form', '+morale'] },
				{ id: 'miss', label: 'Humb rastin — kritikë', effects: ['-morale', '-reputation'] }
			]
		};
	}

	const pool =
		save.player.age >= 16 || save.careerStage === 'senior'
			? [...YOUTH_EVENTS, ...SENIOR_EVENTS]
			: YOUTH_EVENTS;

	const base = rng.pick(pool);
	const body = base.body
		.replace('{rival}', save.rivalName)
		.replace('{friend}', save.shfFriendName ?? 'shoku');
	return { ...base, body, id: `ev-${save.player.season}-${rng.int(1, 999)}` };
}

export function applyChoice(
	player: PlayerState,
	effects: string[],
	flags: string[],
	save?: MahallaSave
): Partial<PlayerState> {
	const delta: Partial<PlayerState> = {};
	for (const e of effects) {
		if (e === '+ovr') delta.ovr = (delta.ovr ?? player.ovr) + 1;
		if (e === '-ovr') delta.ovr = (delta.ovr ?? player.ovr) - 1;
		if (e === '+form') delta.form = Math.min(99, (delta.form ?? player.form) + 8);
		if (e === '-form') delta.form = Math.max(20, (delta.form ?? player.form) - 8);
		if (e === '+morale') delta.morale = Math.min(99, (delta.morale ?? player.morale) + 10);
		if (e === '-morale') delta.morale = Math.max(10, (delta.morale ?? player.morale) - 12);
		if (e === '+reputation') delta.reputation = (delta.reputation ?? player.reputation) + 3;
		if (e === '-reputation') delta.reputation = Math.max(0, (delta.reputation ?? player.reputation) - 2);
		if (e === '+minutes') delta.minutes = (delta.minutes ?? player.minutes) + 450;
		if (e === '-minutes') delta.minutes = Math.max(0, (delta.minutes ?? player.minutes) - 200);
		if (e === 'injury') delta.injured = true;
		if (e === '+national' && save) {
			save.nationalCaps = (save.nationalCaps ?? 0) + 1;
			save.nationalLevel = nationalLevelForAge(save.player.age, save.nationalCaps);
		}
		if (e.startsWith('flag:') && !flags.some((f) => f === `immune:${e.slice(5)}`)) {
			flags.push(e.slice(5));
		}
	}
	return delta;
}

export function simulateSeason(
	save: MahallaSave,
	rng: SeededRng,
	choiceEffects: string[] = []
): SeasonRecap {
	const p = { ...save.player };

	const baseMinutes = p.age < 13 ? 800 : p.age < 16 ? 1200 : 2000;
	const formMod = (p.form - 70) / 10;
	const repMod = p.reputation / 20;
	let minutes = Math.round(baseMinutes * (1 + formMod * 0.1 + repMod * 0.15));
	if (p.injured) minutes = Math.round(minutes * 0.4);

	const adaptim = save.flags.includes('adaptim-active');
	if (adaptim) {
		p.form = Math.max(40, p.form - 6);
		p.morale = Math.max(10, p.morale - 5);
		minutes = Math.round(minutes * 0.85);
	}

	p.minutes = minutes;
	p.matches = Math.round(minutes / 70);

	let goals = 0;
	let assists = 0;
	if (p.position === 'FW') goals = rng.int(2, 8 + Math.floor(p.ovr / 15));
	else if (p.position === 'MF') {
		goals = rng.int(0, 4);
		assists = rng.int(1, 6);
	} else if (p.position === 'DF') assists = rng.int(0, 2);
	p.goals += goals;
	p.assists += assists;

	const ovrDelta = p.injured ? 0 : rng.chance(0.7) ? 1 : 0;
	p.ovr += ovrDelta;
	p.reputation += rng.chance(0.4) ? 1 : 0;
	p.age += 1;
	p.season += 1;
	p.injured = false;
	p.form = Math.max(40, Math.min(95, p.form + rng.int(-5, 5)));

	const minutesPct = Math.min(95, Math.round((minutes / 2000) * 100));
	const causes: CauseEntry[] = [
		{ label: 'Forma', value: Math.round((p.form - 50) * 0.4), positive: p.form >= 65 },
		{ label: 'Mosha / Përvoja', value: Math.round((p.age - 10) * 3), positive: p.age >= 12 },
		{ label: 'Reputacioni', value: Math.round(p.reputation * 1.5), positive: p.reputation >= 8 },
		{ label: 'Motivimi', value: Math.round((p.morale - 50) * 0.3), positive: p.morale >= 60 }
	];
	if (p.injured) causes.push({ label: 'Lëndim', value: -35, positive: false });
	if (adaptim) causes.push({ label: 'Adaptim jashtë', value: -22, positive: false });

	const tier = getCurrentTier(save);

	Object.assign(save.player, p);
	save.rivalOvr += rng.int(0, 2);
	save.friendOvr += rng.int(0, rng.chance(0.4) ? 2 : 1);
	if (save.nationalCaps > 0) {
		save.nationalLevel = nationalLevelForAge(p.age, save.nationalCaps);
	}

	save.seasonHistory.push({
		season: p.season - 1,
		age: p.age - 1,
		ovr: p.ovr,
		minutesPct,
		goals,
		assists,
		clubName: save.currentClub.name,
		tier
	});

	const ovrDeltaFinal = ovrDelta + (choiceEffects.includes('+ovr') ? 1 : 0);
	const recapBase = {
		headline: '',
		ovrDelta: ovrDeltaFinal,
		minutesPct,
		causes,
		goals,
		assists
	};

	if (adaptim) {
		save.flags = save.flags.filter((f) => f !== 'adaptim-active');
	}

	return {
		...recapBase,
		headline: pickHeadline(save, recapBase, rng)
	};
}

export function getAgeGroup(age: number): string {
	if (age <= 10) return 'U11';
	if (age <= 12) return 'U13';
	if (age <= 14) return 'U15';
	if (age <= 16) return 'U17';
	return 'Senior';
}

export const RETIRE_AGE = 38;
