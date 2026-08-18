import { onFeedback, type FeedbackAction } from '$lib/game/feedback';
import { settings } from '$lib/game/settings.svelte';
import { playFeedbackSound, unlockAudio } from '$lib/audio/engine';

const HAPTIC: Partial<Record<FeedbackAction, number[]>> = {
	click: [8],
	confirm: [12, 24, 12],
	transfer: [16, 32, 16],
	milestone: [20, 40, 20, 40],
	achievement: [24, 48, 24],
	match: [10, 20, 10],
	error: [30, 30, 30]
};

let wired = false;

function vibrate(action: FeedbackAction) {
	if (!settings.haptics || typeof navigator === 'undefined' || !navigator.vibrate) return;
	const pattern = HAPTIC[action];
	if (pattern) navigator.vibrate(pattern);
}

function handle(action: FeedbackAction) {
	unlockAudio();
	if (settings.sound) playFeedbackSound(action);
	vibrate(action);
}

export function wireFeedbackBridge(): () => void {
	if (wired || typeof window === 'undefined') return () => {};
	wired = true;
	return onFeedback(handle);
}
