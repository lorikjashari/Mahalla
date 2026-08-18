export type NationalLevel = 'none' | 'U15' | 'U17' | 'U21' | 'Dardanët';

export interface InterviewChoice {
	id: string;
	label: string;
	effects: Partial<{ ovr: number; morale: number; reputation: number; form: number }>;
}

export interface InterviewQuestion {
	id: string;
	question: string;
	choices: InterviewChoice[];
}

export const INTERVIEW: InterviewQuestion[] = [
	{
		id: 'decision',
		question: 'Kush vendos për karrierën tënde?',
		choices: [
			{ id: 'family', label: 'Familja — ata e dinë më mirë', effects: { morale: 5 } },
			{ id: 'self', label: 'Unë vetë — zgjedhjet e mia', effects: { reputation: 2, form: 3 } },
			{ id: 'coach', label: 'Trajneri i SHF-së', effects: { form: 5, ovr: 1 } }
		]
	},
	{
		id: 'dream',
		question: 'Çfarë ëndërron?',
		choices: [
			{ id: 'local', label: 'Të bëhem yll i lagjes', effects: { morale: 8, reputation: 2 } },
			{ id: 'abroad', label: 'Të luaj jashtë — Zvicër, Gjermani…', effects: { reputation: 3, form: 2 } },
			{ id: 'national', label: 'Të vesh fanellën e Dardanëve', effects: { ovr: 1, morale: 5 } }
		]
	},
	{
		id: 'style',
		question: 'Si jeton jashtë fushës?',
		choices: [
			{ id: 'discipline', label: 'Disiplinë — shtëpi herët, stërvitje', effects: { form: 8, ovr: 1 } },
			{ id: 'balance', label: 'Balancë — shkollë, shokë, futboll', effects: { morale: 5, form: 3 } },
			{ id: 'party', label: 'Jetë e shpejtë — TikTok, hangout', effects: { morale: 10, form: -5 } }
		]
	}
];

export function applyInterviewProfile(
	player: { ovr: number; morale: number; reputation: number; form: number },
	choiceIds: string[]
): void {
	for (const q of INTERVIEW) {
		const choice = q.choices.find((c) => choiceIds.includes(c.id));
		if (!choice) continue;
		if (choice.effects.ovr) player.ovr += choice.effects.ovr;
		if (choice.effects.morale)
			player.morale = Math.min(99, Math.max(10, player.morale + choice.effects.morale));
		if (choice.effects.reputation) player.reputation += choice.effects.reputation;
		if (choice.effects.form)
			player.form = Math.min(99, Math.max(20, player.form + choice.effects.form));
	}
}

export function nationalLevelForAge(age: number, caps: number): NationalLevel {
	if (caps === 0) return 'none';
	if (age <= 15) return 'U15';
	if (age <= 17) return 'U17';
	if (age <= 21) return 'U21';
	return 'Dardanët';
}
