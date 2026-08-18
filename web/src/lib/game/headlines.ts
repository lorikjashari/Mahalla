import type { MahallaSave, SeasonRecap } from '$lib/game/types';
import { getCurrentTier } from '$lib/game/mercato';
import { SeededRng } from '$lib/game/rng';

type HeadlineCtx = {
	save: MahallaSave;
	recap: SeasonRecap;
	tier: number;
	goals: number;
	assists: number;
	minutesPct: number;
};

const HEADLINES: ((c: HeadlineCtx) => string | null)[] = [
	(c) =>
		c.goals >= 10
			? `BOMBA: ${c.save.player.name} — ${c.goals} gola! Scoutë evropianë në tribuna`
			: null,
	(c) =>
		c.tier >= 26
			? `${c.save.player.name} në radar të Top 5 — ${c.save.currentClub.name} krenar`
			: null,
	(c) =>
		c.tier >= 23
			? `Eksporti kosovar shkëlqen: ${c.save.player.name}, ${c.goals} gola në ${c.save.currentClub.name}`
			: null,
	(c) =>
		c.tier >= 18 && c.tier < 23
			? `${c.save.player.name} po afrohet Evropës — sezon i fortë jashtë vendit`
			: null,
	(c) =>
		c.tier >= 10 && c.tier < 18
			? `${c.save.player.name} po afrohet Evropës — sezon i fortë te ${c.save.currentClub.name}`
			: null,
	(c) =>
		c.tier >= 7 && c.tier <= 8
			? `Superliga: ${c.save.player.name} — ${c.goals} gola, ${c.minutesPct}% minuta`
			: null,
	(c) =>
		c.tier >= 5 && c.tier <= 6
			? `Rritje e shpejtë: ${c.save.player.name} bëhet emër në ${c.save.currentClub.name}`
			: null,
	(c) =>
		c.save.player.age <= 14
			? `Talenti i vogël: ${c.save.player.name} impresionon në LRF`
			: null,
	(c) =>
		c.save.nationalCaps > 0
			? `Kombëtarja: ${c.save.player.name} (${c.save.nationalLevel}) — ${c.save.nationalCaps} ndeshje`
			: null,
	(c) =>
		c.save.flags.includes('hajvali-u15') || c.save.flags.includes('hajvali-u17')
			? `Hajvali thërret — ${c.save.player.name} në radar të FFK-së`
			: null,
	(c) =>
		c.save.flags.includes('derby-hero')
			? `HERO I DERBYT: ${c.save.player.name} shkëlqen kundër ${c.save.rivalName}`
			: null,
	(c) =>
		c.save.flags.includes('abroad-first')
			? `Hapi i parë jashtë: ${c.save.player.name} adaptim në ${c.save.currentClub.name}`
			: null,
	(c) =>
		c.save.flags.includes('returned-home')
			? `Kthim në atdhe: ${c.save.player.name} rikthehet në Superligë`
			: null,
	(c) =>
		c.recap.minutesPct >= 80
			? `${c.save.player.name} — pillar i ekipit: ${c.minutesPct}% minuta`
			: null,
	(c) =>
		c.recap.minutesPct < 30
			? `Luftë për minuta: ${c.save.player.name} i pakënaqur te ${c.save.currentClub.name}`
			: null,
	(c) =>
		c.goals === 0 && c.save.player.position === 'FW'
			? `Sezon i vështirë për sulmuesin ${c.save.player.name} — 0 gola`
			: null,
	(c) =>
		c.assists >= 5
			? `${c.save.player.name} — maestro: ${c.assists} asistime sezonin e kaluar`
			: null,
	(c) =>
		c.save.player.ovr >= 70
			? `OVR ${c.save.player.ovr}: ${c.save.player.name} në nivel elitë`
			: null,
	(c) =>
		c.save.rivalOvr < c.save.player.ovr
			? `${c.save.player.name} kalon rivalin ${c.save.rivalName} — konkurrencë e mbyllur`
			: `${c.save.rivalName} ende para — ${c.save.player.name} duhet më shumë`,
	(c) =>
		c.save.friendOvr > c.save.player.ovr
			? `${c.save.shfFriendName} po shkëlqen — ${c.save.player.name} motivohet`
			: null,
	(c) => `${c.save.player.name} shkëlqen — ${c.goals} gola sezonin e ${c.save.player.season - 1}`,
	(c) => `Talenti i ${c.save.currentClub.name} rritet — scoutë vëzhgojnë ${c.save.player.name}`,
	(c) => `Sezoni i mbyllur: ${c.save.player.name}, ${c.minutesPct}% minuta`,
	(c) => `Gazeta Sportive: ${c.save.currentClub.name} vazhdon me ${c.save.player.name}`,
	(c) => `FFK monitoron ${c.save.player.name} — a vjen thirrja e radhës?`,
	(c) => `Merkato verore: emri i ${c.save.player.name} qarkullon në ${c.save.currentClub.name}`,
	(c) => `Derbi rajonal: ${c.save.player.name} bën diferencën për ${c.save.currentClub.name}`,
	(c) => `Stadiumi rrëfen: ${c.save.player.name}, ${c.goals}G ${c.assists}A — sezon solid`,
	(c) => `Nga lagjja te fusha: ${c.save.player.name} — ${c.save.player.ovr} OVR në moshën ${c.save.player.age - 1}`,
	(c) => `Presingu e di emrin: ${c.save.player.name} rritet në SHF`,
	(c) => `UECL në horizont? ${c.save.player.name} te ${c.save.currentClub.name}`,
	(c) => `Agjentët e interesuar: ${c.save.player.name}, ${c.save.player.reputation} reputacion`,
	(c) => `Motivimi lart: ${c.save.player.name} gati për sezonin e ri`,
	(c) => `Forma e lartë — ${c.save.player.name} pret hapin tjetër`,
	(c) => `Kombëtarja thërret ${c.save.player.name}?`,
	(c) => `${c.save.player.name} — legjendë në ndërtim te ${c.save.currentClub.name}`
];

export function pickHeadline(save: MahallaSave, recap: SeasonRecap, rng: SeededRng): string {
	const tier = getCurrentTier(save);
	const ctx: HeadlineCtx = {
		save,
		recap,
		tier,
		goals: recap.goals,
		assists: recap.assists,
		minutesPct: recap.minutesPct
	};

	const matched = HEADLINES.map((fn) => fn(ctx)).filter((h): h is string => !!h);
	return rng.pick(matched.length > 0 ? matched : [`${save.player.name} — sezon i mbyllur`]);
}
