/** Sound-ready action hooks — wire audio later without changing UI */
export type FeedbackAction =
	| 'click'
	| 'confirm'
	| 'transfer'
	| 'milestone'
	| 'match'
	| 'notification'
	| 'achievement'
	| 'choice'
	| 'error';

const listeners = new Set<(action: FeedbackAction) => void>();

export function onFeedback(fn: (action: FeedbackAction) => void): () => void {
	listeners.add(fn);
	return () => listeners.delete(fn);
}

export function emitFeedback(action: FeedbackAction): void {
	for (const fn of listeners) fn(action);
}
