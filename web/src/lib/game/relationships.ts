import type { MahallaSave } from '$lib/game/types';
import { sq } from '$lib/i18n/sq';

export interface RelationshipEntry {
	id: string;
	name: string;
	role: string;
	value: number;
	status: string;
}

export function buildRelationships(save: MahallaSave): RelationshipEntry[] {
	const p = save.player;

	const coachVal = Math.min(99, p.form + 10);
	const agentVal = Math.min(99, p.reputation * 3);
	const familyVal = Math.min(99, p.morale);
	const friendVal = Math.min(99, 50 + (save.friendOvr - p.ovr) * 2);
	const rivalVal = Math.min(99, 40 + (save.rivalOvr - p.ovr) * 3);
	const partnerVal = p.age >= 18 ? Math.min(99, p.morale - 5) : 0;

	return [
		{
			id: 'coach',
			name: sq.relCoach,
			role: sq.relCoachRole,
			value: coachVal,
			status: coachVal >= 70 ? sq.relCoachGood : sq.relCoachBad
		},
		{
			id: 'agent',
			name: sq.relAgent,
			role: sq.relAgentRole,
			value: agentVal,
			status: agentVal >= 50 ? sq.relAgentActive : sq.relAgentQuiet
		},
		{
			id: 'family',
			name: sq.relFamily,
			role: sq.relFamilyRole,
			value: familyVal,
			status: familyVal >= 65 ? sq.relFamilySupport : sq.relFamilyWorry
		},
		{
			id: 'friend',
			name: save.shfFriendName,
			role: sq.relFriendRole,
			value: friendVal,
			status:
				save.friendOvr >= p.ovr ? sq.relFriendAhead : sq.relFriendTogether
		},
		{
			id: 'rival',
			name: save.rivalName,
			role: sq.relRivalRole,
			value: rivalVal,
			status: save.rivalOvr >= p.ovr ? sq.relRivalAhead : sq.relRivalBehind
		},
		...(p.age >= 18
			? [
					{
						id: 'partner',
						name: sq.relPartner,
						role: sq.relPartnerRole,
						value: partnerVal,
						status: partnerVal >= 60 ? sq.relPartnerOk : sq.relPartnerStrain
					}
				]
			: [])
	];
}
