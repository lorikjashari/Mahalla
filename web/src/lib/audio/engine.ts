import type { FeedbackAction } from '$lib/game/feedback';

let ctx: AudioContext | null = null;

function ensureContext(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!ctx) ctx = new AudioContext();
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

function tone(
	freq: number,
	duration: number,
	type: OscillatorType = 'sine',
	volume = 0.08,
	delay = 0
) {
	const audio = ensureContext();
	if (!audio) return;
	const osc = audio.createOscillator();
	const gain = audio.createGain();
	osc.type = type;
	osc.frequency.value = freq;
	gain.gain.value = volume;
	gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + delay + duration);
	osc.connect(gain);
	gain.connect(audio.destination);
	osc.start(audio.currentTime + delay);
	osc.stop(audio.currentTime + delay + duration);
}

function noiseBurst(duration = 0.12, volume = 0.04) {
	const audio = ensureContext();
	if (!audio) return;
	const bufferSize = Math.floor(audio.sampleRate * duration);
	const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
	const src = audio.createBufferSource();
	const gain = audio.createGain();
	src.buffer = buffer;
	gain.gain.value = volume;
	src.connect(gain);
	gain.connect(audio.destination);
	src.start();
}

export function unlockAudio(): void {
	ensureContext();
}

export function playFeedbackSound(action: FeedbackAction): void {
	ensureContext();
	switch (action) {
		case 'click':
			tone(520, 0.04, 'triangle', 0.05);
			break;
		case 'choice':
			tone(440, 0.05, 'sine', 0.06);
			break;
		case 'confirm':
			tone(523, 0.07, 'sine', 0.07);
			tone(659, 0.09, 'sine', 0.06, 0.06);
			break;
		case 'transfer':
			tone(220, 0.15, 'sawtooth', 0.04);
			tone(440, 0.2, 'sine', 0.05, 0.08);
			break;
		case 'milestone':
		case 'achievement':
			tone(523, 0.1, 'sine', 0.07);
			tone(659, 0.1, 'sine', 0.07, 0.08);
			tone(784, 0.14, 'sine', 0.06, 0.16);
			break;
		case 'match':
			noiseBurst(0.14, 0.05);
			tone(330, 0.12, 'square', 0.03);
			break;
		case 'notification':
			tone(880, 0.06, 'sine', 0.05);
			break;
		case 'error':
			tone(180, 0.12, 'sawtooth', 0.06);
			break;
	}
}
