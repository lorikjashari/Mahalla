export interface MahallaSettings {
	sound: boolean;
	haptics: boolean;
	reduceMotion: boolean;
}

const KEY = 'mahalla-settings';

const defaults: MahallaSettings = {
	sound: true,
	haptics: true,
	reduceMotion: false
};

function load(): MahallaSettings {
	if (typeof window === 'undefined') return { ...defaults };
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return { ...defaults };
		return { ...defaults, ...(JSON.parse(raw) as Partial<MahallaSettings>) };
	} catch {
		return { ...defaults };
	}
}

function applyMotion(reduce: boolean) {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle('reduce-motion', reduce);
}

class SettingsStore {
	sound = $state(defaults.sound);
	haptics = $state(defaults.haptics);
	reduceMotion = $state(defaults.reduceMotion);
	ready = $state(false);

	init() {
		if (this.ready || typeof window === 'undefined') return;
		const saved = load();
		this.sound = saved.sound;
		this.haptics = saved.haptics;
		this.reduceMotion = saved.reduceMotion;
		applyMotion(this.reduceMotion);
		this.ready = true;
	}

	persist() {
		if (typeof window === 'undefined') return;
		localStorage.setItem(
			KEY,
			JSON.stringify({
				sound: this.sound,
				haptics: this.haptics,
				reduceMotion: this.reduceMotion
			})
		);
		applyMotion(this.reduceMotion);
	}

	setSound(on: boolean) {
		this.sound = on;
		this.persist();
	}

	setHaptics(on: boolean) {
		this.haptics = on;
		this.persist();
	}

	setReduceMotion(on: boolean) {
		this.reduceMotion = on;
		this.persist();
	}
}

export const settings = new SettingsStore();

if (typeof window !== 'undefined') {
	settings.init();
}
