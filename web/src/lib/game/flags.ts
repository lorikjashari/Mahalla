/** Etiketa shqip për flags aktivë (memory log) */
export const FLAG_LABELS: Record<string, string> = {
	scammed: 'U mashtrua nga agjenti i rremë',
	bitter: 'Konflikt me shokun e SHF-së',
	'hajvali-u15': 'Play-Off Nacional U15 — Hajvali',
	'hajvali-u17': 'Play-Off Nacional U17 — Hajvali',
	'first-pro': 'Kontratë profesionale e parë',
	'abroad-first': 'Hapi i parë jashtë vendit',
	'returned-home': 'U ktheve në Kosovë pas dështimit jashtë',
	'derby-hero': 'Hero i derbyt rajonal',
	'immune:scammed': 'Imun ndaj agjentëve mashtrues'
};

export function getActiveMemories(flags: string[]): { id: string; label: string }[] {
	return flags
		.filter((f) => FLAG_LABELS[f])
		.map((f) => ({ id: f, label: FLAG_LABELS[f] }));
}
